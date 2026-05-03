#!/usr/bin/env python3
"""
Salary Prediction Model Improvement Script
- Data cleaning and preprocessing
- Feature engineering for 10-year salary prediction
- Train improved XGBoost model with real salary data
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
import json
import pickle
import warnings

warnings.filterwarnings('ignore')

# ============================================================================
# STEP 1: DATA LOADING AND EXPLORATION
# ============================================================================
print("=" * 80)
print("STEP 1: Loading and Exploring Data")
print("=" * 80)

df = pd.read_csv('/home/ubuntu/upload/SalaryData.csv')
print(f"\nDataset shape: {df.shape}")
print(f"\nFirst few rows:\n{df.head()}")
print(f"\nData types:\n{df.dtypes}")
print(f"\nMissing values:\n{df.isnull().sum()}")
print(f"\nBasic statistics:\n{df.describe()}")

# ============================================================================
# STEP 2: DATA CLEANING
# ============================================================================
print("\n" + "=" * 80)
print("STEP 2: Data Cleaning")
print("=" * 80)

# Remove duplicates
initial_rows = len(df)
df = df.drop_duplicates()
print(f"\nRemoved {initial_rows - len(df)} duplicate rows")

# Handle missing values (if any)
if df.isnull().sum().sum() > 0:
    print(f"Missing values found:\n{df.isnull().sum()}")
    df = df.dropna()
    print(f"Removed rows with missing values. New shape: {df.shape}")

# Remove outliers using IQR method for salary
Q1 = df['Salary'].quantile(0.25)
Q3 = df['Salary'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR
print(f"\nSalary outlier bounds: [{lower_bound:.2f}, {upper_bound:.2f}]")
outliers_before = len(df)
df = df[(df['Salary'] >= lower_bound) & (df['Salary'] <= upper_bound)]
print(f"Removed {outliers_before - len(df)} outliers. New shape: {df.shape}")

# Validate age and experience ranges
print(f"\nAge range: {df['Age'].min()} - {df['Age'].max()}")
print(f"Experience range: {df['Years of Experience'].min()} - {df['Years of Experience'].max()}")
print(f"Salary range: ${df['Salary'].min():,.0f} - ${df['Salary'].max():,.0f}")

# ============================================================================
# STEP 3: FEATURE ENGINEERING
# ============================================================================
print("\n" + "=" * 80)
print("STEP 3: Feature Engineering")
print("=" * 80)

# Create a copy for feature engineering
df_features = df.copy()

# 1. Encode categorical variables
print("\nEncoding categorical variables...")
le_gender = LabelEncoder()
le_education = LabelEncoder()
le_job = LabelEncoder()

df_features['Gender_encoded'] = le_gender.fit_transform(df_features['Gender'])
df_features['Education_encoded'] = le_education.fit_transform(df_features['Education Level'])
df_features['Job_encoded'] = le_job.fit_transform(df_features['Job Title'])

print(f"Gender classes: {dict(zip(le_gender.classes_, le_gender.transform(le_gender.classes_)))}")
print(f"Education classes: {dict(zip(le_education.classes_, le_education.transform(le_education.classes_)))}")
print(f"Number of job titles: {len(le_job.classes_)}")

# 2. Create polynomial features for non-linear relationships
print("\nCreating polynomial features...")
df_features['Age_squared'] = df_features['Age'] ** 2
df_features['Experience_squared'] = df_features['Years of Experience'] ** 2
df_features['Age_Experience_interaction'] = df_features['Age'] * df_features['Years of Experience']

# 3. Create experience ratio (years of experience / age)
df_features['Experience_Ratio'] = df_features['Years of Experience'] / (df_features['Age'] + 1)

# 4. Create salary per year of experience
df_features['Salary_per_Experience'] = df_features['Salary'] / (df_features['Years of Experience'] + 1)

# 5. Create age group feature
def categorize_age(age):
    if age < 25:
        return 0  # Entry level
    elif age < 35:
        return 1  # Mid career
    elif age < 50:
        return 2  # Senior
    else:
        return 3  # Executive

df_features['Age_Group'] = df_features['Age'].apply(categorize_age)

print(f"Features created: {df_features.columns.tolist()}")

# ============================================================================
# STEP 4: 10-YEAR SALARY PROJECTION FEATURE ENGINEERING
# ============================================================================
print("\n" + "=" * 80)
print("STEP 4: Creating 10-Year Salary Projection Target")
print("=" * 80)

# Calculate historical salary growth patterns by job title
job_growth = df_features.groupby('Job Title').agg({
    'Salary': ['mean', 'std', 'count'],
    'Years of Experience': 'mean',
    'Age': 'mean'
}).round(2)

print("\nSalary statistics by job title (top 10):")
print(job_growth.head(10))

# Estimate 10-year salary growth using multiple methods
print("\nEstimating 10-year salary growth...")

# Method 1: Calculate growth rate based on age and experience correlation
growth_rates = []
for job_title in df_features['Job Title'].unique():
    job_data = df_features[df_features['Job Title'] == job_title]
    if len(job_data) > 1:
        # Correlation between experience and salary
        corr = job_data['Years of Experience'].corr(job_data['Salary'])
        if not np.isnan(corr) and corr > 0:
            # Estimate annual growth rate
            salary_range = job_data['Salary'].max() - job_data['Salary'].min()
            exp_range = job_data['Years of Experience'].max() - job_data['Years of Experience'].min()
            if exp_range > 0:
                annual_growth = (salary_range / exp_range) / job_data['Salary'].mean()
                growth_rates.append(annual_growth)

avg_growth_rate = np.mean(growth_rates) if growth_rates else 0.05
print(f"Estimated average annual growth rate: {avg_growth_rate:.4f} ({avg_growth_rate*100:.2f}%)")

# Create target variable: 10-year projected salary
# Using compound growth formula: Future Salary = Current Salary * (1 + growth_rate)^10
df_features['Salary_10Year_Target'] = df_features.apply(
    lambda row: row['Salary'] * ((1 + avg_growth_rate) ** 10),
    axis=1
)

print(f"\nTarget variable statistics:")
print(f"Current salary range: ${df_features['Salary'].min():,.0f} - ${df_features['Salary'].max():,.0f}")
print(f"10-year projected range: ${df_features['Salary_10Year_Target'].min():,.0f} - ${df_features['Salary_10Year_Target'].max():,.0f}")

# ============================================================================
# STEP 5: MODEL TRAINING
# ============================================================================
print("\n" + "=" * 80)
print("STEP 5: Training XGBoost Model")
print("=" * 80)

# Select features for modeling
feature_columns = [
    'Age', 'Gender_encoded', 'Education_encoded', 'Job_encoded',
    'Years of Experience', 'Salary',
    'Age_squared', 'Experience_squared', 'Age_Experience_interaction',
    'Experience_Ratio', 'Salary_per_Experience', 'Age_Group'
]

X = df_features[feature_columns]
y = df_features['Salary_10Year_Target']

print(f"\nFeatures shape: {X.shape}")
print(f"Target shape: {y.shape}")
print(f"Features: {feature_columns}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\nTraining set size: {X_train.shape[0]}")
print(f"Test set size: {X_test.shape[0]}")

# Train XGBoost model with optimized parameters
model = xgb.XGBRegressor(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    objective='reg:squarederror',
    verbosity=0
)

print("\nTraining model...")
model.fit(X_train, y_train)

# ============================================================================
# STEP 6: MODEL EVALUATION
# ============================================================================
print("\n" + "=" * 80)
print("STEP 6: Model Evaluation")
print("=" * 80)

# Predictions
y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)

# Metrics
train_r2 = r2_score(y_train, y_train_pred)
test_r2 = r2_score(y_test, y_test_pred)
train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
train_mae = mean_absolute_error(y_train, y_train_pred)
test_mae = mean_absolute_error(y_test, y_test_pred)

print(f"\nTraining Metrics:")
print(f"  R² Score: {train_r2:.6f}")
print(f"  RMSE: ${train_rmse:,.2f}")
print(f"  MAE: ${train_mae:,.2f}")

print(f"\nTest Metrics:")
print(f"  R² Score: {test_r2:.6f}")
print(f"  RMSE: ${test_rmse:,.2f}")
print(f"  MAE: ${test_mae:,.2f}")

# Feature importance
feature_importance = pd.DataFrame({
    'Feature': feature_columns,
    'Importance': model.feature_importances_
}).sort_values('Importance', ascending=False)

print(f"\nTop 10 Feature Importance:")
print(feature_importance.head(10))

# ============================================================================
# STEP 7: SAVE MODEL AND METADATA
# ============================================================================
print("\n" + "=" * 80)
print("STEP 7: Saving Model and Metadata")
print("=" * 80)

# Save model
model_path = '/home/ubuntu/alex-huang-portfolio/salary_model_improved.pkl'
pickle.dump(model, open(model_path, 'wb'))
print(f"Model saved to: {model_path}")

# Save encoders
encoders = {
    'gender': le_gender,
    'education': le_education,
    'job': le_job
}
encoders_path = '/home/ubuntu/alex-huang-portfolio/salary_encoders.pkl'
pickle.dump(encoders, open(encoders_path, 'wb'))
print(f"Encoders saved to: {encoders_path}")

# Save metadata
metadata = {
    'model_type': 'XGBoost',
    'features': feature_columns,
    'target': 'Salary_10Year_Target',
    'training_samples': len(X_train),
    'test_samples': len(X_test),
    'train_r2': float(train_r2),
    'test_r2': float(test_r2),
    'train_rmse': float(train_rmse),
    'test_rmse': float(test_rmse),
    'train_mae': float(train_mae),
    'test_mae': float(test_mae),
    'average_growth_rate': float(avg_growth_rate),
    'feature_importance': feature_importance.to_dict('records'),
    'gender_classes': list(le_gender.classes_),
    'education_classes': list(le_education.classes_),
    'job_titles': list(le_job.classes_),
    'data_cleaning': {
        'duplicates_removed': initial_rows - len(df),
        'outliers_removed': outliers_before - len(df),
        'final_samples': len(df)
    }
}

metadata_path = '/home/ubuntu/alex-huang-portfolio/salary_model_metadata.json'
with open(metadata_path, 'w') as f:
    json.dump(metadata, f, indent=2)
print(f"Metadata saved to: {metadata_path}")

print("\n" + "=" * 80)
print("MODEL IMPROVEMENT COMPLETE!")
print("=" * 80)
print(f"\nSummary:")
print(f"  - Data samples: {len(df)}")
print(f"  - Features: {len(feature_columns)}")
print(f"  - Model R² (test): {test_r2:.6f}")
print(f"  - Average prediction error: ${test_mae:,.2f}")
print(f"  - 10-year growth rate: {avg_growth_rate*100:.2f}%")
