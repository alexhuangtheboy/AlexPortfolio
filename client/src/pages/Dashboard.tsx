import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Database, Zap, Clock, Target } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const loadHealthcareDashboard = () => import("@/components/HealthcareDashboard");
const HealthcareDashboard = lazy(loadHealthcareDashboard);

let healthcareDataPrefetch: Promise<unknown> | null = null;

function prefetchHealthcareExperience() {
  void loadHealthcareDashboard();

  if (!healthcareDataPrefetch) {
    healthcareDataPrefetch = fetch("/healthcare-data.json").then((res) => res.json());
  }
}

interface MetricCard {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

type DashboardView = "performance" | "healthcare";

function PerformanceDashboardView() {
  const { t } = useLanguage();

  const performanceMetrics = [
    { name: "2023", etl: 45, ml: 38, analytics: 52 },
    { name: "2024", etl: 62, ml: 58, analytics: 71 },
    { name: "2025", etl: 85, ml: 79, analytics: 88 }
  ];

  const techStack = [
    { name: "Python", value: 35, fill: "#00d9ff" },
    { name: "SQL", value: 25, fill: "#00b8cc" },
    { name: "Cloud/DevOps", value: 20, fill: "#0099aa" },
    { name: "ML/AI", value: 15, fill: "#007a88" },
    { name: "Others", value: 5, fill: "#005b66" }
  ];

  const projectImpact = [
    { project: "ETL Pipeline", improvement: 95, latency: 200 },
    { project: "ML Model", improvement: 30, latency: 100 },
    { project: "Analytics API", improvement: 40, latency: 150 },
    { project: "Recommendation", improvement: 30, latency: 95 }
  ];

  const metrics: MetricCard[] = [
    { title: t('dashboard.metric.daily_requests'), value: "50K+", subtitle: t('dashboard.metric.daily_requests_sub'), icon: <Zap className="w-6 h-6" />, color: "#00d9ff" },
    { title: t('dashboard.metric.model_accuracy'), value: "95%", subtitle: t('dashboard.metric.model_accuracy_sub'), icon: <Target className="w-6 h-6" />, color: "#00b8cc" },
    { title: t('dashboard.metric.response_time'), value: "<100ms", subtitle: t('dashboard.metric.response_time_sub'), icon: <Clock className="w-6 h-6" />, color: "#0099aa" },
    { title: t('dashboard.metric.data_sources'), value: "20+", subtitle: t('dashboard.metric.data_sources_sub'), icon: <Database className="w-6 h-6" />, color: "#007a88" },
    { title: t('dashboard.metric.team_size'), value: "200K+", subtitle: t('dashboard.metric.team_size_sub'), icon: <Users className="w-6 h-6" />, color: "#005b66" },
    { title: t('dashboard.metric.cost_reduction'), value: "25%", subtitle: t('dashboard.metric.cost_reduction_sub'), icon: <TrendingUp className="w-6 h-6" />, color: "#00d9ff" }
  ];

  return (
    <>
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, idx) => (
              <Card key={idx} className="bg-card border-border/50 p-6 hover:border-accent/30 transition-all hover:shadow-lg hover:shadow-accent/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-accent/10 rounded-lg" style={{ color: metric.color }}>
                    {metric.icon}
                  </div>
                </div>
                <h3 className="text-sm text-muted-foreground font-medium mb-2">{metric.title}</h3>
                <p className="text-3xl font-bold mb-1" style={{ color: "#9AC0CD" }}>{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/30">
        <div className="container max-w-6xl">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-2">Performance Trend</h2>
              <p className="text-muted-foreground mb-6">Year-over-year improvement across key areas</p>
              <Card className="bg-background border-border/50 p-8">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                    <XAxis dataKey="name" stroke="#999999" />
                    <YAxis stroke="#999999" />
                    <Tooltip contentStyle={{ backgroundColor: "#242424", border: "1px solid #333333", borderRadius: "8px" }} labelStyle={{ color: "#f5f5f5" }} />
                    <Legend />
                    <Line type="monotone" dataKey="etl" stroke="#00d9ff" strokeWidth={2} name="ETL Systems" />
                    <Line type="monotone" dataKey="ml" stroke="#00b8cc" strokeWidth={2} name="ML Models" />
                    <Line type="monotone" dataKey="analytics" stroke="#0099aa" strokeWidth={2} name="Analytics" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Technology Stack</h2>
                <p className="text-muted-foreground mb-6">Expertise distribution across technologies</p>
                <Card className="bg-background border-border/50 p-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={techStack} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                        {techStack.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#242424", border: "1px solid #333333", borderRadius: "8px" }} labelStyle={{ color: "#f5f5f5" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2">Project Impact</h2>
                <p className="text-muted-foreground mb-6">Performance improvements achieved</p>
                <Card className="bg-background border-border/50 p-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectImpact}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                      <XAxis dataKey="project" stroke="#999999" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#999999" />
                      <Tooltip contentStyle={{ backgroundColor: "#242424", border: "1px solid #333333", borderRadius: "8px" }} labelStyle={{ color: "#f5f5f5" }} />
                      <Legend />
                      <Bar dataKey="improvement" fill="#00d9ff" name="Improvement %" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">Key Achievements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Real-time Data Processing", description: "Built Airflow pipelines handling 50K+ daily requests with <200ms latency" },
              { title: "ML Model Deployment", description: "Deployed recommendation engine with 30% CTR improvement using NCF + ANN" },
              { title: "Cost Optimization", description: "Reduced operational costs by 25% through intelligent resource allocation" },
              { title: "Data Integration", description: "Unified 20+ data sources across MongoDB, PostgreSQL, and AWS services" },
              { title: "Analytics Platform", description: "Designed API suite powering dashboards for 200K+ agents with real-time insights" },
              { title: "Predictive Analytics", description: "Developed LSTM forecasting model with 6.3% MAPE for demand prediction" }
            ].map((achievement, idx) => (
              <Card key={idx} className="bg-card border-border/50 p-6 hover:border-accent/30 transition-colors">
                <h3 className="text-lg font-bold mb-2" style={{ color: "#9AC0CD" }}>{achievement.title}</h3>
                <p className="text-muted-foreground text-sm">{achievement.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function HealthcareDashboardFallback() {
  const { t } = useLanguage();
  return (
    <section className="py-16">
      <div className="container max-w-7xl">
        <Card className="border-border/50 bg-card p-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t('loading.healthcare')}</h2>
            <p className="text-muted-foreground">{t('loading.dashboard')}</p>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [view, setView] = useState<DashboardView>("healthcare");

  useEffect(() => {
    // Fetch the healthcare data immediately on load
    prefetchHealthcareExperience();
  }, []); // All the idleCallback and timeout code is deleted!

  const handleViewChange = (value: DashboardView) => {
    if (value === "healthcare") {
      prefetchHealthcareExperience();
    }
    setView(value);
  };
/*export default function Dashboard() {
  const [view, setView] = useState<DashboardView>("performance");

  useEffect(() => {
    const idlePrefetch = () => prefetchHealthcareExperience();

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(idlePrefetch, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(idlePrefetch, 300);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleViewChange = (value: DashboardView) => {
    if (value === "healthcare") {
      prefetchHealthcareExperience();
    }
    setView(value);
  };*/

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="font-mono font-bold text-xl text-accent">AH</a>
          <div className="flex items-center gap-8">
            <a href="/#experience" className="text-sm hover:text-accent transition-colors">{t('nav.experience')}</a>
            <a href="/#skills" className="text-sm hover:text-accent transition-colors">{t('nav.skills')}</a>
            <a href="/#education" className="text-sm hover:text-accent transition-colors">{t('nav.education')}</a>
            <a href="/dashboard" className="text-sm text-accent font-semibold">{t('nav.dashboard')}</a>
            <a href="/salary-predictor" className="text-sm hover:text-accent transition-colors">{t('nav.predictor')}</a>
            <a href="/#contact" className="text-sm hover:text-accent transition-colors">{t('nav.contact')}</a>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-16 bg-gradient-to-b from-card/50 to-background">
        <div className="container max-w-6xl">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-accent font-mono text-sm font-semibold tracking-widest">PROFESSIONAL ANALYTICS</p>
              <h1 className="text-5xl font-bold">{view === "performance" ? t('dashboard.view.performance') : t('dashboard.view.healthcare')}</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {view === "performance"
                  ? t('dashboard.performance.desc')
                  : t('dashboard.healthcare.desc')}
              </p>
            </div>

            <div className="max-w-sm" onMouseEnter={prefetchHealthcareExperience} onFocusCapture={prefetchHealthcareExperience}>
              <Select value={view} onValueChange={handleViewChange}>
                <SelectTrigger className="w-full bg-card border-border/60 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">{t('dashboard.view.performance')}</SelectItem>
                  <SelectItem value="healthcare">{t('dashboard.view.healthcare')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {view === "performance" ? <PerformanceDashboardView /> : <Suspense fallback={<HealthcareDashboardFallback />}><section className="py-16"><div className="container max-w-7xl"><HealthcareDashboard /></div></section></Suspense>}

      <footer className="py-12 border-t border-border/50">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground text-sm">{t('footer.copyright')}</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">{t('footer.back')}</a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">{t('footer.privacy')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
