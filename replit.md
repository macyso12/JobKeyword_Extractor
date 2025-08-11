# Overview

This is a Job Keyword Extractor application that analyzes job posting URLs and extracts relevant keywords, categorizing them into Technical Skills, Soft Skills, and Tools & Technologies. The application uses natural language processing to parse job descriptions and help users optimize their resumes by identifying key terms employers are looking for.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, modern UI design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Language**: TypeScript for both frontend and backend consistency
- **API Design**: RESTful endpoints with centralized error handling middleware
- **Web Scraping**: Cheerio library for parsing HTML content from job posting URLs
- **NLP Processing**: Natural language processing using keyword categorization algorithms

## Data Processing
- **Keyword Extraction**: Custom algorithm that categorizes extracted terms into:
  - Technical Skills (programming languages, frameworks, databases)
  - Soft Skills (communication, leadership, problem-solving)
  - Tools & Technologies (cloud platforms, development tools, software)
- **Text Processing**: Stopword filtering and stemming for improved keyword relevance
- **Response Format**: Structured JSON responses with categorized keyword arrays

## Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database interactions
- **Migration System**: Drizzle Kit for schema migrations and database management
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Schema**: User management system with extensible data models

## Development Environment
- **Monorepo Structure**: Shared TypeScript types and schemas between client and server
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **Hot Reload**: Vite development server with HMR for rapid development
- **Error Handling**: Runtime error overlay for development debugging

# External Dependencies

## Core Libraries
- **@neondatabase/serverless**: PostgreSQL database connectivity for production deployment
- **drizzle-orm**: Type-safe ORM for database operations and schema management
- **cheerio**: Server-side HTML parsing for web scraping job posting content
- **natural**: Natural language processing library for text analysis and keyword extraction

## UI Components
- **@radix-ui/***: Comprehensive set of accessible UI primitives for consistent user interface
- **@tanstack/react-query**: Server state management with caching and synchronization
- **lucide-react**: Icon library for consistent visual elements
- **class-variance-authority**: Utility for managing component variants and styling

## Development Tools
- **vite**: Build tool and development server for fast iteration
- **typescript**: Static type checking across the entire application stack
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **@replit/vite-plugin-runtime-error-modal**: Development error handling for Replit environment