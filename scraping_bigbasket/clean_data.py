import pandas as pd

# Load the CSV file into a DataFrame
df = pd.read_csv('data.csv')

# Drop duplicate rows
df.drop_duplicates(inplace=True)
# Split the "product_name" column by comma and keep only the part before the comma
df["product_name"] = df["product_name"].str.split(",").str[0]
# Save the DataFrame back to the same CSV file, without the index
df.to_csv('clean_data.csv', index=False)