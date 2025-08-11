import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Loader2, Link, AlertTriangle } from "lucide-react";
import type { KeywordResult, ExtractKeywordsRequest } from "@shared/schema";

interface KeywordExtractorProps {
  onResults: (results: KeywordResult) => void;
  onLoadingChange: (loading: boolean) => void;
}

export function KeywordExtractor({ onResults, onLoadingChange }: KeywordExtractorProps) {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const { toast } = useToast();

  const extractMutation = useMutation({
    mutationFn: async (data: ExtractKeywordsRequest) => {
      const response = await apiRequest("POST", "/api/extract-keywords", data);
      return response.json() as Promise<KeywordResult>;
    },
    onSuccess: (data) => {
      onResults(data);
      onLoadingChange(false);
      toast({
        title: "Keywords extracted successfully!",
        description: "Your job posting has been analyzed and keywords have been categorized.",
      });
    },
    onError: (error: Error) => {
      onLoadingChange(false);
      toast({
        title: "Extraction failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const validateUrl = (urlString: string) => {
    if (!urlString.trim()) {
      setUrlError("Please enter a URL");
      return false;
    }
    
    if (!isValidUrl(urlString)) {
      setUrlError("Please enter a valid URL");
      return false;
    }
    
    setUrlError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUrl(url)) {
      return;
    }
    
    onLoadingChange(true);
    extractMutation.mutate({ url });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    if (newUrl.trim() && !isValidUrl(newUrl)) {
      setUrlError("Please enter a valid URL");
    } else {
      setUrlError("");
    }
  };

  const isLoading = extractMutation.isPending;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Extract Keywords from Job Posting
        </h2>
        <p className="text-sm text-gray-600">
          Paste a job posting URL to automatically extract and categorize relevant keywords.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-extractor">
        <div>
          <Label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Job Posting URL
          </Label>
          <div className="relative">
            <Input
              type="url"
              id="jobUrl"
              name="jobUrl"
              placeholder="https://example.com/job-posting"
              value={url}
              onChange={handleUrlChange}
              className={`w-full pr-10 ${urlError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              data-testid="input-job-url"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Link className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {urlError && (
            <div className="mt-2 text-sm text-red-600 flex items-center gap-1" data-testid="error-url">
              <AlertTriangle className="h-4 w-4" />
              <span>{urlError}</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="w-full bg-blue-50 text-blue-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 border border-blue-200" data-testid="loading-state">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing job posting...</span>
          </div>
        ) : (
          <Button 
            type="submit" 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium border border-gray-200"
            data-testid="button-extract"
          >
            <Search className="h-4 w-4 mr-2" />
            Extract Keywords
          </Button>
        )}
      </form>
    </div>
  );
}
