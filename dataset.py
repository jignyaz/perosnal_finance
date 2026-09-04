from datasets import load_dataset

ds = load_dataset("mitulshah/transaction-categorization")

# Take half of the training data
half_ds = ds["train"].select(range(len(ds["train"]) // 2))

# Convert to Pandas
df = half_ds.to_pandas()

# Save as CSV
df.to_csv("transactions_half.csv", index=False)

print("Saved successfully!")
print("Rows:", len(df))
print("Columns:", df.columns.tolist())