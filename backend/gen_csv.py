import csv, random
from datetime import datetime, timedelta

def generate_transactions():
    data = []
    # Start 14 months ago
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2026, 4, 7)
    
    current = start_date
    while current <= end_date:
        # Income
        salary = 50000 + (2500 if current.year == 2026 else 0)
        data.append([current.strftime('%Y-%m-01'), 'Monthly Salary', salary, 'Salary', 'income'])
        
        # Fixed
        data.append([current.strftime('%Y-%m-02'), 'Rent Payment', 12000, 'Housing', 'expense'])
        data.append([current.strftime('%Y-%m-05'), 'Utility Bill', random.randint(2800, 3500), 'Bills', 'expense'])
        data.append([current.strftime('%Y-%m-07'), 'Internet & Phone', 1500, 'Bills', 'expense'])
        
        # Variable
        for week in range(4):
            tx_date = current + timedelta(days=random.randint(week*7 + 3, week*7 + 9))
            if tx_date > end_date: break
            data.append([tx_date.strftime('%Y-%m-%d'), 'Grocery Store', random.randint(1500, 2500), 'Food', 'expense'])
            if random.random() > 0.3:
                data.append([(tx_date + timedelta(days=1)).strftime('%Y-%m-%d'), 'Weekend Outing', random.randint(800, 3000), 'Entertainment', 'expense'])
            data.append([(tx_date + timedelta(days=2)).strftime('%Y-%m-%d'), 'Transport/Petrol', random.randint(500, 1200), 'Travel', 'expense'])

        # Anomalies
        if current.month == 3 and current.year == 2025:
            data.append([current.strftime('%Y-03-15'), 'OLED Television', 45000, 'Shopping', 'expense'])
        if current.month == 8 and current.year == 2025:
            data.append([current.strftime('%Y-08-10'), 'Flight Booking', 15000, 'Travel', 'expense'])
            data.append([current.strftime('%Y-08-12'), 'Hotel Stay', 20000, 'Travel', 'expense'])
        if current.month == 12:
            data.append([current.strftime('%Y-12-24'), 'Holiday Gifts', random.randint(5000, 10000), 'Shopping', 'expense'])

        # Next
        if current.month == 12:
            current = current.replace(year=current.year + 1, month=1)
        else:
            current = current.replace(month=current.month + 1)
            
    return data

transactions = generate_transactions()
filename = 'c:/Users/vetch/Downloads/personal_finance/synthetic_test_data.csv'
with open(filename, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['date', 'title', 'amount', 'category', 'type'])
    writer.writerows(transactions)
print(f'Done!')
