export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: Record<string, string[]>;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  gradient: string;
  liveUrl: string;
  githubUrl: string;
}

export interface Skill {
  name: string;
  category: "Frontend" | "Backend" | "DevOps";
  proficiency: number;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface RateLimitEntry {
  count: number;
  resetAt: number;
}
