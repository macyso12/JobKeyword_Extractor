import { useState } from "react";
import { KeywordExtractor } from "@/components/keyword-extractor";
import { ResultsSection } from "@/components/results-section";
import { FeatureCards } from "@/components/feature-cards";
import { SearchCode, Clock } from "lucide-react";
import type { KeywordResult } from "@shared/schema";

export default function Home() {
  const [results, setResults] = useState<KeywordResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResults = (newResults: KeywordResult) => {
    setResults(newResults);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3" data-testid="header-title">
              <SearchCode className="h-6 w-6 text-blue-500" />
              Job Keyword Extractor
            </h1>
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1" data-testid="header-tagline">
                <Clock className="h-4 w-4" />
                Results in &lt;5 seconds
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <KeywordExtractor 
          onResults={handleResults} 
          onLoadingChange={handleLoadingChange}
        />
        
        <ResultsSection 
          results={results} 
          isLoading={isLoading}
        />
        
        <FeatureCards />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <p>&copy; 2024 Job Keyword Extractor. Built for job seekers.</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">About</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
