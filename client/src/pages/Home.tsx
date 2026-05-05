import { Card } from "@/components/ui/card";
import { Mail, Github, Linkedin, ExternalLink, ChevronDown, Code2, Database, Cloud, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

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
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const experiences: ExperienceItem[] = [
    {
      company: t('experience.company.real_messenger'),
      role: t('experience.role.data_engineer'),
      period: "Dec 2025 - Present",
      location: t('experience.location.hong_kong'),
      highlights: [
        t('experience.highlight.real_messenger_1'),
        t('experience.highlight.real_messenger_2'),
        t('experience.highlight.real_messenger_3'),
        t('experience.highlight.real_messenger_4')
      ]
    },
    {
      company: t('experience.company.simo'),
      role: t('experience.role.data_analyst'),
      period: "Dec 2024 - Nov 2025",
      location: t('experience.location.shenzhen'),
      highlights: [
        t('experience.highlight.simo_1'),
        t('experience.highlight.simo_2'),
        t('experience.highlight.simo_3'),
        t('experience.highlight.simo_4')
      ]
    },
    {
      company: t('experience.company.ames_it'),
      role: t('experience.role.data_scientist'),
      period: "Mar 2023 - Nov 2024",
      location: t('experience.location.los_angeles'),
      highlights: [
        t('experience.highlight.ames_it_1'),
        t('experience.highlight.ames_it_2'),
        t('experience.highlight.ames_it_3'),
        t('experience.highlight.ames_it_4')
      ]
    },
    {
      company: t('experience.company.ucla_health'),
      role: t('experience.role.bi_analyst'),
      period: "Jan 2022 - Mar 2023",
      location: t('experience.location.los_angeles'),
      highlights: [
        t('experience.highlight.ucla_health_1'),
        t('experience.highlight.ucla_health_2'),
        t('experience.highlight.ucla_health_3'),
        t('experience.highlight.ucla_health_4')
      ]
    },
    {
      company: t('experience.company.warner_bros'),
      role: t('experience.role.business_analyst'),
      period: "Jan 2019 - Dec 2020",
      location: t('experience.location.los_angeles'),
      highlights: [
        t('experience.highlight.warner_bros_1'),
        t('experience.highlight.warner_bros_2'),
        t('experience.highlight.warner_bros_3'),
        t('experience.highlight.warner_bros_4')
      ]
    }
  ];

  const skillCategories: SkillCategory[] = [
    {
      name: t('skills.programming'),
      icon: <Code2 className="w-5 h-5" />,
      skills: [t('skill.python'), t('skill.sql'), t('skill.r'), t('skill.golang'), t('skill.javascript')]
    },
    {
      name: t('skills.data_etl'),
      icon: <Database className="w-5 h-5" />,
      skills: [t('skill.apache_spark'), t('skill.apache_hadoop'), t('skill.airflow'), t('skill.databricks'), t('skill.postgresql'), t('skill.mongodb'), t('skill.mysql')]
    },
    {
      name: t('skills.cloud_devops'),
      icon: <Cloud className="w-5 h-5" />,
      skills: [t('skill.aws'), t('skill.kubernetes'), t('skill.docker'), t('skill.git'), t('skill.cicd')]
    },
    {
      name: t('skills.ml_analytics'),
      icon: <Zap className="w-5 h-5" />,
      skills: [t('skill.fastapi'), t('skill.tensorflow'), t('skill.langchain'), t('skill.tableau'), t('skill.data_visualization')]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full">
        <div className="grid grid-cols-[auto_1fr_auto] items-center px-8 py-6 max-w-7xl mx-auto w-full">

          {/* Left: Logo */}
          <div className="flex items-center">
            <div className="font-mono font-bold text-xl text-accent">AH</div>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-6">
            <a href="#experience" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">{t('nav.experience')}</a>
            <a href="#skills" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">{t('nav.skills')}</a>
            <a href="#education" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">{t('nav.education')}</a>
            <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">{t('nav.dashboard')}</a>
            <a href="/salary-predictor" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">{t('nav.predictor')}</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">{t('nav.contact')}</a>
          </div>

          {/* Right: Language Switcher */}
          <div className="flex items-center justify-end">
            <LanguageSwitcher />
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-0"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl flex flex-col items-center animate-fade-in">
          <p className="text-accent font-mono text-sm font-semibold tracking-widest mb-4">{t('hero.welcome')}</p>

          <h1 className="text-5xl sm:text-5xl md:text-5xl leading-[0.95] tracking-[-2.46px] font-normal text-foreground font-[var(--font-display)]">
            {t('hero.name')}
          </h1>

          <p className="text-foreground text-xl sm:text-2xl mt-6 mb-2 font-[var(--font-display)]">
            Where <em className="not-italic text-muted-foreground">dreams</em> rise <em className="not-italic text-muted-foreground">through the silence</em>.
          </p>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex items-center gap-4 pt-8">
            <a
              href="https://github.com/alexhuangtheboy"
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass rounded-full px-8 py-3 text-sm text-foreground hover:scale-[1.03] transition-transform font-semibold"
            >
              {t('hero.view_work')}
            </a>
            <a
              href="https://d2xsxph8kpxj0f.cloudfront.net/310519663281322185/UTnMcuaBKfFrE5Wb4LZwfa/AlexHuang_Resume_99dc4573.pdf"
              download="AlexHuang_Resume.pdf"
              className="liquid-glass rounded-full px-8 py-3 text-sm text-foreground hover:scale-[1.03] transition-transform font-semibold"
            >
              {t('contact.resume')}
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-6 h-6 text-foreground" />
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 bg-card/50">
        <div className="container max-w-5xl">
          <div className="mb-16 text-center">
            <p className="text-accent font-mono text-sm font-semibold tracking-widest mb-2">{t('section.professional_journey')}</p>
            <h2 className="text-5xl font-bold">{t('experience.title')}</h2>
            <div className="w-16 h-1 bg-accent mt-4 mx-auto"></div>
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
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="space-y-1">
                      <h3 className="text-3xl font-bold font-mono tracking-tight text-foreground">{exp.role}</h3>
                      <p className="text-2xl text-sky-200 font-semibold leading-none">{exp.company}</p>
                      <p className="text-lg text-muted-foreground/90">{exp.location}</p>
                    </div>
                    <p className="text-base text-muted-foreground font-mono whitespace-nowrap md:pt-1">{exp.period}</p>
                  </div>

                  <ul className="space-y-3">
                    {exp.highlights.map((highlight, hidx) => (
                      <li key={hidx} className="flex gap-3 text-base leading-8 text-foreground/80">
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
          <div className="mb-16 text-center">
            <p className="text-accent font-mono text-sm font-semibold tracking-widest mb-2">{t('section.technical_expertise')}</p>
            <h2 className="text-5xl font-bold">{t('skills.tools')}</h2>
            <div className="w-16 h-1 bg-accent mt-4 mx-auto"></div>
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
                  <div className="p-2 rounded-lg text-accent/20">
                    {category.icon}
                  </div>
                  <h3 className="text-3xl font-bold font-mono tracking-tight text-foreground">{category.name}</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, sidx) => (
                    <span
                      key={sidx}
                      className="px-4 py-1.5 bg-background text-sky-200 text-base font-mono rounded-full border border-border/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-accent/40 transition-colors"
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
              {[t('skill.certification_tableau'), t('skill.certification_aws_practitioner'), t('skill.certification_aws_data_engineer')].map(
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
          <div className="mb-16 text-center">
            <p className="text-accent font-mono text-sm font-semibold tracking-widest mb-2">{t('section.academic_background')}</p>
            <h2 className="text-5xl font-bold">{t('education.title')}</h2>
            <div className="w-16 h-1 bg-accent mt-4 mx-auto"></div>
          </div>

          <div className="space-y-6">
            <Card className="bg-background border-border/50 p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-accent">{t('education.rochester_degree')}</h3>
                  <p className="text-lg text-foreground font-semibold">{t('education.rochester_university')}</p>
                  <p className="text-sm text-muted-foreground">{t('education.rochester_details')}</p>
                </div>
                <p className="text-sm text-muted-foreground font-mono whitespace-nowrap">{t('education.rochester_period')}</p>
              </div>
            </Card>

            <Card className="bg-background border-border/50 p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-accent">{t('education.usc_degree')}</h3>
                  <p className="text-lg text-foreground font-semibold">{t('education.usc_university')}</p>
                  <p className="text-sm text-muted-foreground">{t('education.usc_details')}</p>
                </div>
                <p className="text-sm text-muted-foreground font-mono whitespace-nowrap">{t('education.usc_period')}</p>
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
                <h3 className="text-3xl font-bold text-accent mb-2">{t('skill.tech_stack_title')}</h3>
                <p className="text-foreground/80">{t('skill.tech_stack_description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-card/50">
        <div className="container max-w-4xl text-center">
          <div className="mb-12">
            <p className="text-accent font-mono text-sm font-semibold tracking-widest mb-2">{t('section.get_in_touch')}</p>
            <h2 className="text-5xl font-bold mb-4">{t('contact.subtitle')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('contact.description')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 flex-wrap">
            <a
              href="mailto:alexhuang1238@outlook.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-semibold"
            >
              <Mail className="w-5 h-5" />
              {t('contact.email')}
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-semibold"
            >
              <Linkedin className="w-5 h-5" />
              {t('contact.linkedin')}
            </a>
            <a
              href="https://github.com/alexhuangtheboy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-semibold"
            >
              <Github className="w-5 h-5" />
              {t('contact.github')}
            </a>
            <a
              href="https://d2xsxph8kpxj0f.cloudfront.net/310519663281322185/UTnMcuaBKfFrE5Wb4LZwfa/AlexHuang_Resume_99dc4573.pdf"
              download="AlexHuang_Resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-semibold"
            >
              <ExternalLink className="w-5 h-5" />
              {t('contact.resume')}
            </a>
          </div>

          <div className="p-8 bg-background border border-border/50 rounded-xl">
            <p className="text-foreground/80 mb-4">{t('contact.location')}</p>
            <p className="text-foreground/80">{t('contact.phone')}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                {t('contact.terms')}
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                {t('contact.sitemap')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
