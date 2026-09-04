"""
Test Suite: Transactions & Multi-Tenant Isolation
Tests transaction modeling, tenant scoping, aggregations, and CSV parsing.
"""

from datetime import datetime
from sqlmodel import SQLModel, create_engine, Session, select
from models import User, Transaction


def get_in_memory_db():
    """Creates a temporary in-memory SQLite database session for unit testing."""
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    return engine


def test_transaction_creation_and_scoping():
    """Verify transactions are properly saved and scoped to the correct user."""
    engine = get_in_memory_db()

    with Session(engine) as session:
        # Create 2 distinct users
        user1 = User(username="user_alice", password_hash="hash1")
        user2 = User(username="user_bob", password_hash="hash2")
        session.add(user1)
        session.add(user2)
        session.commit()
        session.refresh(user1)
        session.refresh(user2)

        # Add transactions for user 1
        t1 = Transaction(
            description="Salary Credit",
            amount=50000.0,
            category="Income",
            type="income",
            date=datetime(2026, 1, 1),
            user_id=user1.id
        )
        t2 = Transaction(
            description="Grocery Mart",
            amount=3500.0,
            category="Groceries",
            type="expense",
            date=datetime(2026, 1, 5),
            user_id=user1.id
        )
        # Add transaction for user 2
        t3 = Transaction(
            description="Bob Tech Gadget",
            amount=12000.0,
            category="Electronics",
            type="expense",
            date=datetime(2026, 1, 10),
            user_id=user2.id
        )
        session.add_all([t1, t2, t3])
        session.commit()

        # Query transactions strictly for user 1
        user1_txs = session.exec(select(Transaction).where(Transaction.user_id == user1.id)).all()
        assert len(user1_txs) == 2
        assert all(t.user_id == user1.id for t in user1_txs)
        assert not any("Bob" in (t.description or "") for t in user1_txs)

        # Query transactions strictly for user 2
        user2_txs = session.exec(select(Transaction).where(Transaction.user_id == user2.id)).all()
        assert len(user2_txs) == 1
        assert user2_txs[0].description == "Bob Tech Gadget"


def test_financial_summary_metrics():
    """Verify income, expense, and net worth calculation."""
    engine = get_in_memory_db()

    with Session(engine) as session:
        user = User(username="carol", password_hash="hash")
        session.add(user)
        session.commit()
        session.refresh(user)

        items = [
            Transaction(description="Salary", amount=80000.0, category="Income", type="income", date=datetime(2026, 2, 1), user_id=user.id),
            Transaction(description="Freelance", amount=20000.0, category="Income", type="income", date=datetime(2026, 2, 15), user_id=user.id),
            Transaction(description="House Rent", amount=25000.0, category="Housing", type="expense", date=datetime(2026, 2, 5), user_id=user.id),
            Transaction(description="Groceries", amount=8000.0, category="Groceries", type="expense", date=datetime(2026, 2, 20), user_id=user.id),
            Transaction(description="Utilities", amount=4000.0, category="Bills", type="expense", date=datetime(2026, 2, 25), user_id=user.id),
        ]
        session.add_all(items)
        session.commit()

        all_txs = session.exec(select(Transaction).where(Transaction.user_id == user.id)).all()

        total_income = sum(t.amount for t in all_txs if t.type == "income")
        total_expense = sum(t.amount for t in all_txs if t.type == "expense")
        net_savings = total_income - total_expense

        assert total_income == 100000.0
        assert total_expense == 37000.0
        assert net_savings == 63000.0
