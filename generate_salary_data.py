import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json

# Set random seed for reproducibility
np.random.seed(42)

# Define parameters
n_samples = 5000

# Occupation data with base salaries and growth rates
occupations = {
    "Software Engineer": {"base": 120000, "growth": 0.08},
    "Data Scientist": {"base": 110000, "growth": 0.07},
    "Data Engineer": {"base": 115000, "growth": 0.075},
    "DevOps Engineer": {"base": 110000, "growth": 0.07},
    "Product Manager": {"base": 105000, "growth": 0.065},
    "Designer": {"base": 85000, "growth": 0.04},
    "Business Analyst": {"base": 75000, "growth": 0.045},
    "Project Manager": {"base": 80000, "growth": 0.05},
    "Consultant": {"base": 95000, "growth": 0.06},
}

education_levels = ["High School", "Bachelor", "Master", "PhD"]
genders = ["Male", "Female", "Other"]

# Generate synthetic data
data = []

for _ in range(n_samples):
    # Random selection
    occupation = np.random.choice(list(occupations.keys()))
    education = np.random.choice(education_levels)
    gender = np.random.choice(genders)
    
    # Age: 22-65
    age = np.random.randint(22, 66)
    
    # Years of experience: 0-40, correlated with age
    max_experience = max(0, age - 22)
    years_of_experience = np.random.randint(0, min(max_experience + 1, 41))
    
    # Current salary based on occupation and other factors
    base_salary = occupations[occupation]["base"]
    
    # Education multiplier
    education_mult = {"High School": 0.85, "Bachelor": 1.0, "Master": 1.2, "PhD": 1.35}
    
    # Experience bonus
    exp_bonus = min(years_of_experience * 0.02, 0.4)
    if years_of_experience > 20:
        exp_bonus = 0.4 + (years_of_experience - 20) * 0.005
    
    # Gender adjustment
    gender_mult = {"Male": 1.0, "Female": 1.02, "Other": 1.0}
    
    # Age adjustment
    age_mult = 1.0
    if age < 30:
        age_mult = 1.1
    elif age > 50:
        age_mult = 0.95
    
    # Calculate current salary
    current_salary = int(base_salary * education_mult[education] * (1 + exp_bonus) * age_mult * gender_mult[gender])
    
    # Add some noise
    current_salary = int(current_salary * np.random.uniform(0.9, 1.1))
    
    # Calculate 10-year projection
    annual_growth = occupations[occupation]["growth"] * education_mult[education] * age_mult
    salary_10_years = int(current_salary * (1 + annual_growth) ** 10)
    
    data.append({
        "occupation": occupation,
        "age": age,
        "gender": gender,
        "education": education,
        "years_of_experience": years_of_experience,
        "current_salary": current_salary,
        "salary_10_years": salary_10_years,
        "salary_growth": salary_10_years - current_salary,
        "growth_percentage": ((salary_10_years - current_salary) / current_salary) * 100
    })

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv("/home/ubuntu/alex-huang-portfolio/salary_data.csv", index=False)

print(f"Generated {len(df)} salary records")
print(f"\nDataset Statistics:")
print(df.describe())
print(f"\nOccupation Distribution:")
print(df["occupation"].value_counts())
print(f"\nEducation Distribution:")
print(df["education"].value_counts())
print(f"\nGender Distribution:")
print(df["gender"].value_counts())

# Save sample data
print(f"\nSample data (first 5 rows):")
print(df.head())
