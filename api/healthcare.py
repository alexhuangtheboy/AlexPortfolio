"""
Healthcare Dashboard API - FastAPI serverless function for Vercel.
Loads the CSV once at module level (cached across warm invocations),
then returns pre-aggregated data so the browser never downloads raw rows.
"""
from __future__ import annotations

import os
import math
from datetime import datetime, timedelta
from functools import lru_cache
from typing import Optional

import pandas as pd
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = FastAPI(title="Healthcare Dashboard API", docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Data loading (cached at module level – survives warm Lambda re-use)
# ---------------------------------------------------------------------------
_DF: Optional[pd.DataFrame] = None

def _load_df() -> pd.DataFrame:
    global _DF
    if _DF is not None:
        return _DF

    # Resolve path relative to this file so it works both locally and on Vercel
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base, "modified_healthcare_dataset.csv")

    df = pd.read_csv(csv_path)

    # Normalise column names to snake_case
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    # Parse dates – the CSV uses YYYY/M/D format
    df["date_of_admission"] = pd.to_datetime(df["date_of_admission"], errors="coerce")
    df = df.dropna(subset=["date_of_admission"])

    # Ensure numeric types
    df["billing_amount"] = pd.to_numeric(df["billing_amount"], errors="coerce").fillna(0)
    df["length_of_stay"] = pd.to_numeric(df["length_of_stay"], errors="coerce").fillna(0)
    df["age"] = pd.to_numeric(df["age"], errors="coerce").fillna(0)

    _DF = df
    return _DF


# ---------------------------------------------------------------------------
# Helper: apply all filters to a dataframe
# ---------------------------------------------------------------------------
def _apply_filters(
    df: pd.DataFrame,
    start_date: Optional[str],
    end_date: Optional[str],
    hospital: Optional[str],
    admission_type: Optional[str],
    gender: Optional[str],
    min_age: Optional[int],
    max_age: Optional[int],
    insurance: Optional[str],
    medication: Optional[str],
    test_results: Optional[str],
) -> pd.DataFrame:
    if start_date and isinstance(start_date, str):
        df = df[df["date_of_admission"] >= pd.to_datetime(start_date)]
    if end_date and isinstance(end_date, str):
        df = df[df["date_of_admission"] <= pd.to_datetime(end_date)]
    if hospital and hospital != "all":
        df = df[df["hospital"] == hospital]
    if admission_type and admission_type != "all":
        df = df[df["admission_type"] == admission_type]
    if gender and gender != "all":
        df = df[df["gender"] == gender]
    if min_age is not None:
        df = df[df["age"] >= min_age]
    if max_age is not None:
        df = df[df["age"] <= max_age]
    if insurance and insurance != "all":
        df = df[df["insurance_provider"] == insurance]
    if medication and medication != "all":
        df = df[df["medication"] == medication]
    if test_results and test_results != "all":
        df = df[df["test_results"] == test_results]
    return df


# ---------------------------------------------------------------------------
# Helper: bucket label for time series
# ---------------------------------------------------------------------------
def _bucket_label(date: pd.Timestamp, granularity: str) -> str:
    if granularity == "daily":
        return date.strftime("%Y-%m-%d")
    if granularity == "weekly":
        monday = date - timedelta(days=date.weekday())
        return monday.strftime("%Y-W%W")
    if granularity == "monthly":
        return date.strftime("%Y-%m")
    if granularity == "quarterly":
        q = (date.month - 1) // 3 + 1
        return f"{date.year} Q{q}"
    return str(date.year)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/api/healthcare/filter-options")
def filter_options():
    """Return all unique filter values for the dropdowns."""
    df = _load_df()
    return {
        "hospitals": sorted(df["hospital"].dropna().unique().tolist()),
        "admissionTypes": sorted(df["admission_type"].dropna().unique().tolist()),
        "genders": sorted(df["gender"].dropna().unique().tolist()),
        "insuranceProviders": sorted(df["insurance_provider"].dropna().unique().tolist()),
        "medications": sorted(df["medication"].dropna().unique().tolist()),
        "testResults": sorted(df["test_results"].dropna().unique().tolist()),
        "dateRange": {
            "min": df["date_of_admission"].min().strftime("%Y-%m-%d"),
            "max": df["date_of_admission"].max().strftime("%Y-%m-%d"),
        },
    }


@app.get("/api/healthcare/kpis")
def kpis(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    hospital: Optional[str] = Query(None),
    admission_type: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    min_age: Optional[int] = Query(None),
    max_age: Optional[int] = Query(None),
    insurance: Optional[str] = Query(None),
    medication: Optional[str] = Query(None),
    test_results: Optional[str] = Query(None),
):
    """Return KPI summary cards."""
    df = _load_df()
    df = _apply_filters(df, start_date, end_date, hospital, admission_type,
                        gender, min_age, max_age, insurance, medication, test_results)

    if df.empty:
        return {
            "patientVolume": 0,
            "totalBillingAmount": 0,
            "avgLengthOfStay": 0,
            "doctorVolume": 0,
            "totalHospitals": 0,
        }

    return {
        "patientVolume": int(len(df)),
        "totalBillingAmount": round(float(df["billing_amount"].sum()), 2),
        "avgLengthOfStay": round(float(df["length_of_stay"].mean()), 1),
        "doctorVolume": int(df["doctor"].nunique()),
        "totalHospitals": int(df["hospital"].nunique()),
    }


@app.get("/api/healthcare/patient-billing-trend")
def patient_billing_trend(
    granularity: str = Query("monthly"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    hospital: Optional[str] = Query(None),
    admission_type: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    min_age: Optional[int] = Query(None),
    max_age: Optional[int] = Query(None),
    insurance: Optional[str] = Query(None),
    medication: Optional[str] = Query(None),
    test_results: Optional[str] = Query(None),
):
    """Return time-series data for the combo chart."""
    df = _load_df()
    df = _apply_filters(df, start_date, end_date, hospital, admission_type,
                        gender, min_age, max_age, insurance, medication, test_results)

    if df.empty:
        return []

    df = df.copy()
    df["bucket"] = df["date_of_admission"].apply(lambda d: _bucket_label(d, granularity))
    df["bucket_sort"] = df["date_of_admission"].apply(lambda d: d.timestamp())

    grouped = (
        df.groupby("bucket")
        .agg(
            patientCount=("name", "count"),
            transactionAmount=("billing_amount", "sum"),
            averageLengthOfStay=("length_of_stay", "mean"),
            bucket_sort_val=("bucket_sort", "min"),
        )
        .reset_index()
        .sort_values("bucket_sort_val")
    )

    return [
        {
            "label": row["bucket"],
            "patientCount": int(row["patientCount"]),
            "transactionAmount": round(float(row["transactionAmount"]), 2),
            "averageLengthOfStay": round(float(row["averageLengthOfStay"]), 1),
        }
        for _, row in grouped.iterrows()
    ]


# ---------------------------------------------------------------------------
# Vercel entry point – Vercel calls `app` directly as an ASGI handler
# ---------------------------------------------------------------------------
# (No extra code needed – Vercel detects the `app` variable automatically)
