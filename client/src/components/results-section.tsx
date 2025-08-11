import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tags, Copy, Search, ServerCog, Users, Wrench, CheckCircle } from "lucide-react";
import type { KeywordResult } from "@shared/schema";

interface ResultsSectionProps {
  results: KeywordResult | null;
  isLoading: boolean;
}

interface KeywordCategoryProps {
  title: string;
  keywords: string[];
  icon: React.ReactNode;
  colorClass: string;
}

function KeywordCategory({ title, keywords, icon, colorClass }: KeywordCategoryProps) {
  if (keywords.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2" data-testid={`heading-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {icon}
        {title}
      </h3>
      <div className="space-y-2" data-testid={`keywords-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {keywords.map((keyword, index) => (
          <div 
            key={index}
            className={`${colorClass} px-3 py-2 rounded-lg text-sm font-medium`}
            data-testid={`keyword-${keyword.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {keyword}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResultsSection({ results, isLoading }: ResultsSectionProps) {
  const [showToast, setShowToast] = useState(false);
  const { toast } = useToast();

  const copyAllKeywords = async () => {
    if (!results) return;
    
    const allKeywords = [
      ...results.technicalSkills,
      ...results.softSkills,
      ...results.toolsAndTechnologies
    ];
    
    const keywordText = allKeywords.join(', ');
    
    try {
      await navigator.clipboard.writeText(keywordText);
      toast({
        title: "Keywords copied!",
        description: "All keywords have been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy keywords to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const hasResults = results && (
    results.technicalSkills.length > 0 || 
    results.softSkills.length > 0 || 
    results.toolsAndTechnologies.length > 0
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2" data-testid="heading-results">
          <Tags className="h-5 w-5 text-blue-500" />
          Extracted Keywords
        </h2>
        {hasResults && (
          <Button
            onClick={copyAllKeywords}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            data-testid="button-copy-all"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All Keywords
          </Button>
        )}
      </div>

      {hasResults && (
        <div className="grid md:grid-cols-3 gap-6" data-testid="results-grid">
          <KeywordCategory
            title="Technical Skills"
            keywords={results.technicalSkills}
            icon={<ServerCog className="h-4 w-4 text-emerald-500" />}
            colorClass="bg-emerald-50 text-emerald-800 border border-emerald-200"
          />
          
          <KeywordCategory
            title="Soft Skills"
            keywords={results.softSkills}
            icon={<Users className="h-4 w-4 text-blue-500" />}
            colorClass="bg-blue-50 text-blue-800 border border-blue-200"
          />
          
          <KeywordCategory
            title="Tools & Technologies"
            keywords={results.toolsAndTechnologies}
            icon={<Wrench className="h-4 w-4 text-purple-500" />}
            colorClass="bg-purple-50 text-purple-800 border border-purple-200"
          />
        </div>
      )}

      {!hasResults && !isLoading && (
        <div className="text-center py-12" data-testid="empty-state">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No keywords extracted yet</h3>
          <p className="text-gray-600">Enter a job posting URL above to get started.</p>
        </div>
      )}
    </div>
  );
}
