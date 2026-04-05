import json

notebook_path = 'monthy_expense/lstm.ipynb'

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if 'cell_type' in cell and cell['cell_type'] == 'code':
        source = "".join(cell['source'])
        if 'df.asfreq(\'W\')' in source:
            print("Found target cell. Updating...")
            new_source = source.replace("df.asfreq('W')", "df.asfreq('W').fillna(0)")
            cell['source'] = [line + '\n' for line in new_source.split('\n') if line]

with open(notebook_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1)

print("lstm.ipynb successfully patched.")
