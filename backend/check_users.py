import sqlite3

def check_users():
    conn = sqlite3.connect('finance.db')
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, username, full_name FROM user")
        users = cursor.fetchall()
        print("Registered Users:")
        for user in users:
            print(f"ID: {user[0]}, Username: {user[1]}, Full Name: {user[2]}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_users()
