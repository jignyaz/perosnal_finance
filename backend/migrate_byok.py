"""
Migration script: Add gemini_api_key column to user table for BYOK support.
Run this once if you have an existing finance.db that was created before the BYOK feature.
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "finance.db")

def migrate():
    if not os.path.exists(DB_PATH):
        print("No existing database found. The column will be created automatically on first run.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Check if column already exists
    cursor.execute("PRAGMA table_info(user)")
    columns = [col[1] for col in cursor.fetchall()]

    if "gemini_api_key" in columns:
        print("Column 'gemini_api_key' already exists. No migration needed.")
    else:
        cursor.execute("ALTER TABLE user ADD COLUMN gemini_api_key TEXT DEFAULT NULL")
        conn.commit()
        print("Successfully added 'gemini_api_key' column to user table.")

    conn.close()

if __name__ == "__main__":
    migrate()
