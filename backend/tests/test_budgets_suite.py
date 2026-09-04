"""
Test Suite: Budgets & Financial Goal Management
Tests budget item creation, due date validation, payment toggles, and tenant isolation.
"""

from datetime import datetime, timedelta
from sqlmodel import SQLModel, create_engine, Session, select
from models import User, BudgetItem


def get_in_memory_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    return engine


def test_budget_item_creation_and_due_dates():
    """Verify creating a budget line item and checking due date properties."""
    engine = get_in_memory_db()

    with Session(engine) as session:
        user = User(username="dave_budgeter", password_hash="pass123")
        session.add(user)
        session.commit()
        session.refresh(user)

        due_date = datetime.utcnow() + timedelta(days=15)
        budget = BudgetItem(
            title="Electricity & Internet Bill",
            amount=3500.0,
            category="Utilities",
            due_date=due_date,
            is_paid=False,
            user_id=user.id
        )
        session.add(budget)
        session.commit()
        session.refresh(budget)

        assert budget.id is not None
        assert budget.title == "Electricity & Internet Bill"
        assert budget.amount == 3500.0
        assert budget.is_paid is False
        assert budget.due_date > datetime.utcnow()


def test_budget_payment_toggle():
    """Verify toggling budget status from unpaid to paid."""
    engine = get_in_memory_db()

    with Session(engine) as session:
        user = User(username="eve_saver", password_hash="pass123")
        session.add(user)
        session.commit()
        session.refresh(user)

        b = BudgetItem(
            title="Gym Membership",
            amount=2000.0,
            category="Fitness",
            due_date=datetime.utcnow() + timedelta(days=5),
            is_paid=False,
            user_id=user.id
        )
        session.add(b)
        session.commit()
        session.refresh(b)

        # Mark as paid
        b.is_paid = True
        session.add(b)
        session.commit()
        session.refresh(b)

        assert b.is_paid is True


def test_budget_user_scoping():
    """Verify budgets are partitioned by user ID."""
    engine = get_in_memory_db()

    with Session(engine) as session:
        u1 = User(username="user_1", password_hash="p1")
        u2 = User(username="user_2", password_hash="p2")
        session.add_all([u1, u2])
        session.commit()
        session.refresh(u1)
        session.refresh(u2)

        b1 = BudgetItem(title="Rent", amount=15000.0, category="Housing", due_date=datetime.utcnow(), is_paid=False, user_id=u1.id)
        b2 = BudgetItem(title="Car EMI", amount=8000.0, category="Auto", due_date=datetime.utcnow(), is_paid=False, user_id=u2.id)
        session.add_all([b1, b2])
        session.commit()

        u1_budgets = session.exec(select(BudgetItem).where(BudgetItem.user_id == u1.id)).all()
        assert len(u1_budgets) == 1
        assert u1_budgets[0].title == "Rent"
