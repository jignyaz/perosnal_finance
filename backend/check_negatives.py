import sqlite3

def check_negative_data():
    conn = sqlite3.connect('finance.db')
    cursor = conn.cursor()
    
    print("Checking for negative amounts in transactions...")
    cursor.execute("SELECT * FROM transaction WHERE amount < 0;")
    neg_txs = cursor.fetchall()
    print(f"Negative Transactions: {neg_txs}")
    
    print("\nChecking for negative initial balance or monthly budget...")
    cursor.execute("SELECT username, initial_balance, monthly_budget FROM user WHERE initial_balance < 0 OR monthly_budget < 0;")
    neg_users = cursor.fetchall()
    print(f"Users with negative balances/budgets: {neg_users}")
    
    conn.close()

if __name__ == "__main__":
    check_negative_data()
