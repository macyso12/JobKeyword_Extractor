# Job Posting Keywords Extractor (Vibe Coding)

## Problem Space/Prompt Engineering

Build a minimal web app where a user can paste a job posting URL, click a button, and get a categorized list of keywords from that job description.

**Vibe coding software**: Replit 

## Requirements
* **Frontend:** Use Next.js + TailwindCSS. Page should have:
1. Header with app name ("Job Keyword Extractor")
2. Input field for job posting URL
3. "Extract Keywords" button
4. Loading state indicator
5. Results section that shows keywords grouped into categories: "Technical Skills", "Soft Skills", "Tools & Technologies"
6. "Copy All Keywords" button

* **Backend:** Use Node.js with Express or Next.js API routes.
* Scrape the page content from the given URL (use `node-fetch` + `cheerio` or Puppeteer).
* Extract keywords using a simple NLP approach:
* Remove stopwords
* Identify noun phrases and proper nouns
* Rank keywords by frequency (TF-IDF if possible)
* Categorize keywords into the 3 categories above (basic rule-based mapping for MVP).

##  Results
* **Output:** Return a JSON object with categories as keys and an array of keywords as values.
* **Performance:** Must return results in <5 seconds for typical job postings.
* **UI polish:** Minimal, responsive, clean look. Use Tailwind defaults.
* * **Hosting-ready:** Make sure it can deploy on Vercel.
>
> **Example Output JSON:**
>
> ```json
> {
>   "Technical Skills": ["Data Analysis", "Python", "Cloud Architecture"],
>   "Soft Skills": ["Communication", "Problem-Solving", "Leadership"],
>   "Tools & Technologies": ["AWS", "Figma", "Jira"]
> }
> ```

## Demo

https://github.com/user-attachments/assets/39d4f9b6-e37b-4cf7-b107-395967c565a8

