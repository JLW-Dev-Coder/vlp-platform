export interface ReviewConfig {
  platform: string;
  platformName: string;
  themeColor: string;
  apiBase: string;
  formTypes: readonly ('review' | 'case_study' | 'testimonial')[];
  heroHeadline?: string;
  heroSubheadline?: string;
}

export interface ReviewCardData {
  id?: string;
  display_name: string;
  credential?: string;
  firm?: string;
  rating: number;
  content: string;
  created_at: string;
  anonymous?: boolean;
}
