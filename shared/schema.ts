import { z } from "zod";

export const extractKeywordsSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export const keywordResultSchema = z.object({
  technicalSkills: z.array(z.string()),
  softSkills: z.array(z.string()),
  toolsAndTechnologies: z.array(z.string()),
});

export type ExtractKeywordsRequest = z.infer<typeof extractKeywordsSchema>;
export type KeywordResult = z.infer<typeof keywordResultSchema>;
