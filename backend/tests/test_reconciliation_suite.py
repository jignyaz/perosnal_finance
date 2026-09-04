"""
Test Suite: Bank Reconciliation & Simulation
Tests synthetic bank statement generation, timing discrepancies, and anomaly simulations.
"""

from gen_bank_statement import generate_bank_statement


def test_bank_statement_simulation_engine():
    """Verify bank statement generator accurately models banking discrepancies."""
    # Synthetic clean internal ledger
    mock_ledger = [
        {"date": "2025-01-05", "title": "Rent Payment", "amount": 25000.0, "category": "Rent", "type": "expense"},
        {"date": "2025-01-10", "title": "Grocery Store", "amount": 4200.0, "category": "Food", "type": "expense"},
        {"date": "2025-01-15", "title": "Salary Credit", "amount": 75000.0, "category": "Income", "type": "income"},
        {"date": "2025-01-20", "title": "Utility Bill", "amount": 2200.0, "category": "Utilities", "type": "expense"},
        {"date": "2025-01-25", "title": "Weekend Outing", "amount": 1800.0, "category": "Entertainment", "type": "expense"},
    ] * 6 # 30 transactions

    statement = generate_bank_statement(mock_ledger)

    # Output statement must contain records
    assert len(statement) >= len(mock_ledger)

    # Verify all records have standard schema
    for row in statement:
        assert "date" in row
        assert "title" in row
        assert "amount" in row
        assert "category" in row
        assert "type" in row
        assert isinstance(row["amount"], (int, float))

    # Verify unrecorded bank transactions were injected (e.g. Bank Fees / Interest)
    titles = [r["title"] for r in statement]
    assert any("INTEREST" in t for t in titles)
    assert any("MAINT FEE" in t or "ATM CASH" in t for t in titles)
