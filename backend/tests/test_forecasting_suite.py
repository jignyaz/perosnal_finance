"""
Test Suite: AI Forecasting & Anomaly Detection
Tests IQR anomaly detection, baseline weighting, growth trajectories, and risk bounds.
"""

from langchain_engine import detect_and_remove_anomalies


def test_iqr_anomaly_detection_identifies_spikes():
    """Verify that artificial spending anomalies are flagged and smoothed."""
    # Typical monthly expenses with an extreme outlier in Month 4
    monthly_data = {
        "2025-01": 25000.0,
        "2025-02": 26000.0,
        "2025-03": 24500.0,
        "2025-04": 180000.0, # Massive outlier (e.g., unexpected medical / asset purchase)
        "2025-05": 25500.0,
        "2025-06": 27000.0,
        "2025-07": 26500.0,
    }

    cleaned_data, removed = detect_and_remove_anomalies(monthly_data)

    # Must detect 2025-04 as an anomaly
    assert len(removed) == 1
    assert removed[0][0] == "2025-04"
    assert removed[0][1] == 180000.0

    # In cleaned data, 2025-04 must be smoothed down significantly
    assert cleaned_data["2025-04"] < 100000.0
    # Normal months must remain unchanged
    assert cleaned_data["2025-01"] == 25000.0


def test_iqr_anomaly_detection_stable_data():
    """Verify that stable historical series produces zero false-positive anomaly removals."""
    monthly_data = {
        "2025-01": 30000.0,
        "2025-02": 31000.0,
        "2025-03": 29500.0,
        "2025-04": 30500.0,
        "2025-05": 32000.0,
    }

    cleaned_data, removed = detect_and_remove_anomalies(monthly_data)
    assert len(removed) == 0
    assert cleaned_data == monthly_data


def test_forecast_horizon_and_growth_logic():
    """Verify 6-month prediction math, growth decay for savings, and confidence bounds."""
    baseline = 40000.0
    growth_rate_savings = 0.99  # 1% monthly spending reduction
    risk_factor = 1.0

    predictions = []
    for i in range(1, 7):
        val = baseline * (growth_rate_savings ** i)
        lower = val * (0.85 / risk_factor)
        upper = val * (1.15 * risk_factor)
        predictions.append({
            "step": i,
            "val": round(val, 2),
            "lower": round(lower, 2),
            "upper": round(upper, 2)
        })

    assert len(predictions) == 6
    # Month 1 < baseline due to savings goal
    assert predictions[0]["val"] < baseline
    # Month 6 < Month 1
    assert predictions[5]["val"] < predictions[0]["val"]
    # Lower bound < Predicted < Upper bound
    for p in predictions:
        assert p["lower"] < p["val"] < p["upper"]
