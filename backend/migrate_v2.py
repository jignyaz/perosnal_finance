import sqlite3
import os

db_path = "finance.db"

def migrate():
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    new_columns = [
        ("fixed_monthly_burn", "REAL DEFAULT 0.0"),
        ("employment_type", "TEXT DEFAULT 'salaried'"),
        ("financial_goal", "TEXT DEFAULT 'balanced'"),
        ("risk_tolerance", "REAL DEFAULT 1.0")
    ]

    for col_name, col_type in new_columns:
        try:
            print(f"Adding column {col_name}...")
            cursor.execute(f"ALTER TABLE user ADD COLUMN {col_name} {col_type}")
            print(f"Successfully added {col_name}")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print(f"Column {col_name} already exists. Skipping.")
            else:
                print(f"Error adding {col_name}: {e}")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
