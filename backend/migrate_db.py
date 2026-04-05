"""
Migration script: safely adds missing columns to the existing SQLite database.
Run with: .\venv\bin\python migrate_db.py
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "finance.db")

# Define all columns that should exist on the user table
# Format: (column_name, sqlite_type, default_value_sql)
EXPECTED_USER_COLUMNS = [
    ("email",               "TEXT",    "NULL"),
    ("full_name",           "TEXT",    "NULL"),
    ("phone_number",        "TEXT",    "NULL"),
    ("dob",                 "TEXT",    "NULL"),
    ("initial_balance",     "REAL",    "0.0"),
    ("monthly_budget",      "REAL",    "0.0"),
    ("reward_points",       "INTEGER", "0"),
    ("fixed_monthly_burn",  "REAL",    "0.0"),
    ("employment_type",     "TEXT",    "'salaried'"),
    ("financial_goal",      "TEXT",    "'balanced'"),
    ("risk_tolerance",      "REAL",    "1.0"),
    ("plaid_access_token",  "TEXT",    "NULL"),
]

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Get existing columns
    cursor.execute("PRAGMA table_info(user)")
    existing = {row[1] for row in cursor.fetchall()}

    added = []
    for col_name, col_type, col_default in EXPECTED_USER_COLUMNS:
        if col_name not in existing:
            sql = f"ALTER TABLE user ADD COLUMN {col_name} {col_type} DEFAULT {col_default}"
            cursor.execute(sql)
            added.append(col_name)
            print(f"  ✓ Added missing column: {col_name}")

    if not added:
        print("  ✓ All columns already present. No migration needed.")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
