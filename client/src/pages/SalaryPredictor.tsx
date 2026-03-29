import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, TrendingUp, BarChart3 } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

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
}

export default function SalaryPredictor() {
  const [formData, setFormData] = useState<PredictionInput>({
    occupation: "",
    age: 25,
    gender: "",
    education: "",
    yearsOfExperience: 0,
    currentSalary: 50000,
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const predictMutation = trpc.salary.predict.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const handlePredict = async () => {
    if (!formData.occupation || !formData.gender || !formData.education) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    predictMutation.mutate(formData);
  };

  const occupations = [
    "Software Engineer",
    "Data Scientist",
    "Product Manager",
    "Designer",
    "Data Engineer",
    "DevOps Engineer",
    "Business Analyst",
    "Project Manager",
    "Consultant",
    "Other",
  ];

  const educationLevels = ["High School", "Bachelor", "Master", "PhD"];
  const genders = ["Male", "Female", "Other"];

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
            <a href="/dashboard" className="text-sm hover:text-accent transition-colors">Dashboard</a>
            <a href="/salary-predictor" className="text-sm text-accent font-semibold">ML Predictor</a>
            <a href="/#contact" className="text-sm hover:text-accent transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-card/50 to-background">
        <div className="container max-w-6xl">
          <div className="space-y-4">
            <p className="text-accent font-mono text-sm font-semibold tracking-widest">MACHINE LEARNING</p>
            <h1 className="text-5xl font-bold">10-Year Salary Predictor</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Predict your potential salary growth over the next 10 years using machine learning. Input your professional details and get personalized insights.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="bg-card border-border/50 p-8">
              <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
              <div className="space-y-6">
                {/* Occupation */}
                <div className="space-y-2">
                  <Label htmlFor="occupation" className="text-sm font-semibold">Occupation *</Label>
                  <Select value={formData.occupation} onValueChange={(value) => setFormData({ ...formData, occupation: value })}>
                    <SelectTrigger id="occupation">
                      <SelectValue placeholder="Select your occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      {occupations.map((occ) => (
                        <SelectItem key={occ} value={occ}>{occ}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-semibold">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="80"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                    className="bg-background border-border"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-semibold">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <Label htmlFor="education" className="text-sm font-semibold">Education Level *</Label>
                  <Select value={formData.education} onValueChange={(value) => setFormData({ ...formData, education: value })}>
                    <SelectTrigger id="education">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((edu) => (
                        <SelectItem key={edu} value={edu}>{edu}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Years of Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-semibold">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="60"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    className="bg-background border-border"
                  />
                </div>

                {/* Current Salary */}
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-sm font-semibold">Current Annual Salary ($)</Label>
                  <Input
                    id="salary"
                    type="number"
                    min="0"
                    value={formData.currentSalary}
                    onChange={(e) => setFormData({ ...formData, currentSalary: parseInt(e.target.value) || 50000 })}
                    className="bg-background border-border"
                  />
                </div>

                {/* Predict Button */}
                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Predict Salary
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Main Result Card */}
                  <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/50 p-8">
                    <div className="space-y-6">
                      <div>
                        <p className="text-muted-foreground text-sm mb-2">Predicted Salary in 10 Years</p>
                        <h3 className="text-5xl font-bold text-accent">
                          ${result.predictedSalary10Years.toLocaleString()}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background/50 rounded-lg p-4">
                          <p className="text-muted-foreground text-xs mb-1">Salary Growth</p>
                          <p className="text-2xl font-bold text-accent">
                            ${result.salaryGrowth.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-4">
                          <p className="text-muted-foreground text-xs mb-1">Growth Rate</p>
                          <p className="text-2xl font-bold text-accent">
                            +{result.growthPercentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="bg-background/50 rounded-lg p-4">
                        <p className="text-muted-foreground text-xs mb-2">Prediction Confidence</p>
                        <div className="w-full bg-background rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-accent h-full transition-all duration-500"
                            style={{ width: `${result.confidenceScore}%` }}
                          />
                        </div>
                        <p className="text-sm font-semibold mt-2">{result.confidenceScore}% Confidence</p>
                      </div>
                    </div>
                  </Card>

                  {/* Insights */}
                  <Card className="bg-card border-border/50 p-6">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      Key Insights
                    </h4>
                    <ul className="space-y-3 text-sm text-foreground/80">
                      <li className="flex gap-2">
                        <span className="text-accent font-bold">•</span>
                        <span>Your predicted salary growth is <strong>${result.salaryGrowth.toLocaleString()}</strong> over 10 years</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent font-bold">•</span>
                        <span>This represents a <strong>{result.growthPercentage.toFixed(1)}%</strong> increase from your current salary</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent font-bold">•</span>
                        <span>The prediction is based on industry trends, experience level, and education background</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent font-bold">•</span>
                        <span>Confidence score of {result.confidenceScore}% indicates model reliability</span>
                      </li>
                    </ul>
                  </Card>
                </>
              ) : (
                <Card className="bg-card border-border/50 p-8 h-full flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-accent/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">Fill in your profile and click "Predict Salary" to see your 10-year salary projection</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 mt-16">
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
