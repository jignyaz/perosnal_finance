"""
Gemini AI Intelligence Layer — using direct REST API (no external AI packages required).
Implements anomaly detection + context-aware prediction adjustment + chat.
"""

import os
import json
import re
import urllib.request
import urllib.error
import ssl
from typing import Dict, Any, List, Tuple

# Universal Gemini v1beta endpoint base
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta"
_DETECTED_MODEL = "models/gemini-1.5-flash"

# ─── utilities ────────────────────────────────────────────────────────────────

def _get_best_model(api_key: str, ctx: ssl.SSLContext) -> str:
    """Auto-detect the best available Flash model for this API key."""
    global _DETECTED_MODEL
    if _DETECTED_MODEL != "models/gemini-1.5-flash":
        return _DETECTED_MODEL
        
    try:
        url = f"{GEMINI_BASE_URL}/models?key={api_key}"
        with urllib.request.urlopen(urllib.request.Request(url), timeout=5, context=ctx) as r:
            data = json.loads(r.read())
            flash_models = [m["name"] for m in data.get("models", []) if "flash" in m["name"]]
            if flash_models:
                _DETECTED_MODEL = flash_models[0]
                print(f"Using detected model: {_DETECTED_MODEL}")
    except Exception as e:
        print(f"Model detection failed: {e}")
        
    return _DETECTED_MODEL

def _call_gemini(system_prompt: str, user_prompt: str, api_key: str) -> str:
    """Make a direct REST call to Gemini. Returns raw text response."""
    # Create an SSL context that bypasses verification for Windows stability
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    model_id = _get_best_model(api_key, ctx)
    merged_prompt = f"System Instructions: {system_prompt}\n\nUser Question: {user_prompt}"
    
    payload = json.dumps({
        "contents": [{"parts": [{"text": merged_prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 1024
        }
    }).encode("utf-8")

    url = f"{GEMINI_BASE_URL}/{model_id}:generateContent?key={api_key}"
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"Gemini HTTP Error {e.code}: {body}")
        raise
    except Exception as e:
        print(f"Gemini call failed: {e}")
        raise

def _call_with_fallback(system_prompt: str, user_prompt: str, api_key: str, ctx: ssl.SSLContext) -> str:
    """Fallback to gemini-pro if flash is not found."""
    fallback_url = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent"
    url = f"{fallback_url}?key={api_key}"
    payload = json.dumps({
        "contents": [{"parts": [{"text": f"System Instructions: {system_prompt}\nUser Prompt: {user_prompt}"}]}]
    }).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()


# ─── anomaly detection (no LLM needed) ────────────────────────────────────────

def detect_and_remove_anomalies(
    monthly_data: Dict[str, float]
) -> Tuple[Dict[str, float], List[tuple]]:
    """
    IQR-based anomaly detection on monthly expense history.
    Returns (cleaned_data, list_of_removed_months).
    """
    if len(monthly_data) < 3:
        return monthly_data, []

    values = list(monthly_data.values())
    sorted_vals = sorted(values)
    q1 = sorted_vals[len(sorted_vals) // 4]
    q3 = sorted_vals[(3 * len(sorted_vals)) // 4]
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    mean = sum(values) / len(values)

    cleaned, removed = {}, []
    for month, val in monthly_data.items():
        if lower <= val <= upper:
            cleaned[month] = val
        else:
            cleaned[month] = mean          # Replace anomaly with mean
            removed.append((month, round(val, 2)))

    return cleaned, removed


# ─── context builder ──────────────────────────────────────────────────────────

def build_financial_context(
    monthly_expenses: Dict[str, float],
    category_breakdown: Dict[str, float],
    user_profile: Dict[str, Any],
    baseline_prediction: float
) -> str:
    sorted_months = sorted(monthly_expenses.keys())
    recent = sorted_months[-3:] if len(sorted_months) >= 3 else sorted_months

    month_str = "\n".join(
        f"  - {m}: \u20b9{monthly_expenses[m]:,.0f}" for m in recent
    )
    top_cats = sorted(category_breakdown.items(), key=lambda x: x[1], reverse=True)[:5]
    cat_str = "\n".join(f"  - {c}: \u20b9{a:,.0f}" for c, a in top_cats)

    trend = "stable"
    if len(recent) >= 2:
        last = monthly_expenses[recent[-1]]
        prev = monthly_expenses[recent[-2]]
        pct = ((last - prev) / prev * 100) if prev > 0 else 0
        trend = f"{'rising' if pct > 0 else 'falling'} ({pct:+.1f}% MoM)"

    return f"""USER PROFILE:
- Employment: {user_profile.get('employment_type', 'unknown')}
- Financial Goal: {user_profile.get('financial_goal', 'balanced')}
- Risk Tolerance: {user_profile.get('risk_tolerance', 1.0)}/2.0
- Fixed Monthly Burn: \u20b9{user_profile.get('fixed_monthly_burn', 0):,.0f}
- Monthly Budget: \u20b9{user_profile.get('monthly_budget', 0):,.0f}

RECENT EXPENSES (last 3 months):
{month_str}

TREND: {trend}

TOP CATEGORIES:
{cat_str}

ENSEMBLE MODEL PREDICTION: \u20b9{baseline_prediction:,.0f}"""


# ─── LLM-based adjustment ─────────────────────────────────────────────────────

def get_prediction_adjustment(
    context: str,
    api_key: str,
    baseline: float
) -> Dict[str, Any]:
    system_prompt = (
        "You are a precise financial analyst AI. Analyze spending patterns and suggest "
        "an evidence-based adjustment to an ML prediction. "
        "Rules: Only adjust between -20% and +20%. Be conservative. "
        "Output ONLY valid JSON, no markdown fences."
    )
    user_prompt = f"""{context}

Return EXACTLY this JSON:
{{
  "adjustment_percent": <float -20 to 20>,
  "confidence": <float 0.0 to 1.0>,
  "reasoning": "<one sentence>",
  "category_insights": ["<insight 1>", "<insight 2>"],
  "risk_flag": <true or false>
}}"""

    try:
        raw = _call_gemini(system_prompt, user_prompt, api_key)
        raw = re.sub(r"```json\s*|\s*```", "", raw).strip()
        result = json.loads(raw)

        adj = float(result.get("adjustment_percent", 0))
        adj = max(-20.0, min(20.0, adj))
        result["adjustment_percent"] = adj
        result["adjusted_prediction"] = round(baseline * (1 + adj / 100), 2)
        return result

    except Exception as e:
        print(f"Gemini adjustment failed: {e}")
        return {
            "adjustment_percent": 0.0,
            "confidence": 0.0,
            "reasoning": "AI analysis unavailable — using ensemble prediction as-is.",
            "category_insights": [],
            "risk_flag": False,
            "adjusted_prediction": baseline
        }


# ─── chat ─────────────────────────────────────────────────────────────────────

def generate_chat_response(
    question: str,
    context: str,
    transaction_summary: str,
    api_key: str
) -> str:
    system_prompt = (
        "You are a friendly, professional Global Financial Concierge for a personal finance dashboard. "
        "You have a holistic view of the user's entire financial state across all pages of the website.\n\n"
        "SITE ARCHITECTURE KNOWLEDGE:\n"
        "1. Dashboard (/): Overview of recent transactions and net balance.\n"
        "2. Analytics (/analytics): Deep-dive into spending velocity and AI-driven forecasts.\n"
        "3. Budgets (/budgets): Tracking specific budget goals and due dates.\n"
        "4. Transactions (/transactions): Historical list and CSV upload capabilities.\n\n"
        "RULES:\n"
        "1. Contextual Awareness: Refer to 'CURRENT VIEW' to know what the user is looking at.\n"
        "2. Holistic Insight: Compare 'Transactions summary' against 'ACTIVE BUDGETS' to provide proactive advice.\n"
        "3. Site Guidance: Mention specific pages (e.g., 'You can manage this in the Budgets tab') when relevant.\n"
        "4. Specificity: Use exact numbers (₹) from the context.\n"
        "5. Conciseness: 2-3 sentences max. Always complete your thoughts."
    )
    user_prompt = f"""Financial data:
{context}

Transactions summary:
{transaction_summary}

User question: {question}"""

    try:
        return _call_gemini(system_prompt, user_prompt, api_key)
    except Exception as e:
        return f"Sorry, I couldn\u2019t process that right now. Please check your GOOGLE_API_KEY in .env."


# ─── main entry point ─────────────────────────────────────────────────────────

def run_langchain_enhancement(
    monthly_expenses: Dict[str, float],
    category_breakdown: Dict[str, float],
    user_profile: Dict[str, Any],
    baseline_prediction: float
) -> Dict[str, Any]:
    """
    Full Gemini AI pipeline:
      1. Statistical anomaly detection
      2. Context building
      3. LLM-based prediction adjustment
    """
    api_key = os.getenv("GOOGLE_API_KEY", "")

    # Step 1 — anomaly detection (no API needed)
    cleaned_data, removed_anomalies = detect_and_remove_anomalies(monthly_expenses)

    if not api_key:
        return {
            "adjusted_prediction": baseline_prediction,
            "adjustment_percent": 0.0,
            "confidence": 0.0,
            "reasoning": "Add your GOOGLE_API_KEY to backend/.env to enable Gemini AI insights.",
            "category_insights": [],
            "risk_flag": False,
            "anomalies_removed": removed_anomalies,
            "langchain_active": False
        }

    # Step 2 — build context
    context = build_financial_context(
        cleaned_data, category_breakdown, user_profile, baseline_prediction
    )

    # Step 3 — get LLM adjustment
    result = get_prediction_adjustment(context, api_key, baseline_prediction)
    result["anomalies_removed"] = removed_anomalies
    result["langchain_active"] = True

    return result


# ─── public helpers re-exported for main.py ───────────────────────────────────

def _get_llm():
    """Compatibility shim — returns the API key or None."""
    return os.getenv("GOOGLE_API_KEY") or None
