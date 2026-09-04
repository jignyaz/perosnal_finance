import os
import io
import csv

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError as e:
    import sys
    print("DIAGNOSTICS - ImportError:", e, flush=True)
    print("DIAGNOSTICS - sys.path:", sys.path, flush=True)
    print("DIAGNOSTICS - os.environ:", dict(os.environ), flush=True)
    # List contents of PYTHONPATH directories
    pythonpath = os.environ.get("PYTHONPATH", "")
    for path in pythonpath.split(":"):
        if os.path.exists(path):
            try:
                print(f"DIAGNOSTICS - Contents of {path}:", os.listdir(path), flush=True)
            except Exception as ex:
                print(f"DIAGNOSTICS - Error listing {path}: {ex}", flush=True)
        else:
            print(f"DIAGNOSTICS - {path} does not exist", flush=True)
    raise

# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlmodel import Session, select
from typing import List, Optional
try:
    import pandas as pd
except ImportError:
    pd = None

try:
    import numpy as np
    import tensorflow as tf
    from tensorflow import keras
    import joblib
    import pickle
    ML_AVAILABLE = True
except ImportError:
    np = None
    tf = None
    keras = None
    joblib = None
    pickle = None
    ML_AVAILABLE = False

from database import create_db_and_tables, get_session
from models import User, Transaction, BudgetItem, UserUpdate, TransactionCreate, BudgetItemCreate, UserCreate
from auth import (
    get_current_user,
    create_access_token,
    get_password_hash,
    verify_password,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    set_auth_cookie,
    clear_auth_cookie
)
from datetime import timedelta, datetime
import plaid_integration as plaid_helper
from crypto import encrypt_value, decrypt_value, mask_api_key, ensure_encryption_secret_in_env
from security import rate_limit, add_security_headers_to_response, sanitize_data_payload

try:
    from langchain_engine import run_langchain_enhancement, generate_chat_response, _get_llm, build_financial_context
    LANGCHAIN_LOADED = True
except Exception as e:
    print(f"Gemini AI engine not loaded: {e}")
    LANGCHAIN_LOADED = False

app = FastAPI(
    title="Personal Finance API",
    description="Enterprise-grade AI-powered personal financial dashboard and forecasting backend",
    version="2.0.0"
)

# ─── Security Headers Middleware ──────────────────────────────────────────────
@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    add_security_headers_to_response(response)
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Assets Configuration
ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")

# Models and Scalers
MODELS = {
    "lstm_arima": None,
    "gru_ets": None,
    "arima_base": None,
    "ets_base": None,
    "scaler_arima": None,
    "scaler_ets": None
}

def load_ai_assets():
    if not ML_AVAILABLE:
        print("ML dependencies missing. AI assets will not be loaded.")
        return
        
    try:
        # Load Neural Models
        lstm_path = os.path.join(ASSETS_DIR, "lstm_arima_residuals.h5")
        gru_path = os.path.join(ASSETS_DIR, "gru_ets_residuals.h5")
        
        if os.path.exists(lstm_path):
            MODELS["lstm_arima"] = keras.models.load_model(lstm_path, compile=False)
        if os.path.exists(gru_path):
            MODELS["gru_ets"] = keras.models.load_model(gru_path, compile=False)
            
        # Load Statistical Models & Scalers
        arima_model_path = os.path.join(ASSETS_DIR, "arima_hybrid_base.pkl")
        ets_model_path = os.path.join(ASSETS_DIR, "ets_hybrid_base.pkl")
        scaler_arima_path = os.path.join(ASSETS_DIR, "scaler_arima.pkl")
        scaler_ets_path = os.path.join(ASSETS_DIR, "scaler_ets.pkl")
        
        if os.path.exists(arima_model_path):
            with open(arima_model_path, 'rb') as f: MODELS["arima_base"] = pickle.load(f)
        if os.path.exists(ets_model_path):
            with open(ets_model_path, 'rb') as f: MODELS["ets_base"] = pickle.load(f)
        if os.path.exists(scaler_arima_path):
            MODELS["scaler_arima"] = joblib.load(scaler_arima_path)
        if os.path.exists(scaler_ets_path):
            MODELS["scaler_ets"] = joblib.load(scaler_ets_path)
            
        print("Successfully loaded Master Ensemble AI assets.")
    except Exception as e:
        print(f"Error loading AI assets: {e}")

@app.on_event("startup")
def on_startup():
    # Auto-generate ENCRYPTION_SECRET if not present
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    ensure_encryption_secret_in_env(env_path)
    try:
        from migrate_db import migrate as run_db_migration
        run_db_migration()
    except Exception as e:
        print(f"Database migration failed: {e}")
    create_db_and_tables()
    load_ai_assets()

# --- Auth Endpoints ---

@app.post("/token", dependencies=[Depends(rate_limit(max_requests=5, window_seconds=60, key_prefix="login"))])
async def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    # Set HttpOnly cookie for XSS-safe browser session
    set_auth_cookie(response, access_token)
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/logout")
def logout(response: Response):
    """Securely clear the HttpOnly access token cookie."""
    clear_auth_cookie(response)
    return {"message": "Successfully logged out"}

# --- Plaid Endpoints ---

@app.post("/api/create_link_token")
async def create_link_token(current_user: User = Depends(get_current_user)):
    user_id = str(current_user.id)
    response = plaid_helper.create_link_token(user_id)
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    return response

@app.post("/api/set_access_token")
async def set_access_token(public_token: str, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    response = plaid_helper.exchange_public_token(public_token)
    if "error" in response:
        raise HTTPException(status_code=400, detail=response["error"])
    
    # Store access_token in user profile
    current_user.plaid_access_token = response.get('access_token')
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return {"message": "Public token exchanged successfully", "item_id": response.get('item_id')}

@app.post("/register", dependencies=[Depends(rate_limit(max_requests=5, window_seconds=60, key_prefix="register"))])
def register(user_data: UserCreate, response: Response, session: Session = Depends(get_session)):
    try:
        # Check if user exists
        existing_user = session.exec(select(User).where(User.username == user_data.username)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already registered")
        
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            username=user_data.username, 
            password_hash=hashed_password,
            full_name=user_data.full_name,
            phone_number=user_data.phone_number,
            dob=user_data.dob,
            initial_balance=user_data.initial_balance,
            monthly_budget=user_data.monthly_budget,
            fixed_monthly_burn=user_data.fixed_monthly_burn,
            employment_type=user_data.employment_type,
            financial_goal=user_data.financial_goal,
            risk_tolerance=user_data.risk_tolerance
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        # Issue token and set cookie
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": new_user.username}, expires_delta=access_token_expires
        )
        set_auth_cookie(response, access_token)

        return {"message": "User registered successfully", "access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Registration error: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    # Mask the encrypted API keys before sending to frontend
    user_dict = current_user.dict()
    if user_dict.get("gemini_api_key"):
        decrypted = decrypt_value(user_dict["gemini_api_key"])
        user_dict["gemini_api_key"] = mask_api_key(decrypted)
    if user_dict.get("groq_api_key"):
        decrypted = decrypt_value(user_dict["groq_api_key"])
        user_dict["groq_api_key"] = mask_api_key(decrypted)
    return user_dict

@app.put("/users/me")
async def update_user(user_update: UserUpdate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    user_db = session.get(User, current_user.id)
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_data = user_update.dict(exclude_unset=True)
    
    # Encrypt the Gemini API key before storing in DB
    if "gemini_api_key" in user_data and user_data["gemini_api_key"]:
        raw_key = user_data["gemini_api_key"]
        # Don't re-encrypt if user sent back a masked value (e.g. "AIza...227E")
        if "..." not in raw_key:
            user_data["gemini_api_key"] = encrypt_value(raw_key)
        else:
            # User didn't change the key, remove from update
            del user_data["gemini_api_key"]

    # Encrypt the Groq API key before storing in DB
    if "groq_api_key" in user_data and user_data["groq_api_key"]:
        raw_key = user_data["groq_api_key"]
        if "..." not in raw_key:
            user_data["groq_api_key"] = encrypt_value(raw_key)
        else:
            # User didn't change the key, remove from update
            del user_data["groq_api_key"]
    
    for key, value in user_data.items():
        setattr(user_db, key, value)
        
    session.add(user_db)
    session.commit()
    session.refresh(user_db)
    
    # Return masked response
    result = user_db.dict()
    if result.get("gemini_api_key"):
        decrypted = decrypt_value(result["gemini_api_key"])
        result["gemini_api_key"] = mask_api_key(decrypted)
    if result.get("groq_api_key"):
        decrypted = decrypt_value(result["groq_api_key"])
        result["groq_api_key"] = mask_api_key(decrypted)
    return result

# --- App Endpoints ---

@app.get("/transactions", response_model=List[Transaction])
def get_transactions(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(Transaction).where(Transaction.user_id == current_user.id)
    return session.exec(statement).all()

@app.post("/transactions", response_model=Transaction)
def create_transaction(transaction: TransactionCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # Convert Create model to DB model
    new_transaction = Transaction(
        user_id=current_user.id,
        **transaction.dict()
    )
    
    # Add reward points (10 points per transaction)
    user_db = session.get(User, current_user.id)
    if user_db:
        user_db.reward_points = (user_db.reward_points or 0) + 10
        session.add(user_db)
        
    session.add(new_transaction)
    session.commit()
    session.refresh(new_transaction)
    return new_transaction

@app.delete("/transactions")
def delete_all_transactions(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(Transaction).where(Transaction.user_id == current_user.id)
    results = session.exec(statement)
    for transaction in results:
        session.delete(transaction)
    session.commit()
    return {"message": "All transactions deleted successfully"}

def parse_date_robustly(date_str: str) -> datetime:
    """Robust date parser using standard library only."""
    if not date_str:
        raise ValueError("Empty date string")
    
    # Try common formats
    formats = [
        "%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y", "%d/%m/%Y", 
        "%Y/%m/%d", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%S.%f"
    ]
    
    # Cleanup: remove Z, common timezone offsets for simple parsing
    clean_str = date_str.replace("Z", "").split("+")[0].strip()
    
    for fmt in formats:
        try:
            return datetime.strptime(clean_str, fmt)
        except ValueError:
            continue
            
    # If all fail, try isoformat as a last resort
    try:
        return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except:
        raise ValueError(f"Could not parse date: {date_str}")

@app.post("/upload-transactions")
async def upload_transactions(file: UploadFile = File(...), session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    try:
        content = await file.read()
        # Decode bytes with 'utf-8-sig' to automatically handle the BOM character (Byte Order Mark) from Excel
        try:
            decoded_content = content.decode('utf-8-sig')
        except UnicodeDecodeError:
            # Fallback for ISO-8859-1 (Common for older local spreadsheets)
            decoded_content = content.decode('iso-8859-1')
        
        # Use csv module to parse
        csv_reader = csv.DictReader(io.StringIO(decoded_content))
        
        transactions = []
        errors = []
        for row_idx, row in enumerate(csv_reader, start=1):
            if not row:
                continue
                
            # Helper: Case-insensitive and flexible key lookup
            def get_val(keys):
                for k in row.keys():
                    if any(target.lower() in k.lower() for target in keys):
                        return row[k]
                return None

            # Parse date
            date_str = get_val(['date'])
            try:
                date_obj = parse_date_robustly(date_str)
            except Exception as e:
                errors.append(f"Row {row_idx}: {str(e)}")
                continue

            # Parse amount (Flexible matching for Amt, Amount, Value)
            amount_val = get_val(['amount', 'amt', 'value', 'total']) or 0
            
            t = Transaction(
                user_id=current_user.id,
                date=date_obj,
                amount=float(amount_val),
                category=str(get_val(['category', 'cat', 'type']) or 'Uncategorized'),
                type=str(get_val(['type', 'kind']) or 'expense').lower(),
                description=str(get_val(['description', 'desc', 'title', 'narration']) or 'Imported transaction')
            )
            session.add(t)
            transactions.append(t)
        
        if len(transactions) == 0 and errors:
            raise HTTPException(status_code=400, detail=f"Failed to import any transactions. Common issue: {errors[0]}")

        session.commit()
        
        response = {"message": f"Successfully imported {len(transactions)} transactions"}
        if errors:
            response["warnings"] = errors[:5] # Cap warnings for readability
                
        return response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/budgets", response_model=List[BudgetItem])
def get_budgets(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(BudgetItem).where(BudgetItem.user_id == current_user.id)
    return session.exec(statement).all()

@app.post("/budgets", response_model=BudgetItem)
def create_budget(item: BudgetItemCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # Convert Create model to DB model
    new_budget = BudgetItem(
        user_id=current_user.id,
        **item.dict()
    )
    session.add(new_budget)
    session.commit()
    session.refresh(new_budget)
    return new_budget

@app.get("/stats")
def get_stats(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    transactions = session.exec(select(Transaction).where(Transaction.user_id == current_user.id)).all()
    
    total_expenses = sum(t.amount for t in transactions if t.type == 'expense')
    total_income = sum(t.amount for t in transactions if t.type == 'income')
    
    # Net Worth = Initial Balance + Income - Expenses
    net_worth = current_user.initial_balance + total_income - total_expenses
    
    return {
        "total_expenses": total_expenses,
        "net_worth": net_worth,
        "transaction_count": len(transactions),
        "monthly_budget": current_user.monthly_budget,
        "reward_points": current_user.reward_points
    }


@app.get("/predict-expenses")
def predict_expenses(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    """Predicts future expenses using the Integrated Neural Network (LSTM) or Statistical Fallback"""
    transactions = session.exec(select(Transaction).where(
        Transaction.user_id == current_user.id,
        Transaction.type == 'expense'
    )).all()
    
    # 1. Prepare monthly historical data
    monthly_data = {}
    for t in transactions:
        m_key = t.date.strftime("%Y-%m")
        # Ensure we only use positive expense values
        monthly_data[m_key] = monthly_data.get(m_key, 0) + abs(t.amount)
    
    sorted_months = sorted(monthly_data.keys())
    historical_vals = [monthly_data[m] for m in sorted_months]
    
    # 2. Ensemble Prediction Logic
    user_floor = current_user.fixed_monthly_burn or 2000.0
    
    # Check if we have enough data and models
    can_use_ensemble = (
        len(historical_vals) >= 3 and 
        MODELS["arima_base"] and MODELS["ets_base"] and 
        MODELS["scaler_arima"] and MODELS["scaler_ets"]
    )
    
    if can_use_ensemble:
        try:
            # Prepare inputs
            recent_3 = np.array(historical_vals[-3:], dtype=float).reshape(1, 3, 1)
            
            # A. ARIMA Stream
            arima_pred = float(MODELS["arima_base"].forecast(steps=1)[0])
            scaled_a = MODELS["scaler_arima"].transform(recent_3.reshape(-1, 1)).reshape(1, 3, 1)
            res_a = float(MODELS["lstm_arima"].predict(scaled_a, verbose=0)[0][0])
            # Inverse scale residual (assuming simple scaling or using trained range)
            # In research, residual was added back to base. Result = Base + (Residual correction)
            hybrid_a = arima_pred + (res_a * arima_pred * 0.1) # Weighted correction
            
            # B. ETS Stream
            ets_pred = float(MODELS["ets_base"].forecast(steps=1)[0])
            scaled_e = MODELS["scaler_ets"].transform(recent_3.reshape(-1, 1)).reshape(1, 3, 1)
            res_e = float(MODELS["gru_ets"].predict(scaled_e, verbose=0)[0][0])
            hybrid_e = ets_pred + (res_e * ets_pred * 0.1)
            
            # C. Master Stacking (Weighted Average)
            # Weights: 40% ARIMA, 30% ETS, 15% Hybrid A, 15% Hybrid E
            predicted_baseline = (
                (0.40 * arima_pred) + 
                (0.30 * ets_pred) + 
                (0.15 * hybrid_a) + 
                (0.15 * hybrid_e)
            )
            
            method = "Master Stacking Ensemble (ARIMA+ETS+LSTM+GRU)"
            baseline = float(max(user_floor, predicted_baseline))
            
        except Exception as e:
            print(f"Ensemble Prediction failed, falling back: {e}")
            baseline = float(sum(historical_vals[-3:]) / 3) if historical_vals else user_floor
            method = "Stability Fallback (Moving Average)"
    else:
        # Statistical Fallback incorporating user fields
        if historical_vals:
            if len(historical_vals) >= 2:
                # Weighted average + boost for 'lifestyle' goals
                weight_factor = 1.1 if current_user.financial_goal == 'lifestyle' else 1.0
                baseline = float((historical_vals[-1] * 0.7) + (historical_vals[-2] * 0.3)) * weight_factor
            else:
                baseline = float(historical_vals[-1])
        else:
            baseline = user_floor
        method = "Augmented Statistical Engine"
    
    # Apply Risk Tolerance - higher tolerance means higher upper bounds
    risk_factor = getattr(current_user, 'risk_tolerance', 1.0)
    
    # 3. Generate 6-month forecast
    predictions = []
    if transactions:
        last_date = max(t.date for t in transactions).replace(day=1)
    else:
        last_date = datetime.utcnow().replace(day=1)
        
    current_date = last_date
    
    # Growth factor based on goal
    growth_rate = 1.01
    if current_user.financial_goal == 'savings':
        growth_rate = 0.99 # Predict declining expenses
    elif current_user.financial_goal == 'lifestyle':
        growth_rate = 1.03 # Predict higher expenses
        
    for i in range(1, 7):
        if current_date.month == 12:
            current_date = current_date.replace(year=current_date.year + 1, month=1)
        else:
            current_date = current_date.replace(month=current_date.month + 1)
            
        val = float(baseline * (growth_rate ** i))
        
        predictions.append({
            "month": str(current_date.strftime("%Y-%m")),
            "predicted_amount": round(val, 2),
            "lower_bound": round(val * (0.85 / risk_factor), 2),
            "upper_bound": round(val * (1.15 * risk_factor), 2)
        })

    return {
        "status": "success",
        "method": str(method),
        "user_goal": current_user.financial_goal,
        "input_samples": int(len(historical_vals)),
        "baseline_used": round(float(baseline), 2),
        "predictions": predictions
    }


@app.get("/predict-expenses-v2", dependencies=[Depends(rate_limit(max_requests=20, window_seconds=60, key_prefix="predict_v2"))])
def predict_expenses_v2(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    """
    LangChain-enhanced prediction endpoint.
    Runs the base ensemble, then applies Gemini AI reasoning for anomaly correction and insight generation.
    """
    transactions = session.exec(select(Transaction).where(
        Transaction.user_id == current_user.id,
        Transaction.type == 'expense'
    )).all()

    # Build monthly data
    monthly_data = {}
    category_data = {}
    for t in transactions:
        m_key = t.date.strftime("%Y-%m")
        monthly_data[m_key] = monthly_data.get(m_key, 0) + abs(t.amount)
        category_data[t.category] = category_data.get(t.category, 0) + abs(t.amount)

    sorted_months = sorted(monthly_data.keys())
    historical_vals = [monthly_data[m] for m in sorted_months]

    # Compute baseline (reuse statistical fallback logic)
    user_floor = current_user.fixed_monthly_burn or 2000.0
    if historical_vals:
        if len(historical_vals) >= 2:
            baseline = float(historical_vals[-1] * 0.6 + historical_vals[-2] * 0.4)
        else:
            baseline = float(historical_vals[-1])
    else:
        baseline = user_floor

    baseline = max(baseline, user_floor)

    # Build user profile dict for LangChain
    user_profile = {
        "employment_type": current_user.employment_type,
        "financial_goal": current_user.financial_goal,
        "risk_tolerance": current_user.risk_tolerance,
        "fixed_monthly_burn": current_user.fixed_monthly_burn,
        "monthly_budget": current_user.monthly_budget,
    }

    # Run LangChain enhancement
    ai_result = {}
    if LANGCHAIN_LOADED and monthly_data:
        try:
            ai_result = run_langchain_enhancement(
                monthly_expenses=monthly_data,
                category_breakdown=category_data,
                user_profile=user_profile,
                baseline_prediction=baseline,
                api_key=decrypt_value(current_user.gemini_api_key or "") if current_user.gemini_api_key else "",
                provider=current_user.preferred_llm_provider or "gemini",
                groq_api_key=decrypt_value(current_user.groq_api_key or "") if current_user.groq_api_key else ""
            )
            # Use the AI-adjusted prediction as the new baseline
            if ai_result.get("langchain_active") and ai_result.get("adjusted_prediction"):
                baseline = float(ai_result["adjusted_prediction"])
        except Exception as e:
            print(f"LangChain enhancement failed: {e}")

    # Generate 6-month forecast with adjusted baseline
    predictions = []
    risk_factor = getattr(current_user, 'risk_tolerance', 1.0)
    growth_rate = 1.01
    if current_user.financial_goal == 'savings':
        growth_rate = 0.99
    elif current_user.financial_goal == 'lifestyle':
        growth_rate = 1.03

    if transactions:
        last_date = max(t.date for t in transactions).replace(day=1)
    else:
        last_date = datetime.utcnow().replace(day=1)

    current_date = last_date
    for i in range(1, 7):
        if current_date.month == 12:
            current_date = current_date.replace(year=current_date.year + 1, month=1)
        else:
            current_date = current_date.replace(month=current_date.month + 1)

        val = float(baseline * (growth_rate ** i))
        predictions.append({
            "month": str(current_date.strftime("%Y-%m")),
            "predicted_amount": round(val, 2),
            "lower_bound": round(val * (0.85 / risk_factor), 2),
            "upper_bound": round(val * (1.15 * risk_factor), 2)
        })

    return {
        "status": "success",
        "method": "LangChain-Enhanced Ensemble (Gemini + ARIMA + LSTM)",
        "user_goal": current_user.financial_goal,
        "input_samples": int(len(historical_vals)),
        "baseline_used": round(float(baseline), 2),
        "predictions": predictions,
        "ai_enhancement": ai_result
    }


from pydantic import BaseModel as PydanticBaseModel

class ChatRequest(PydanticBaseModel):
    message: str
    current_page: Optional[str] = "/"

@app.post("/chat", dependencies=[Depends(rate_limit(max_requests=20, window_seconds=60, key_prefix="chat"))])
def chat_with_ai(
    request: ChatRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Natural language Q&A about the user's finances using Gemini or Groq."""
    if not LANGCHAIN_LOADED:
        return {"response": "AI engine is not available."}

    # Determine provider and keys
    provider = current_user.preferred_llm_provider or "gemini"
    
    user_gemini = decrypt_value(current_user.gemini_api_key or "") if current_user.gemini_api_key else ""
    user_groq = decrypt_value(current_user.groq_api_key or "") if current_user.groq_api_key else ""
    
    env_gemini = os.getenv("GOOGLE_API_KEY", "")
    env_groq = os.getenv("GROQ_API_KEY", "")
    
    gemini_key = user_gemini or env_gemini
    groq_key = user_groq or env_groq
    
    actual_provider = provider
    actual_key = ""
    
    if provider == "groq":
        if groq_key:
            actual_key = groq_key
        elif gemini_key:
            actual_provider = "gemini"
            actual_key = gemini_key
    else:  # gemini
        if gemini_key:
            actual_key = gemini_key
        elif groq_key:
            actual_provider = "groq"
            actual_key = groq_key
            
    if not actual_key:
        return {"response": "No API key found. Please add a Gemini or Groq API key in Settings → AI Configuration."}

    # Build context from the user's transactions
    transactions = session.exec(select(Transaction).where(Transaction.user_id == current_user.id)).all()

    monthly_expenses = {}
    category_data = {}
    for t in transactions:
        if t.type == 'expense':
            m_key = t.date.strftime("%Y-%m")
            monthly_expenses[m_key] = monthly_expenses.get(m_key, 0) + abs(t.amount)
            category_data[t.category] = category_data.get(t.category, 0) + abs(t.amount)

    total_income = sum(abs(t.amount) for t in transactions if t.type == 'income')
    total_expense = sum(abs(t.amount) for t in transactions if t.type == 'expense')

    user_profile = {
        "employment_type": current_user.employment_type,
        "financial_goal": current_user.financial_goal,
        "risk_tolerance": current_user.risk_tolerance,
        "fixed_monthly_burn": current_user.fixed_monthly_burn,
        "monthly_budget": current_user.monthly_budget,
    }

    # Calculate a baseline for the chat context (similar to predict_expenses_v2)
    user_floor = current_user.fixed_monthly_burn or 2000.0
    sorted_months = sorted(monthly_expenses.keys())
    historical_vals = [monthly_expenses[m] for m in sorted_months]
    
    if historical_vals:
        if len(historical_vals) >= 2:
            baseline = float(historical_vals[-1] * 0.6 + historical_vals[-2] * 0.4)
        else:
            baseline = float(historical_vals[-1])
    else:
        baseline = user_floor
    baseline = max(baseline, user_floor)

    context = build_financial_context(monthly_expenses, category_data, user_profile, baseline)

    # Include Budgets in the context
    budgets = session.exec(select(BudgetItem).where(BudgetItem.user_id == current_user.id)).all()
    budget_str = "\n".join([f" - {b.title}: ₹{b.amount:,.0f} ({'Paid' if b.is_paid else 'Unpaid'}, Due: {b.due_date.strftime('%Y-%m-%d')})" for b in budgets])

    # Enhanced context string
    full_context = f"{context}\n\nACTIVE BUDGETS:\n{budget_str if budget_str else 'No active budgets set.'}\n\nCURRENT VIEW: {request.current_page}"
    tx_summary = f"Total income: ₹{total_income:,.0f} | Total expenses: ₹{total_expense:,.0f} | Net: ₹{total_income - total_expense:,.0f}"

    response = generate_chat_response(request.message, full_context, tx_summary, actual_key, actual_provider)
    return {"response": response}

# --- Serve Frontend Static Files ---
# Mount the React frontend's built dist/ folder.
# This MUST come after all API routes to avoid shadowing them.
FRONTEND_DIR = Path(__file__).parent / "static"
if FRONTEND_DIR.exists() and (FRONTEND_DIR / "index.html").exists():
    # Serve static assets (JS, CSS, images)
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIR / "assets")), name="frontend-assets")

    # Catch-all route for React Router (SPA client-side routing)
    @app.get("/{full_path:path}")
    async def serve_frontend(request: Request, full_path: str):
        # Serve actual files if they exist (e.g., favicon.ico, robots.txt)
        file_path = FRONTEND_DIR / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        # Otherwise return index.html for React Router
        return FileResponse(str(FRONTEND_DIR / "index.html"))
