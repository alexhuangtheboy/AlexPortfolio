import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, TrendingUp, BarChart3 } from "lucide-react";
import { useState } from "react";
import { predictSalary } from "../../../server/salaryPredictor";
import { useLanguage } from "@/contexts/LanguageContext";

interface PredictionInput {
  occupation: string;
  age: number;
  gender: string;
  education: string;
  yearsOfExperience: number;
  currentSalary: number;
}

interface PredictionResult {
  predictedSalary10Years: number;
  confidenceScore: number;
  salaryGrowth: number;
  growthPercentage: number;
  modelType?: string;
  modelR2?: number;
}

export default function SalaryPredictor() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<PredictionInput>({ occupation: "", age: 25, gender: "", education: "", yearsOfExperience: 0, currentSalary: 0 });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getOccupationTranslation = (occupation: string): string => {
    const translations: Record<string, string> = {
      'Software Engineer': t('predictor.occupation.software_engineer'),
      'Data Scientist': t('predictor.occupation.data_scientist'),
      'Product Manager': t('predictor.occupation.product_manager'),
      'Designer': t('predictor.occupation.designer'),
      'Data Engineer': t('predictor.occupation.data_engineer'),
      'DevOps Engineer': t('predictor.occupation.devops_engineer'),
      'Business Analyst': t('predictor.occupation.business_analyst'),
      'Project Manager': t('predictor.occupation.project_manager'),
      'Consultant': t('predictor.occupation.consultant'),
      'Other': t('predictor.occupation.other'),
    };
    return translations[occupation] || occupation;
  };

  const getGenderTranslation = (gender: string): string => {
    const translations: Record<string, string> = {
      'Male': t('predictor.male'),
      'Female': t('predictor.female'),
      'Other': t('predictor.other'),
    };
    return translations[gender] || gender;
  };

  const getEducationTranslation = (education: string): string => {
    const translations: Record<string, string> = {
      'High School': t('predictor.high_school'),
      'Bachelor': t('predictor.bachelor'),
      'Master': t('predictor.master'),
      'PhD': t('predictor.phd'),
    };
    return translations[education] || education;
  };

  const handlePredict = async () => {
    if (!formData.occupation || !formData.gender || !formData.education) {
      alert(t('predictor.required_fields'));
      return;
    }
    try {
      setIsLoading(true);
      setResult(predictSalary(formData));
    } catch (error) {
      console.error(error);
      alert(t('predictor.prediction_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const occupations = ["Software Engineer", "Data Scientist", "Product Manager", "Designer", "Data Engineer", "DevOps Engineer", "Business Analyst", "Project Manager", "Consultant", "Other"];
  const educationLevels = ["High School", "Bachelor", "Master", "PhD"];
  const genders = ["Male", "Female", "Other"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container grid grid-cols-[auto_1fr_auto] items-center h-16">
          <a href="/" className="font-mono font-bold text-xl text-accent">AH</a>
          <div className="flex items-center justify-center gap-8">
            <a href="/#experience" className="text-sm hover:text-accent transition-colors">{t('nav.experience')}</a>
            <a href="/#skills" className="text-sm hover:text-accent transition-colors">{t('nav.skills')}</a>
            <a href="/#education" className="text-sm hover:text-accent transition-colors">{t('nav.education')}</a>
            <a href="/dashboard" className="text-sm hover:text-accent transition-colors">{t('nav.dashboard')}</a>
            <a href="/salary-predictor" className="text-sm text-accent font-semibold">{t('nav.predictor')}</a>
            <a href="/#contact" className="text-sm hover:text-accent transition-colors">{t('nav.contact')}</a>
          </div>
          <div />
        </div>
      </nav>

      <section className="pt-32 pb-16 bg-gradient-to-b from-card/50 to-background">
        <div className="container max-w-6xl">
          <div className="space-y-4">
            <p className="text-accent font-mono text-sm font-semibold tracking-widest">{t('predictor.header.machine_learning')}</p>
            <h1 className="text-5xl font-bold">{t('predictor.header.title')}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{t('predictor.header.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-card border-border/50 p-8">
              <h2 className="text-2xl font-bold mb-6">{t('predictor.form.title')}</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="occupation" className="text-sm font-semibold">{t('predictor.occupation')} *</Label>
                  <Select value={formData.occupation} onValueChange={(value) => setFormData({ ...formData, occupation: value })}>
                    <SelectTrigger id="occupation"><SelectValue placeholder={t('predictor.form.occupation_placeholder')} /></SelectTrigger>
                    <SelectContent>{occupations.map((occ) => <SelectItem key={occ} value={occ}>{getOccupationTranslation(occ)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-semibold">{t('predictor.age')}</Label>
                  <Input id="age" type="text" inputMode="numeric" value={formData.age} onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    if (val === "") setFormData({ ...formData, age: 0 });
                    else setFormData({ ...formData, age: parseInt(val) });
                  }} className="bg-background border-border" placeholder={t('predictor.form.age_placeholder')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-semibold">{t('predictor.gender')} *</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger id="gender"><SelectValue placeholder={t('predictor.form.gender_placeholder')} /></SelectTrigger>
                    <SelectContent>{genders.map((g) => <SelectItem key={g} value={g}>{getGenderTranslation(g)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education" className="text-sm font-semibold">{t('predictor.education')} *</Label>
                  <Select value={formData.education} onValueChange={(value) => setFormData({ ...formData, education: value })}>
                    <SelectTrigger id="education"><SelectValue placeholder={t('predictor.form.education_placeholder')} /></SelectTrigger>
                    <SelectContent>{educationLevels.map((edu) => <SelectItem key={edu} value={edu}>{getEducationTranslation(edu)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-semibold">{t('predictor.years_of_experience')}</Label>
                  <Input id="experience" type="text" inputMode="numeric" value={formData.yearsOfExperience} onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    if (val === "") setFormData({ ...formData, yearsOfExperience: 0 });
                    else {
                      const num = parseInt(val);
                      if (num >= 0 && num <= 60) setFormData({ ...formData, yearsOfExperience: num });
                      else if (num > 60) setFormData({ ...formData, yearsOfExperience: 60 });
                    }
                  }} className="bg-background border-border" placeholder={t('predictor.form.experience_placeholder')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-sm font-semibold">{t('predictor.current_salary')} ($)</Label>
                  <Input id="salary" type="text" inputMode="numeric" value={formData.currentSalary} onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    if (val === "") setFormData({ ...formData, currentSalary: 0 });
                    else setFormData({ ...formData, currentSalary: parseInt(val) });
                  }} className="bg-background border-border" placeholder={t('predictor.form.salary_placeholder')} />
                </div>

                <Button onClick={handlePredict} disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold">
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('predictor.form.predicting_button')}</> : <><BarChart3 className="w-4 h-4 mr-2" />{t('predictor.form.predict_button')}</>}
                </Button>
              </div>
            </Card>

            <div className="space-y-6">
              {result ? (
                <>
                  <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/50 p-8">
                    <div className="space-y-6">
                      <div>
                        <p className="text-muted-foreground text-sm mb-2">{t('predictor.results.predicted_10_years')}</p>
                        <h3 className="text-5xl font-bold text-accent">${result.predictedSalary10Years.toLocaleString()}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background/50 rounded-lg p-4"><p className="text-muted-foreground text-xs mb-1">{t('predictor.salary_growth')}</p><p className="text-2xl font-bold text-accent">${result.salaryGrowth.toLocaleString()}</p></div>
                        <div className="bg-background/50 rounded-lg p-4"><p className="text-muted-foreground text-xs mb-1">{t('predictor.growth_percentage')}</p><p className="text-2xl font-bold text-accent">+{result.growthPercentage.toFixed(1)}%</p></div>
                      </div>
                      <div className="bg-background/50 rounded-lg p-4">
                        <p className="text-muted-foreground text-xs mb-2">{t('predictor.results.confidence')}</p>
                        <div className="w-full bg-background rounded-full h-3 overflow-hidden"><div className="bg-accent h-full transition-all duration-500" style={{ width: `${result.confidenceScore}%` }} /></div>
                        <p className="text-sm font-semibold mt-2">{result.confidenceScore}% {t('predictor.results.confidence_percent')}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-card border-border/50 p-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-accent" />{t('predictor.results.insights')}</h4>
                    <ul className="space-y-3 text-sm text-foreground/80">
                      <li className="flex gap-2"><span className="text-accent font-bold">?</span><span>{t('predictor.results.insight1')} <strong>${result.salaryGrowth.toLocaleString()}</strong></span></li>
                      <li className="flex gap-2"><span className="text-accent font-bold">?</span><span>{t('predictor.results.insight2')} <strong>{result.growthPercentage.toFixed(1)}%</strong></span></li>
                      <li className="flex gap-2"><span className="text-accent font-bold">?</span><span>{t('predictor.results.insight3')}</span></li>
                    </ul>
                  </Card>
                </>
              ) : (
                <Card className="bg-card border-border/50 p-8 h-full flex items-center justify-center">
                  <div className="text-center"><BarChart3 className="w-12 h-12 text-accent/50 mx-auto mb-4" /><p className="text-muted-foreground">{t('predictor.results.placeholder')}</p></div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border/50 mt-16">
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
