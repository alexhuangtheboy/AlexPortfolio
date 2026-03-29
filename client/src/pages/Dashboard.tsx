import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Database, Zap, Clock, Target } from "lucide-react";

/**
 * Dashboard Component
 * Displays key metrics and achievements from professional experience
 * Design: Modern Minimalist with Data Visualization
 */

interface MetricCard {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  // Performance metrics from professional experience
  const performanceMetrics = [
    { name: "2023", etl: 45, ml: 38, analytics: 52 },
    { name: "2024", etl: 62, ml: 58, analytics: 71 },
    { name: "2025", etl: 85, ml: 79, analytics: 88 }
  ];

  // Technology distribution
  const techStack = [
    { name: "Python", value: 35, fill: "#00d9ff" },
    { name: "SQL", value: 25, fill: "#00b8cc" },
    { name: "Cloud/DevOps", value: 20, fill: "#0099aa" },
    { name: "ML/AI", value: 15, fill: "#007a88" },
    { name: "Others", value: 5, fill: "#005b66" }
  ];

  // Project impact metrics
  const projectImpact = [
    { project: "ETL Pipeline", improvement: 95, latency: 200 },
    { project: "ML Model", improvement: 30, latency: 100 },
    { project: "Analytics API", improvement: 40, latency: 150 },
    { project: "Recommendation", improvement: 30, latency: 95 }
  ];

  // Key metrics cards
  const metrics: MetricCard[] = [
    {
      title: "Daily Requests Handled",
      value: "50K+",
      subtitle: "Peak throughput achieved",
      icon: <Zap className="w-6 h-6" />,
      color: "#00d9ff"
    },
    {
      title: "Model Accuracy",
      value: "95%",
      subtitle: "AUC score for sepsis prediction",
      icon: <Target className="w-6 h-6" />,
      color: "#00b8cc"
    },
    {
      title: "Response Time",
      value: "<100ms",
      subtitle: "Average API latency",
      icon: <Clock className="w-6 h-6" />,
      color: "#0099aa"
    },
    {
      title: "Data Sources",
      value: "20+",
      subtitle: "Integrated databases & APIs",
      icon: <Database className="w-6 h-6" />,
      color: "#007a88"
    },
    {
      title: "Team Size",
      value: "200K+",
      subtitle: "Agents served by analytics",
      icon: <Users className="w-6 h-6" />,
      color: "#005b66"
    },
    {
      title: "Cost Reduction",
      value: "25%",
      subtitle: "Monthly savings achieved",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "#00d9ff"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="font-mono font-bold text-xl text-accent">AH</a>
          <div className="flex items-center gap-8">
            <a href="/#experience" className="text-sm hover:text-accent transition-colors">Experience</a>
            <a href="/#skills" className="text-sm hover:text-accent transition-colors">Skills</a>
            <a href="/#education" className="text-sm hover:text-accent transition-colors">Education</a>
            <a href="/dashboard" className="text-sm text-accent font-semibold">Dashboard</a>
            <a href="/salary-predictor" className="text-sm hover:text-accent transition-colors">ML Predictor</a>
            <a href="/#contact" className="text-sm hover:text-accent transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-card/50 to-background">
        <div className="container max-w-6xl">
          <div className="space-y-4">
            <p className="text-accent font-mono text-sm font-semibold tracking-widest">PROFESSIONAL ANALYTICS</p>
            <h1 className="text-5xl font-bold">Performance Dashboard</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Key metrics and achievements from my professional experience in data engineering and data science
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics Grid */}
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
                <p className="text-3xl font-bold text-accent mb-1">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-16 bg-card/30">
        <div className="container max-w-6xl">
          <div className="space-y-12">
            {/* Performance Trend */}
            <div>
              <h2 className="text-2xl font-bold mb-2">Performance Trend</h2>
              <p className="text-muted-foreground mb-6">Year-over-year improvement across key areas</p>
              <Card className="bg-background border-border/50 p-8">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                    <XAxis dataKey="name" stroke="#999999" />
                    <YAxis stroke="#999999" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#242424", border: "1px solid #333333", borderRadius: "8px" }}
                      labelStyle={{ color: "#f5f5f5" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="etl" stroke="#00d9ff" strokeWidth={2} name="ETL Systems" />
                    <Line type="monotone" dataKey="ml" stroke="#00b8cc" strokeWidth={2} name="ML Models" />
                    <Line type="monotone" dataKey="analytics" stroke="#0099aa" strokeWidth={2} name="Analytics" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Tech Stack Distribution */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Technology Stack</h2>
                <p className="text-muted-foreground mb-6">Expertise distribution across technologies</p>
                <Card className="bg-background border-border/50 p-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={techStack}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {techStack.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#242424", border: "1px solid #333333", borderRadius: "8px" }}
                        labelStyle={{ color: "#f5f5f5" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Project Impact */}
              <div>
                <h2 className="text-2xl font-bold mb-2">Project Impact</h2>
                <p className="text-muted-foreground mb-6">Performance improvements achieved</p>
                <Card className="bg-background border-border/50 p-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectImpact}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                      <XAxis dataKey="project" stroke="#999999" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#999999" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#242424", border: "1px solid #333333", borderRadius: "8px" }}
                        labelStyle={{ color: "#f5f5f5" }}
                      />
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

      {/* Achievements Section */}
      <section className="py-16">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">Key Achievements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Real-time Data Processing",
                description: "Built Airflow pipelines handling 50K+ daily requests with <200ms latency"
              },
              {
                title: "ML Model Deployment",
                description: "Deployed recommendation engine with 30% CTR improvement using NCF + ANN"
              },
              {
                title: "Cost Optimization",
                description: "Reduced operational costs by 25% through intelligent resource allocation"
              },
              {
                title: "Data Integration",
                description: "Unified 20+ data sources across MongoDB, PostgreSQL, and AWS services"
              },
              {
                title: "Analytics Platform",
                description: "Designed API suite powering dashboards for 200K+ agents with real-time insights"
              },
              {
                title: "Predictive Analytics",
                description: "Developed LSTM forecasting model with 6.3% MAPE for demand prediction"
              }
            ].map((achievement, idx) => (
              <Card key={idx} className="bg-card border-border/50 p-6 hover:border-accent/30 transition-colors">
                <h3 className="text-lg font-bold text-accent mb-2">{achievement.title}</h3>
                <p className="text-muted-foreground text-sm">{achievement.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground text-sm">
              © 2026 Alex Huang. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                Back to Portfolio
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
