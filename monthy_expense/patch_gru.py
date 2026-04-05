import json

notebook_path = 'monthy_expense/GRU.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

# Find the cell that loads the data
for cell in nb['cells']:
    if 'cell_type' in cell and cell['cell_type'] == 'code':
        source = "".join(cell['source'])
        if 'df.asfreq(\'W\')' in source:
            print("Found target cell. Updating...")
            new_source = source.replace("df.asfreq('W')", "df.asfreq('W').fillna(0)")
            # Split back into list of lines for JSON format
            cell['source'] = [line + '\n' for line in new_source.split('\n') if line]
            # Ensure the last line doesn't have a double newline if it didn't have one
            if cell['source'] and cell['source'][-1].endswith('\n'):
                 # Simple fix to match expected list format
                 pass

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1)

print("GRU.ipynb successfully patched.")
