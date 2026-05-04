import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, AlertCircle, Building2, CalendarRange, Loader2, Receipt, Stethoscope } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Granularity = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

interface Filters {
  hospital: string;
  admissionType: string;
  gender: string;
  insurance: string;
  medication: string;
  testResults: string;
  minAge: string;
  maxAge: string;
  startDate: string;
  endDate: string;
}

interface FilterOptions {
  hospitals: string[];
  admissionTypes: string[];
  genders: string[];
  insuranceProviders: string[];
  medications: string[];
  testResults: string[];
  dateRange: { min: string; max: string };
}

interface KpiData {
  patientVolume: number;
  totalBillingAmount: number;
  avgLengthOfStay: number;
  doctorVolume: number;
  totalHospitals: number;
}

interface TrendPoint {
  label: string;
  patientCount: number;
  transactionAmount: number;
  averageLengthOfStay: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const money = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const compactMoney = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(v);

const filterClass =
  "border-border/50 bg-background/50 text-foreground focus:border-[#9AC0CD] focus:ring-[#9AC0CD]/20";

const EMPTY_OPTIONS: FilterOptions = {
  hospitals: [],
  admissionTypes: [],
  genders: [],
  insuranceProviders: [],
  medications: [],
  testResults: [],
  dateRange: { min: "", max: "" },
};

const EMPTY_KPI: KpiData = {
  patientVolume: 0,
  totalBillingAmount: 0,
  avgLengthOfStay: 0,
  doctorVolume: 0,
  totalHospitals: 0,
};

function buildQuery(filters: Filters, granularity?: Granularity): string {
  const params = new URLSearchParams();
  if (granularity) params.set("granularity", granularity);
  if (filters.startDate) params.set("start_date", filters.startDate);
  if (filters.endDate) params.set("end_date", filters.endDate);
  if (filters.hospital && filters.hospital !== "all") params.set("hospital", filters.hospital);
  if (filters.admissionType && filters.admissionType !== "all") params.set("admission_type", filters.admissionType);
  if (filters.gender && filters.gender !== "all") params.set("gender", filters.gender);
  if (filters.minAge) params.set("min_age", filters.minAge);
  if (filters.maxAge) params.set("max_age", filters.maxAge);
  if (filters.insurance && filters.insurance !== "all") params.set("insurance", filters.insurance);
  if (filters.medication && filters.medication !== "all") params.set("medication", filters.medication);
  if (filters.testResults && filters.testResults !== "all") params.set("test_results", filters.testResults);
  return params.toString();
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function HealthcareDashboard() {
  const { t } = useLanguage();
  const [options, setOptions] = useState<FilterOptions>(EMPTY_OPTIONS);
  const [kpi, setKpi] = useState<KpiData>(EMPTY_KPI);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [granularity, setGranularity] = useState<Granularity>("monthly");
  const [filters, setFilters] = useState<Filters>({
    hospital: "all",
    admissionType: "all",
    gender: "all",
    insurance: "all",
    medication: "all",
    testResults: "all",
    minAge: "",
    maxAge: "",
    startDate: "",
    endDate: "",
  });

  const [optionsLoading, setOptionsLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load filter options once on mount
  useEffect(() => {
    setOptionsLoading(true);
    fetch("/api/healthcare/filter-options")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: FilterOptions) => {
        setOptions(data);
        setFilters((prev) => ({
          ...prev,
          startDate: data.dateRange.min,
          endDate: data.dateRange.max,
        }));
        setOptionsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load filter options:", err);
        setError("Failed to connect to the healthcare API. Please try again.");
        setOptionsLoading(false);
      });
  }, []);

  const fetchData = useCallback(
    (currentFilters: Filters, currentGranularity: Granularity) => {
      setDataLoading(true);
      setError(null);
      const q = buildQuery(currentFilters, currentGranularity);
      Promise.all([
        fetch(`/api/healthcare/kpis?${q}`).then((r) => {
          if (!r.ok) throw new Error(`KPI HTTP ${r.status}`);
          return r.json() as Promise<KpiData>;
        }),
        fetch(`/api/healthcare/patient-billing-trend?${q}`).then((r) => {
          if (!r.ok) throw new Error(`Trend HTTP ${r.status}`);
          return r.json() as Promise<TrendPoint[]>;
        }),
      ])
        .then(([kpiData, trendData]) => {
          setKpi(kpiData);
          setTrend(trendData);
          setDataLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load healthcare data:", err);
          setError("Failed to load data. Please check your connection and try again.");
          setDataLoading(false);
        });
    },
    []
  );

  useEffect(() => {
    if (optionsLoading) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchData(filters, granularity);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, granularity, optionsLoading, fetchData]);

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ---------------------------------------------------------------------------
  // Loading / error states
  // ---------------------------------------------------------------------------
  if (optionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#9AC0CD] mx-auto" />
          <p className="text-muted-foreground text-sm">{t('loading.healthcare')}</p>
        </div>
      </div>
    );
  }

  if (error && !dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => fetchData(filters, granularity)}
            className="text-[#9AC0CD] text-sm underline hover:no-underline"
          >
            {t('error.retry')}
          </button>
        </div>
      </div>
    );
  }

  const selectDefs: { key: keyof Filters; label: string; values: string[] }[] = [
    { key: "hospital", label: t('dashboard.filters.hospital'), values: options.hospitals },
    { key: "admissionType", label: t('dashboard.filters.admission_type'), values: options.admissionTypes },
    { key: "gender", label: t('dashboard.filters.gender'), values: options.genders },
    { key: "insurance", label: t('dashboard.filters.insurance'), values: options.insuranceProviders },
    { key: "medication", label: t('dashboard.filters.medication'), values: options.medications },
    { key: "testResults", label: t('dashboard.filters.test_results'), values: options.testResults },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
      {/* Main content */}
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: t('dashboard.kpi.patient_volume'), value: kpi.patientVolume.toLocaleString(), icon: <Activity className="w-5 h-5" /> },
            { title: t('dashboard.kpi.total_billing'), value: compactMoney(kpi.totalBillingAmount), icon: <Receipt className="w-5 h-5" /> },
            { title: t('dashboard.kpi.avg_stay'), value: `${kpi.avgLengthOfStay} ${t('dashboard.chart.days')}`, icon: <CalendarRange className="w-5 h-5" /> },
            { title: t('dashboard.kpi.doctor_volume'), value: kpi.doctorVolume.toLocaleString(), icon: <Stethoscope className="w-5 h-5" /> },
            { title: t('dashboard.kpi.total_hospitals'), value: kpi.totalHospitals.toLocaleString(), icon: <Building2 className="w-5 h-5" /> },
          ].map((m) => (
            <Card key={m.title} className="border-border/50 bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{m.title}</span>
                <div className="rounded-lg bg-accent/10 p-2 text-[#9AC0CD]">{m.icon}</div>
              </div>
              <p className="text-2xl font-bold text-[#9AC0CD]">
                {dataLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : m.value}
              </p>
            </Card>
          ))}
        </div>

        {/* Patient Volume & Transaction Amount Chart */}
        <Card className="border-border/50 bg-card p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{t('dashboard.chart.patient_transaction')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.chart.patient_transaction_desc')}
            </p>
          </div>
          {dataLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-[#9AC0CD]" />
            </div>
          ) : trend.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
              No data available for selected filters
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              <ComposedChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis dataKey="label" stroke="#999999" minTickGap={24} />
                <YAxis
                  yAxisId="left"
                  stroke="#999999"
                  label={{ value: t('dashboard.chart.y_axis.patient'), angle: -90, position: "insideLeft", fill: "#999999" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#999999"
                  tickFormatter={(v) => `$${(Number(v) / 1000000).toFixed(0)}M`}
                  label={{
                    value: t('dashboard.chart.y_axis.transaction'),
                    angle: 90,
                    position: "insideRight",
                    fill: "#999999",
                    style: { fontSize: "12px", fontWeight: "normal" }
                  }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333333", borderRadius: "12px" }}
                  formatter={(value: number, name: string) => {
                    if (name === t('dashboard.chart.transaction_amount')) {
                      return [money(value), name];
                    }
                    return [value.toLocaleString(), name];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="patientCount" fill="#9AC0CD" radius={[6, 6, 0, 0]} name={t('dashboard.chart.patient_volume')} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="transactionAmount"
                  stroke="#FF6B35"
                  strokeWidth={3}
                  dot={false}
                  name={t('dashboard.chart.transaction_amount')}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Length of Stay Chart */}
        <Card className="border-border/50 bg-card p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{t('dashboard.chart.length_stay')}</h2>
            <p className="text-sm text-muted-foreground">{t('dashboard.chart.length_stay_desc')}</p>
          </div>
          {dataLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-[#9AC0CD]" />
            </div>
          ) : trend.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
              No data available for selected filters
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis dataKey="label" stroke="#999999" minTickGap={24} />
                <YAxis
                  stroke="#999999"
                  label={{ value: t('dashboard.chart.y_axis.stay'), angle: -90, position: "insideLeft", fill: "#999999" }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333333", borderRadius: "12px" }}
                  formatter={(value: number) => [`${value.toFixed(1)} ${t('dashboard.chart.days')}`, t('dashboard.chart.length_of_stay')]}
                />
                <Line
                  type="monotone"
                  dataKey="averageLengthOfStay"
                  stroke="#9AC0CD"
                  strokeWidth={3}
                  dot={false}
                  name={t('dashboard.chart.length_of_stay')}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Filters sidebar */}
      <Card className="border-border/50 bg-card p-6 h-fit xl:sticky xl:top-24">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">{t('dashboard.filters.title')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('dashboard.filters.desc')}</p>
          </div>

          <div className="space-y-2">
            <Label>{t('dashboard.filters.granularity')}</Label>
            <Select value={granularity} onValueChange={(v: Granularity) => setGranularity(v)}>
              <SelectTrigger className={filterClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t('dashboard.granularity.daily')}</SelectItem>
                <SelectItem value="weekly">{t('dashboard.granularity.weekly')}</SelectItem>
                <SelectItem value="monthly">{t('dashboard.granularity.monthly')}</SelectItem>
                <SelectItem value="quarterly">{t('dashboard.granularity.quarterly')}</SelectItem>
                <SelectItem value="yearly">{t('dashboard.granularity.yearly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t('dashboard.filters.date_from')}</Label>
              <Input
                type="date"
                value={filters.startDate}
                min={options.dateRange.min}
                max={filters.endDate || options.dateRange.max}
                onChange={(e) => setFilter("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('dashboard.filters.date_to')}</Label>
              <Input
                type="date"
                value={filters.endDate}
                min={filters.startDate || options.dateRange.min}
                max={options.dateRange.max}
                onChange={(e) => setFilter("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t('dashboard.filters.age_min')}</Label>
              <Input
                type="number"
                value={filters.minAge}
                min="0"
                max="120"
                onChange={(e) => setFilter("minAge", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('dashboard.filters.age_max')}</Label>
              <Input
                type="number"
                value={filters.maxAge}
                min="0"
                max="120"
                onChange={(e) => setFilter("maxAge", e.target.value)}
                placeholder="120"
              />
            </div>
          </div>

          {selectDefs.map((f) => (
            <div key={f.key} className="space-y-2">
              <Label>{f.label}</Label>
              <Select value={filters[f.key]} onValueChange={(v) => setFilter(f.key, v)}>
                <SelectTrigger className={filterClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('dashboard.filters.all')}</SelectItem>
                  {f.values.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
