import pandas as pd
import numpy as np
import json
import ast
import re

# Load the dataset
try:
    df = pd.read_csv('intern_data_ikarus.csv')
    print("Dataset loaded successfully.")
except FileNotFoundError:
    print("Error: The file 'intern_data_ikarus.csv' was not found.")
    exit()

# --- 1. Initial Data Inspection ---
print("\n--- Initial Data Inspection ---")
print("Shape of the dataset (rows, columns):", df.shape)
print("\nFirst 5 rows of the dataset:")
print(df.head())
print("\nData types of each column:")
df.info()
print("\nSummary statistics for numerical columns:")
print(df.describe())

# --- 2. Data Cleaning and Preprocessing ---
print("\n--- Data Cleaning and Preprocessing ---")

# Check for missing values
print("\nMissing values per column:")
print(df.isnull().sum())

# Handle missing values
# For categorical columns, we can fill with 'Unknown' or the mode.
# For numerical columns, we can fill with the mean or median.
# For this dataset, let's fill categorical NaNs with 'Unknown'.
for col in ['brand', 'description', 'manufacturer', 'country_of_origin', 'material', 'color']:
    df[col].fillna('Unknown', inplace=True)

# Clean the 'price' column (remove '$' and convert to float)
# Using a function for robust error handling
def clean_price(price):
    if isinstance(price, str):
        price = price.replace('$', '').replace(',', '').strip()
        try:
            return float(price)
        except ValueError:
            return np.nan # Return NaN if conversion fails
    return price # Keep it as is if it's already a number

df['price'] = df['price'].apply(clean_price)
# Fill any NaNs that resulted from conversion errors with the median price
df['price'].fillna(df['price'].median(), inplace=True)
print("\n'price' column cleaned and converted to float.")

# Clean and parse string-like lists/JSONs ('categories' and 'images')
def parse_string_list(s):
    try:
        # ast.literal_eval is safer than eval
        return ast.literal_eval(s)
    except (ValueError, SyntaxError):
        # Return an empty list if parsing fails
        return []

df['categories'] = df['categories'].apply(parse_string_list)
df['images'] = df['images'].apply(parse_string_list)
print("'categories' and 'images' columns parsed from strings to lists.")


# --- 3. Feature Engineering ---
# We can create new features from existing ones.
print("\n--- Feature Engineering ---")

# Extract the number of images per product
df['image_count'] = df['images'].apply(len)
print("Created 'image_count' feature.")

# Extract the primary category
df['primary_category'] = df['categories'].apply(lambda x: x[0] if x else 'Unknown')
print("Created 'primary_category' feature.")


# --- 4. Exploratory Data Analysis (EDA) ---
print("\n--- Exploratory Data Analysis (Insights) ---")

# Top 10 Brands
print("\nTop 10 Brands by number of products:")
print(df['brand'].value_counts().nlargest(10))

# Top 10 Primary Categories
print("\nTop 10 Primary Categories:")
print(df['primary_category'].value_counts().nlargest(10))

# Top 10 Countries of Origin
print("\nTop 10 Countries of Origin:")
print(df['country_of_origin'].value_counts().nlargest(10))

# Price Distribution
print("\nPrice Distribution Summary:")
print(df['price'].describe())

# Image Count Distribution
print("\nImage Count Distribution Summary:")
print(df['image_count'].describe())

print("\n--- Cleaned and Processed Data Sample ---")
print(df[['title', 'brand', 'price', 'primary_category', 'image_count']].head())

# Save the cleaned data to a new CSV file for future use
df.to_csv('cleaned_product_data.csv', index=False)
print("\nCleaned data saved to 'cleaned_product_data.csv'")
