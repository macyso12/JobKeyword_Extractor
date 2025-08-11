import type { Express } from "express";
import { createServer, type Server } from "http";
import { extractKeywordsSchema, type KeywordResult } from "@shared/schema";
import * as cheerio from "cheerio";
import natural from "natural";

// Comprehensive keyword mappings for categorization
const TECHNICAL_SKILLS = new Set([
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust',
  'react', 'vue', 'angular', 'node.js', 'nodejs', 'express', 'django', 'flask', 'spring',
  'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
  'html', 'css', 'sass', 'scss', 'tailwind', 'bootstrap',
  'git', 'github', 'gitlab', 'bitbucket', 'svn',
  'api', 'rest', 'graphql', 'json', 'xml', 'microservices',
  'machine learning', 'ai', 'data science', 'data analysis', 'analytics',
  'cloud computing', 'cloud architecture', 'devops', 'ci/cd',
  'testing', 'unit testing', 'integration testing', 'automation testing',
  'algorithms', 'data structures', 'object-oriented', 'functional programming',
  'web development', 'mobile development', 'frontend', 'backend', 'fullstack'
]);

const SOFT_SKILLS = new Set([
  'communication', 'leadership', 'teamwork', 'collaboration', 'problem solving',
  'critical thinking', 'creativity', 'innovation', 'adaptability', 'flexibility',
  'time management', 'organization', 'project management', 'multitasking',
  'analytical thinking', 'attention to detail', 'decision making',
  'interpersonal skills', 'presentation', 'public speaking', 'writing',
  'mentoring', 'coaching', 'conflict resolution', 'negotiation',
  'customer service', 'client relations', 'stakeholder management',
  'strategic thinking', 'planning', 'execution', 'results-driven',
  'self-motivated', 'proactive', 'initiative', 'independent'
]);

const TOOLS_TECHNOLOGIES = new Set([
  'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'jenkins',
  'terraform', 'ansible', 'puppet', 'chef', 'vagrant',
  'jira', 'confluence', 'slack', 'teams', 'zoom', 'trello', 'asana',
  'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'xd',
  'vs code', 'intellij', 'eclipse', 'sublime', 'atom',
  'webpack', 'babel', 'gulp', 'grunt', 'npm', 'yarn', 'pip',
  'linux', 'unix', 'windows', 'macos', 'ubuntu', 'centos',
  'apache', 'nginx', 'tomcat', 'iis',
  'tableau', 'power bi', 'excel', 'google analytics',
  'postman', 'insomnia', 'swagger', 'api testing'
]);

// Common English stopwords
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'will', 'with', 'you', 'your', 'we', 'our', 'this', 'these',
  'they', 'their', 'them', 'or', 'but', 'have', 'been', 'do', 'does',
  'did', 'can', 'could', 'would', 'should', 'may', 'might', 'must',
  'shall', 'up', 'out', 'down', 'off', 'over', 'under', 'above',
  'below', 'between', 'through', 'during', 'before', 'after', 'into'
]);

function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractKeywords(text: string): string[] {
  const cleaned = cleanText(text);
  const words = cleaned.split(' ');
  
  // Remove stopwords and short words
  const filtered = words.filter(word => 
    word.length > 2 && !STOPWORDS.has(word)
  );
  
  // Count word frequency
  const wordCount = new Map<string, number>();
  filtered.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });
  
  // Extract noun phrases (simple implementation)
  const sentences = natural.SentenceTokenizer.tokenize(text);
  const nounPhrases: string[] = [];
  
  sentences.forEach(sentence => {
    const tokens = natural.WordTokenizer.tokenize(sentence.toLowerCase());
    if (!tokens) return;
    
    // Look for multi-word technical terms
    for (let i = 0; i < tokens.length - 1; i++) {
      const phrase = `${tokens[i]} ${tokens[i + 1]}`;
      if (TECHNICAL_SKILLS.has(phrase) || SOFT_SKILLS.has(phrase) || TOOLS_TECHNOLOGIES.has(phrase)) {
        nounPhrases.push(phrase);
      }
    }
  });
  
  // Combine single words and phrases
  const allKeywords = [...filtered, ...nounPhrases];
  
  // Sort by frequency and relevance
  const keywordScores = new Map<string, number>();
  allKeywords.forEach(keyword => {
    let score = wordCount.get(keyword) || 1;
    
    // Boost score for recognized skills/tools
    if (TECHNICAL_SKILLS.has(keyword) || SOFT_SKILLS.has(keyword) || TOOLS_TECHNOLOGIES.has(keyword)) {
      score *= 3;
    }
    
    keywordScores.set(keyword, score);
  });
  
  return Array.from(keywordScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([keyword]) => keyword)
    .slice(0, 50); // Limit to top 50 keywords
}

function categorizeKeywords(keywords: string[]): KeywordResult {
  const result: KeywordResult = {
    technicalSkills: [],
    softSkills: [],
    toolsAndTechnologies: []
  };
  
  const seenKeywords = new Set<string>();
  
  keywords.forEach(keyword => {
    const normalizedKeyword = keyword.toLowerCase();
    
    // Avoid duplicates
    if (seenKeywords.has(normalizedKeyword)) return;
    seenKeywords.add(normalizedKeyword);
    
    // Capitalize first letter for display
    const displayKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    
    if (TECHNICAL_SKILLS.has(normalizedKeyword)) {
      result.technicalSkills.push(displayKeyword);
    } else if (SOFT_SKILLS.has(normalizedKeyword)) {
      result.softSkills.push(displayKeyword);
    } else if (TOOLS_TECHNOLOGIES.has(normalizedKeyword)) {
      result.toolsAndTechnologies.push(displayKeyword);
    } else {
      // Default categorization based on context clues
      if (normalizedKeyword.includes('develop') || normalizedKeyword.includes('program') || normalizedKeyword.includes('code')) {
        result.technicalSkills.push(displayKeyword);
      } else if (normalizedKeyword.includes('manage') || normalizedKeyword.includes('lead') || normalizedKeyword.includes('communicate')) {
        result.softSkills.push(displayKeyword);
      } else if (normalizedKeyword.length > 2 && !STOPWORDS.has(normalizedKeyword)) {
        result.toolsAndTechnologies.push(displayKeyword);
      }
    }
  });
  
  // Limit results per category
  result.technicalSkills = result.technicalSkills.slice(0, 15);
  result.softSkills = result.softSkills.slice(0, 15);
  result.toolsAndTechnologies = result.toolsAndTechnologies.slice(0, 15);
  
  return result;
}

async function scrapeJobPosting(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove script and style elements
    $('script').remove();
    $('style').remove();
    
    // Try to find job description content
    let content = '';
    
    // Common selectors for job description content
    const selectors = [
      '[class*="job-description"]',
      '[class*="jobDescription"]',
      '[class*="job_description"]',
      '[id*="job-description"]',
      '[id*="jobDescription"]',
      '[class*="description"]',
      '[class*="content"]',
      'main',
      'article',
      '.posting-requirements',
      '.job-details'
    ];
    
    for (const selector of selectors) {
      const element = $(selector);
      if (element.length && element.text().length > 200) {
        content = element.text();
        break;
      }
    }
    
    // Fallback: get all text content if specific selectors don't work
    if (!content || content.length < 200) {
      content = $('body').text();
    }
    
    // Clean up the content
    content = content.replace(/\s+/g, ' ').trim();
    
    if (content.length < 100) {
      throw new Error('Could not extract sufficient content from the job posting');
    }
    
    return content;
  } catch (error) {
    throw new Error(`Failed to scrape job posting: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/extract-keywords", async (req, res) => {
    try {
      const { url } = extractKeywordsSchema.parse(req.body);
      
      // Scrape the job posting
      const content = await scrapeJobPosting(url);
      
      // Extract keywords
      const keywords = extractKeywords(content);
      
      // Categorize keywords
      const result = categorizeKeywords(keywords);
      
      res.json(result);
    } catch (error) {
      console.error('Error extracting keywords:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid URL') || error.message.includes('HTTP error')) {
          res.status(400).json({ 
            message: "Unable to access the provided URL. Please check the URL and try again." 
          });
        } else if (error.message.includes('extract sufficient content')) {
          res.status(400).json({ 
            message: "Could not find a job description on this page. Please try a different URL." 
          });
        } else {
          res.status(500).json({ 
            message: "An error occurred while processing the job posting. Please try again." 
          });
        }
      } else {
        res.status(500).json({ 
          message: "An unexpected error occurred. Please try again." 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
