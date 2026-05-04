import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/90 backdrop-blur-md border-2 border-accent/50 hover:bg-accent/20 hover:border-accent transition-all text-sm font-semibold"
      >
        <Languages className="w-4 h-4 text-accent" />
        <span>{language === 'en' ? '中文' : 'English'}</span>
      </button>
    </div>
  );
}