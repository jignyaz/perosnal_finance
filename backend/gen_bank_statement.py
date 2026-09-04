import csv
import random
from datetime import datetime, timedelta

def load_ledger():
    ledger = []
    with open('c:/Users/vetch/Downloads/personal_finance/synthetic_test_data.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            ledger.append({
                'date': row['date'],
                'title': row['title'],
                'amount': float(row['amount']),
                'category': row['category'],
                'type': row['type']
            })
    return ledger

def generate_bank_statement(ledger):
    statement = []
    random.seed(42) # For reproducibility
    
    # We will modify transactions to simulate real banking behaviors
    outstanding_count = 0
    fuzzy_desc_count = 0
    timing_count = 0
    amount_mismatch_count = 0
    
    for i, t in enumerate(ledger):
        # 1. Outstanding transactions (present in ledger, but missing in statement) - ~4%
        if i % 25 == 3:
            outstanding_count += 1
            continue
            
        row = t.copy()
        
        # 2. Fuzzy Descriptions - ~12%
        if i % 8 == 2:
            fuzzy_desc_count += 1
            if 'Rent Payment' in row['title']:
                row['title'] = 'ACH DEBIT APARTMENTS RENT 5B'
            elif 'Grocery Store' in row['title']:
                row['title'] = 'WHOLEFOODS MARKET #1042 BOSTON'
            elif 'Utility Bill' in row['title']:
                row['title'] = 'CITY ELEC & WATER POWER BILL'
            elif 'Internet & Phone' in row['title']:
                row['title'] = 'COMCAST CABLE VERIZON WIRELESS'
            elif 'Weekend Outing' in row['title']:
                row['title'] = 'NETFLIX.COM S1234 SUBSCRIPTION'
            elif 'Transport/Petrol' in row['title']:
                row['title'] = 'SHELL OIL STATION #5892'
            else:
                row['title'] = f"VNDR*{row['title'].upper()}"
        
        # 3. Timing Discrepancies (Date shifted by 1-3 days) - ~8%
        if i % 12 == 5:
            timing_count += 1
            dt = datetime.strptime(row['date'], '%Y-%m-%d')
            # Shift forward by 1-3 days due to processing delay
            dt += timedelta(days=random.randint(1, 3))
            row['date'] = dt.strftime('%Y-%m-%d')
            
        # 4. Amount Mismatch (Minor fee/rounding variance) - ~4%
        if i % 25 == 12:
            amount_mismatch_count += 1
            # Add a bank service fee or minor decimal differences
            row['amount'] = round(row['amount'] * 1.002, 2)
            
        statement.append(row)
        
        # 5. Duplicate Transactions (simulate double charges) - 2 occurrences
        if i in [15, 85]:
            dup_row = row.copy()
            # duplicate has same details in bank
            statement.append(dup_row)
            
    # 6. Unrecorded Transactions (present in bank statement, missing in ledger)
    # Add interest payment
    statement.append({
        'date': '2025-03-31',
        'title': 'INTEREST PAID SAVINGS ACCT',
        'amount': 45.50,
        'category': 'Interest',
        'type': 'income'
    })
    # Add monthly service fee
    statement.append({
        'date': '2025-06-30',
        'title': 'MON ACCT MAINT FEE',
        'amount': 250.00,
        'category': 'Bank Fees',
        'type': 'expense'
    })
    # Add random cash withdrawal not recorded
    statement.append({
        'date': '2025-10-15',
        'title': 'ATM CASH WITHDRAWAL #9812',
        'amount': 5000.00,
        'category': 'Uncategorized',
        'type': 'expense'
    })

    print(f"Generated bank statement with:")
    print(f"  - Total rows: {len(statement)}")
    print(f"  - Simulated outstanding in books: {outstanding_count}")
    print(f"  - Simulated fuzzy descriptions: {fuzzy_desc_count}")
    print(f"  - Simulated timing differences: {timing_count}")
    print(f"  - Simulated amount mismatches: {amount_mismatch_count}")
    print(f"  - Simulated duplicate charges: 2")
    print(f"  - Simulated unrecorded items: 3")
    
    return statement

def write_statement(statement):
    filename = 'c:/Users/vetch/Downloads/personal_finance/synthetic_bank_statement.csv'
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['date', 'title', 'amount', 'category', 'type'])
        for row in statement:
            writer.writerow([row['date'], row['title'], row['amount'], row['category'], row['type']])
    print(f"File saved successfully to {filename}")

if __name__ == '__main__':
    ledger = load_ledger()
    statement = generate_bank_statement(ledger)
    write_statement(statement)
