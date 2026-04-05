from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    dob: Optional[datetime] = None
    initial_balance: float = Field(default=0.0)
    monthly_budget: float = Field(default=0.0)
    reward_points: int = Field(default=0)
    fixed_monthly_burn: float = Field(default=0.0)
    employment_type: str = Field(default="salaried") # salaried, variable, freelance
    financial_goal: str = Field(default="balanced") # savings, balanced, lifestyle
    risk_tolerance: float = Field(default=1.0)
    plaid_access_token: Optional[str] = None
    password_hash: str

class UserCreate(SQLModel):
    username: str
    password: str
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    dob: Optional[datetime] = None
    initial_balance: float = 0.0
    monthly_budget: float = 0.0
    fixed_monthly_burn: float = 0.0
    employment_type: str = "salaried"
    financial_goal: str = "balanced"
    risk_tolerance: float = 1.0

class UserUpdate(SQLModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    dob: Optional[datetime] = None
    email: Optional[str] = None
    initial_balance: Optional[float] = None
    monthly_budget: Optional[float] = None
    fixed_monthly_burn: Optional[float] = None
    employment_type: Optional[str] = None
    financial_goal: Optional[str] = None
    risk_tolerance: Optional[float] = None
    plaid_access_token: Optional[str] = None

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    amount: float
    category: str
    date: datetime
    type: str # "income" or "expense"
    description: Optional[str] = None

class TransactionCreate(SQLModel):
    amount: float
    category: str
    date: datetime
    type: str
    description: Optional[str] = None

class BudgetItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    title: str
    amount: float
    due_date: datetime
    is_paid: bool = False

class BudgetItemCreate(SQLModel):
    title: str
    amount: float
    due_date: datetime
    is_paid: bool = False
