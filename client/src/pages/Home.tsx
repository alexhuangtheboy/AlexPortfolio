import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Github, Linkedin, ExternalLink, ChevronDown, Code2, Database, Cloud, Zap } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Design Philosophy: Modern Minimalist with Data Visualization
 * - Deep charcoal (#1a1a1a) base with vibrant teal (#00d9ff) accents
 * - IBM Plex Mono for headings (technical expertise), Inter for body
 * - Asymmetric layouts, animated data flows, scroll-triggered reveals
 * - Emphasis on precision, clarity, and analytical mindset
 */

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
}

interface SkillCategory {
  name: string;
  skills: string[];
  icon: React.ReactNode;
}

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const experiences: ExperienceItem[] = [
    {
      company: "Real Messenger",
      role: "Data Engineer",
      period: "Dec 2025 - Mar 2026",
      location: "Hong Kong SAR",
      highlights: [
        "Developed Airflow pipelines for ETL workflows with MongoDB and PostgreSQL",
        "Built high-concurrency Go microservice handling 50K+ daily requests (<200ms)",
        "Architected recommendation engine with Neural Collaborative Filtering and ANN search",
        "Designed analytics API suite powering dashboards for 200K+ agents"
      ]
    },
    {
      company: "SIMO",
      role: "Data Analyst",
      period: "Dec 2024 - Nov 2025",
      location: "Shenzhen, China",
      highlights: [
        "Designed ETL pipelines in AWS Databricks reducing manual reporting by 95%",
        "Developed interactive dashboards for telecom metrics visualization",
        "Implemented LSTM forecasting pipeline with 6.3% MAPE globally",
        "Packaged ML model as FastAPI service on AWS SageMaker"
      ]
    },
    {
      company: "Ames IT and Numeric Solutions",
      role: "Data Scientist",
      period: "Mar 2023 - Aug 2024",
      location: "Los Angeles, CA",
      highlights: [
        "Delivered training on end-to-end data science workflows and ML algorithms",
        "Taught SQL-based data engineering and model deployment with FastAPI",
        "Developed real-world case studies for fraud detection and credit scoring",
        "Guided students through supervised and unsupervised learning techniques"
      ]
    },
    {
      company: "UCLA Health",
      role: "Business Intelligence Analyst II",
      period: "Jan 2022 - Mar 2023",
      location: "Los Angeles, CA",
      highlights: [
        "Analyzed patient readmission data, decreased readmission rate by 5%",
        "Designed interactive dashboards for key metrics (Volume, Mortality, Length of Stay)",
        "Built NLP models for text mining, improved sepsis classification accuracy by 12.6%",
        "Developed ensemble learning models with 0.95 AUC for early sepsis prediction"
      ]
    }
  ];

  const skillCategories: SkillCategory[] = [
    {
      name: "Programming",
      icon: <Code2 className="w-5 h-5" />,
      skills: ["Python", "SQL", "R", "Golang", "JavaScript/TypeScript"]
    },
    {
      name: "Data & ETL",
      icon: <Database className="w-5 h-5" />,
      skills: ["Apache Spark", "Apache Hadoop", "Airflow", "Databricks", "PostgreSQL", "MongoDB", "MySQL"]
    },
    {
      name: "Cloud & DevOps",
      icon: <Cloud className="w-5 h-5" />,
      skills: ["AWS", "Kubernetes", "Docker", "Git", "CI/CD"]
    },
    {
      name: "ML & Analytics",
      icon: <Zap className="w-5 h-5" />,
      skills: ["FastAPI", "TensorFlow", "LangChain", "Tableau", "Data Visualization"]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="font-mono font-bold text-xl text-accent">AH</div>
          <div className="flex items-center gap-8">
            <a href="#experience" className="text-sm hover:text-accent transition-colors">Experience</a>
            <a href="#skills" className="text-sm hover:text-accent transition-colors">Skills</a>
            <a href="#education" className="text-sm hover:text-accent transition-colors">Education</a>
            <a href="/dashboard" className="text-sm hover:text-accent transition-colors">Dashboard</a>
            <a href="/salary-predictor" className="text-sm hover:text-accent transition-colors">ML Predictor</a>
            <a href="#contact" className="text-sm hover:text-accent transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663281322185/UTnMcuaBKfFrE5Wb4LZwfa/hero-background-bnj7yiZcc8nDDSv4oEePvC.webp"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background"></div>
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 max-w-4xl">
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <p className="text-accent font-mono text-sm font-semibold tracking-widest">WELCOME TO MY PORTFOLIO</p>
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                Alex Huang
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Data Engineer & Data Scientist with 5+ years of experience building scalable ETL pipelines, ML systems, and analytics platforms for Fortune 500 companies and innovative startups.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                View My Work
              </Button>
              <a
                href="https://d2xsxph8kpxj0f.cloudfront.net/310519663281322185/UTnMcuaBKfFrE5Wb4LZwfa/AlexHuang_Resume_99dc4573.pdf"
                download="AlexHuang_Resume.pdf"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors font-semibold"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-6 h-6 text-accent" />
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 bg-card/50">
        <div className="container max-w-5xl">
          <div className="mb-16">
            <p className="text-accent font-mono text-sm font-semibold tracking-widest mb-2">PROFESSIONAL JOURNEY</p>
            <h2 className="text-5xl font-bold">Experience</h2>
            <div className="w-16 h-1 bg-accent mt-4"></div>
          </div>

          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="group relative pl-8 pb-8 border-l-2 border-accent/30 hover:border-accent/60 transition-colors"
              >
                {/* Timeline dot */}
                <div className="absolute -left-3.5 top-0 w-5 h-5 bg-accent rounded-full group-hover:scale-125 transition-transform"></div>

                <Card className="bg-background border-border/50 p-6 hover:border-accent/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-accent">{exp.role}</h3>
                      <p className="text-lg text-foreground font-semibold">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">{exp.location}</p>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono whitespace-nowrap">{exp.period}</p>
                  </div>

                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, hidx) => (
                      <li key={hidx} className="flex gap-3 text-sm text-foreground/90">
                        <span className="text-accent font-bold mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24">
        <div className="container max-w-5xl">
          <div className="mb-16">
            <p className="text-accent font-mono text-sm font-semibold tracking-widest mb-2">TECHNICAL EXPERTISE</p>
            <h2 className="text-5xl font-bold">Skills & Tools</h2>
            <div className="w-16 h-1 bg-accent mt-4"></div>
          </div>

          {/* Background Image */}
          <div className="absolute left-0 right-0 top-1/2 -z-10 opacity-10">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663281322185/UTnMcuaBKfFrE5Wb4LZwfa/skills-pattern-UNGyswRWHHgMLdrCG7qnDe.webp"
              alt="Skills pattern"
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, idx) => (
              <Card
                key={idx}
                className="bg-card border-border/50 p-8 hover:border-accent/30 transition-all hover:shadow-lg hover:shadow-accent/10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{category.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, sidx) => (
                    <span
                      key={sidx}
                      className="px-3 py-1 bg-accent/10 text-accent text-sm font-mono rounded-full border border-accent/30 hover:border-accent/60 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Certifications */}
          <div className="mt-12 p-8 bg-card border border-border/50 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Certifications</h3>
            <div className="flex flex-wrap gap-3">
              {["Tableau Desktop Specialist", "AWS Certified Cloud Practitioner", "AWS Certified Data Engineer"].map(
                (cert, idx) => (
                  <span key={idx} className="px-4 py-2 bg-accent/5 border border-accent/20 rounded-lg text-sm">
                    {cert}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-24 bg-card/50">
        <div className="container max-w-5xl">
          <div className="mb-16">
            <p className="text-accent font-mono text-sm font-semibold tracking-widest mb-2">ACADEMIC BACKGROUND</p>
            <h2 className="text-5xl font-bold">Education</h2>
            <div className="w-16 h-1 bg-accent mt-4"></div>
          </div>

          <div className="space-y-6">
            <Card className="bg-background border-border/50 p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-accent">Master of Science in Business Analytics</h3>
                  <p className="text-lg text-foreground font-semibold">University of Rochester</p>
                  <p className="text-sm text-muted-foreground">STEM-Certified Program | Meliora Scholarship Recipient</p>
                </div>
                <p className="text-sm text-muted-foreground font-mono whitespace-nowrap">December 2021</p>
              </div>
            </Card>

            <Card className="bg-background border-border/50 p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-accent">Bachelor of Science in Business Administration</h3>
                  <p className="text-lg text-foreground font-semibold">University of Southern California</p>
                  <p className="text-sm text-muted-foreground">Minor in Mathematical Finance</p>
                </div>
                <p className="text-sm text-muted-foreground font-mono whitespace-nowrap">May 2019</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Visualization */}
      <section className="py-24">
        <div className="container max-w-5xl">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663281322185/UTnMcuaBKfFrE5Wb4LZwfa/tech-stack-visual-AVGnuPPg9N9NQ2qVUdLJFS.webp"
              alt="Tech stack visualization"
              className="w-full h-96 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent flex items-center">
              <div className="pl-8">
                <h3 className="text-3xl font-bold text-accent mb-2">Modern Tech Stack</h3>
                <p className="text-foreground/80">Proficient in cutting-edge data engineering and ML technologies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-card/50">
        <div className="container max-w-4xl text-center">
          <div className="mb-12">
            <p className="text-accent font-mono text-sm font-semibold tracking-widest mb-2">GET IN TOUCH</p>
            <h2 className="text-5xl font-bold mb-4">Let's Connect</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              I'm always interested in hearing about new projects and opportunities. Feel free to reach out!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 flex-wrap">
            <a
              href="mailto:alexhuang1238@outlook.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-semibold"
            >
              <Mail className="w-5 h-5" />
              Email Me
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors font-semibold"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors font-semibold"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
            <a
              href="https://d2xsxph8kpxj0f.cloudfront.net/310519663281322185/UTnMcuaBKfFrE5Wb4LZwfa/AlexHuang_Resume_99dc4573.pdf"
              download="AlexHuang_Resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent text-accent rounded-lg hover:bg-accent/20 transition-colors font-semibold"
            >
              <ExternalLink className="w-5 h-5" />
              Download Resume
            </a>
          </div>

          <div className="p-8 bg-background border border-border/50 rounded-xl">
            <p className="text-foreground/80 mb-4">📍 Based in Hong Kong SAR | Authorized to work in HK with TTPS</p>
            <p className="text-foreground/80">📞 +852-6467-0968</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container max-w-5xl">
          <div className="relative">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663281322185/UTnMcuaBKfFrE5Wb4LZwfa/footer-accent-JAKsmEPwjtHXQEyVhtz7Zh.png"
              alt="Footer accent"
              className="w-full h-24 object-cover opacity-50 mb-6"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground text-sm">
              © 2026 Alex Huang. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
