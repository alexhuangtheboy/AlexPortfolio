import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import xgboost as xgb
import pickle
import json

# Load data
df = pd.read_csv("/home/ubuntu/alex-huang-portfolio/salary_data.csv")

print("=" * 60)
print("SALARY PREDICTION MODEL TRAINING")
print("=" * 60)

# Prepare features and target
X = df[["occupation", "age", "gender", "education", "years_of_experience", "current_salary"]]
y = df["salary_10_years"]

# Encode categorical variables
le_occupation = LabelEncoder()
le_gender = LabelEncoder()
le_education = LabelEncoder()

X_encoded = X.copy()
X_encoded["occupation"] = le_occupation.fit_transform(X["occupation"])
X_encoded["gender"] = le_gender.fit_transform(X["gender"])
X_encoded["education"] = le_education.fit_transform(X["education"])

print(f"\nDataset shape: {X_encoded.shape}")
print(f"Target variable (salary_10_years) - Mean: ${y.mean():,.0f}, Std: ${y.std():,.0f}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X_encoded, y, test_size=0.2, random_state=42
)

print(f"\nTraining set size: {len(X_train)}")
print(f"Test set size: {len(X_test)}")

# Train XGBoost model
print("\nTraining XGBoost model...")
model = xgb.XGBRegressor(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    verbosity=0
)

model.fit(X_train, y_train, verbose=False)

# Evaluate model
y_pred_train = model.predict(X_train)
y_pred_test = model.predict(X_test)

train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
train_mae = mean_absolute_error(y_train, y_pred_train)
test_mae = mean_absolute_error(y_test, y_pred_test)
train_r2 = r2_score(y_train, y_pred_train)
test_r2 = r2_score(y_test, y_pred_test)

print("\n" + "=" * 60)
print("MODEL PERFORMANCE")
print("=" * 60)
print(f"Training RMSE: ${train_rmse:,.0f}")
print(f"Test RMSE: ${test_rmse:,.0f}")
print(f"Training MAE: ${train_mae:,.0f}")
print(f"Test MAE: ${test_mae:,.0f}")
print(f"Training R²: {train_r2:.4f}")
print(f"Test R²: {test_r2:.4f}")

# Feature importance
feature_importance = pd.DataFrame({
    "feature": X_encoded.columns,
    "importance": model.feature_importances_
}).sort_values("importance", ascending=False)

print("\n" + "=" * 60)
print("FEATURE IMPORTANCE")
print("=" * 60)
print(feature_importance.to_string(index=False))

# Save model
model.save_model("/home/ubuntu/alex-huang-portfolio/salary_model.json")
print("\n✓ Model saved to: salary_model.json")

# Save encoders
with open("/home/ubuntu/alex-huang-portfolio/label_encoders.pkl", "wb") as f:
    pickle.dump({
        "occupation": le_occupation,
        "gender": le_gender,
        "education": le_education
    }, f)
print("✓ Label encoders saved to: label_encoders.pkl")

# Save model metadata
metadata = {
    "model_type": "XGBoost",
    "features": X_encoded.columns.tolist(),
    "categorical_features": {
        "occupation": le_occupation.classes_.tolist(),
        "gender": le_gender.classes_.tolist(),
        "education": le_education.classes_.tolist()
    },
    "performance": {
        "train_rmse": float(train_rmse),
        "test_rmse": float(test_rmse),
        "train_mae": float(train_mae),
        "test_mae": float(test_mae),
        "train_r2": float(train_r2),
        "test_r2": float(test_r2)
    },
    "training_samples": len(X_train),
    "test_samples": len(X_test)
}

with open("/home/ubuntu/alex-huang-portfolio/model_metadata.json", "w") as f:
    json.dump(metadata, f, indent=2)
print("✓ Model metadata saved to: model_metadata.json")

print("\n" + "=" * 60)
print("TRAINING COMPLETE!")
print("=" * 60)
