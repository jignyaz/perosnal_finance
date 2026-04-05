from main import app
from sqlmodel import Session, create_engine
from models import User, Transaction
from database import engine
from datetime import datetime

# Mock dependencies
def get_mock_user():
    with Session(engine) as session:
        user = session.query(User).first()
        return user

def test_prediction():
    print("Testing predict_expenses...")
    with Session(engine) as session:
        user = get_mock_user()
        if not user:
            print("No user found in DB")
            return
        
        from main import predict_expenses
        try:
            result = predict_expenses(session=session, current_user=user)
            print("Result:", result)
        except Exception as e:
            import traceback
            print("Caught exception:")
            traceback.print_exc()

if __name__ == "__main__":
    test_prediction()
