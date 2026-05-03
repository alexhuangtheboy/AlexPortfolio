import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types
export interface HealthcareRecord {
  name: string;
  age: number;
  gender: string;
  blood_type: string;
  medical_condition: string;
  date_of_admission: string;
  doctor: string;
  hospital: string;
  insurance_provider: string;
  billing_amount: number;
  room_number: string;
  admission_type: string;
  discharge_date: string;
  medication: string;
  test_results: string;
}

export interface FilterOptions {
  hospitals: string[];
  admissionTypes: string[];
  genders: string[];
  insuranceProviders: string[];
  medications: string[];
  testResults: string[];
  dateRange: { min: string; max: string };
}

export interface KpiData {
  patientVolume: number;
  totalBillingAmount: number;
  avgLengthOfStay: number;
  doctorVolume: number;
  totalHospitals: number;
}

export interface TrendPoint {
  label: string;
  patientCount: number;
  transactionAmount: number;
  averageLengthOfStay: number;
}

interface FilterParams {
  start_date?: string;
  end_date?: string;
  hospital?: string;
  admission_type?: string;
  gender?: string;
  min_age?: string;
  max_age?: string;
  insurance?: string;
  medication?: string;
  test_results?: string;
}

// Cache for the dataset
let cachedData: HealthcareRecord[] | null = null;

function loadHealthcareData(): HealthcareRecord[] {
  if (cachedData) {
    return cachedData;
  }

  // Try multiple possible paths for the CSV file
  const possiblePaths = [
    path.resolve(__dirname, '..', '..', 'modified_healthcare_dataset.csv'),
    path.resolve(__dirname, '..', 'modified_healthcare_dataset.csv'),
    path.resolve(process.cwd(), 'modified_healthcare_dataset.csv'),
    path.resolve(process.cwd(), '..', 'modified_healthcare_dataset.csv'),
  ];

  let csvPath = null;
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      csvPath = testPath;
      break;
    }
  }

  if (!csvPath) {
    throw new Error(`Healthcare dataset not found. Tried paths: ${possiblePaths.join(', ')}`);
  }

  console.log(`Loading healthcare data from: ${csvPath}`);
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const parseResult = Papa.parse<HealthcareRecord>(csvContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().replace(/\s+/g, '_'),
  });

  if (parseResult.errors.length > 0) {
    console.error('CSV parsing errors:', parseResult.errors);
  }

  // Process and validate data
  const processedData = parseResult.data.map((row) => ({
    ...row,
    age: Number(row.age) || 0,
    billing_amount: Number(row.billing_amount) || 0,
    length_of_stay: calculateLengthOfStay(row.date_of_admission, row.discharge_date),
  }));

  cachedData = processedData;
  console.log(`Loaded ${processedData.length} healthcare records`);
  return processedData;
}

function calculateLengthOfStay(admissionDate: string, dischargeDate: string): number {
  if (!admissionDate || !dischargeDate) return 0;

  const admission = new Date(admissionDate);
  const discharge = new Date(dischargeDate);

  if (isNaN(admission.getTime()) || isNaN(discharge.getTime())) return 0;

  const diffTime = Math.abs(discharge.getTime() - admission.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function applyFilters(data: HealthcareRecord[], filters: FilterParams): HealthcareRecord[] {
  let filtered = [...data];

  if (filters.start_date) {
    filtered = filtered.filter(row =>
      row.date_of_admission && new Date(row.date_of_admission) >= new Date(filters.start_date!)
    );
  }

  if (filters.end_date) {
    filtered = filtered.filter(row =>
      row.date_of_admission && new Date(row.date_of_admission) <= new Date(filters.end_date!)
    );
  }

  if (filters.hospital && filters.hospital !== 'all') {
    filtered = filtered.filter(row => row.hospital === filters.hospital);
  }

  if (filters.admission_type && filters.admission_type !== 'all') {
    filtered = filtered.filter(row => row.admission_type === filters.admission_type);
  }

  if (filters.gender && filters.gender !== 'all') {
    filtered = filtered.filter(row => row.gender === filters.gender);
  }

  if (filters.min_age) {
    const minAge = Number(filters.min_age);
    filtered = filtered.filter(row => row.age >= minAge);
  }

  if (filters.max_age) {
    const maxAge = Number(filters.max_age);
    filtered = filtered.filter(row => row.age <= maxAge);
  }

  if (filters.insurance && filters.insurance !== 'all') {
    filtered = filtered.filter(row => row.insurance_provider === filters.insurance);
  }

  if (filters.medication && filters.medication !== 'all') {
    filtered = filtered.filter(row => row.medication === filters.medication);
  }

  if (filters.test_results && filters.test_results !== 'all') {
    filtered = filtered.filter(row => row.test_results === filters.test_results);
  }

  return filtered;
}

function getBucketLabel(date: Date, granularity: string): string {
  const year = date.getFullYear();
  const month = date.getMonth();

  switch (granularity) {
    case 'daily':
      return date.toISOString().split('T')[0];
    case 'weekly':
      const monday = new Date(date);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      monday.setDate(diff);
      return `${monday.getFullYear()}-W${getWeekNumber(monday)}`;
    case 'monthly':
      return `${year}-${String(month + 1).padStart(2, '0')}`;
    case 'quarterly':
      const quarter = Math.floor(month / 3) + 1;
      return `${year} Q${quarter}`;
    case 'yearly':
      return String(year);
    default:
      return String(year);
  }
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// API Functions
export function getFilterOptions(): FilterOptions {
  const data = loadHealthcareData();

  const hospitals = [...new Set(data.map(row => row.hospital).filter(Boolean))].sort();
  const admissionTypes = [...new Set(data.map(row => row.admission_type).filter(Boolean))].sort();
  const genders = [...new Set(data.map(row => row.gender).filter(Boolean))].sort();
  const insuranceProviders = [...new Set(data.map(row => row.insurance_provider).filter(Boolean))].sort();
  const medications = [...new Set(data.map(row => row.medication).filter(Boolean))].sort();
  const testResults = [...new Set(data.map(row => row.test_results).filter(Boolean))].sort();

  const dates = data
    .map(row => row.date_of_admission)
    .filter(Boolean)
    .map(date => new Date(date).getTime())
    .filter(time => !isNaN(time));

  const minDate = dates.length > 0 ? new Date(Math.min(...dates)).toISOString().split('T')[0] : '';
  const maxDate = dates.length > 0 ? new Date(Math.max(...dates)).toISOString().split('T')[0] : '';

  return {
    hospitals,
    admissionTypes,
    genders,
    insuranceProviders,
    medications,
    testResults,
    dateRange: { min: minDate, max: maxDate },
  };
}

export function getKpiData(filters: FilterParams): KpiData {
  const data = loadHealthcareData();
  const filtered = applyFilters(data, filters);

  if (filtered.length === 0) {
    return {
      patientVolume: 0,
      totalBillingAmount: 0,
      avgLengthOfStay: 0,
      doctorVolume: 0,
      totalHospitals: 0,
    };
  }

  const patientVolume = filtered.length;
  const totalBillingAmount = filtered.reduce((sum, row) => sum + (row.billing_amount || 0), 0);
  const avgLengthOfStay = filtered.reduce((sum, row) => sum + ((row as any).length_of_stay || 0), 0) / patientVolume;
  const doctorVolume = new Set(filtered.map(row => row.doctor).filter(Boolean)).size;
  const totalHospitals = new Set(filtered.map(row => row.hospital).filter(Boolean)).size;

  return {
    patientVolume,
    totalBillingAmount: Math.round(totalBillingAmount * 100) / 100,
    avgLengthOfStay: Math.round(avgLengthOfStay * 10) / 10,
    doctorVolume,
    totalHospitals,
  };
}

export function getPatientBillingTrend(filters: FilterParams & { granularity?: string }): TrendPoint[] {
  const data = loadHealthcareData();
  const filtered = applyFilters(data, filters);
  const granularity = filters.granularity || 'monthly';

  if (filtered.length === 0) {
    return [];
  }

  // Group by time bucket
  const groups = new Map<string, {
    patientCount: number;
    transactionAmount: number;
    totalLengthOfStay: number;
    timestamps: number[];
  }>();

  filtered.forEach(row => {
    if (!row.date_of_admission) return;

    const date = new Date(row.date_of_admission);
    if (isNaN(date.getTime())) return;

    const bucket = getBucketLabel(date, granularity);
    const timestamp = date.getTime();

    if (!groups.has(bucket)) {
      groups.set(bucket, {
        patientCount: 0,
        transactionAmount: 0,
        totalLengthOfStay: 0,
        timestamps: [],
      });
    }

    const group = groups.get(bucket)!;
    group.patientCount += 1;
    group.transactionAmount += row.billing_amount || 0;
    group.totalLengthOfStay += (row as any).length_of_stay || 0;
    group.timestamps.push(timestamp);
  });

  // Convert to array and sort by time
  const result: TrendPoint[] = Array.from(groups.entries())
    .map(([label, data]) => ({
      label,
      patientCount: data.patientCount,
      transactionAmount: Math.round(data.transactionAmount * 100) / 100,
      averageLengthOfStay: Math.round((data.totalLengthOfStay / data.patientCount) * 10) / 10,
    }))
    .sort((a, b) => {
      // Extract timestamp for sorting
      const getTimestamp = (label: string) => {
        if (label.includes('W')) {
          const [year, week] = label.split('-W');
          return parseInt(year) * 100 + parseInt(week);
        }
        if (label.includes('Q')) {
          const [year, quarter] = label.split(' Q');
          return parseInt(year) * 10 + parseInt(quarter);
        }
        if (label.includes('-')) {
          return new Date(label).getTime();
        }
        return parseInt(label);
      };
      return getTimestamp(a.label) - getTimestamp(b.label);
    });

  return result;
}