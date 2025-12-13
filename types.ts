export interface DesignState {
  headline: string;
  subheadline: string;
  ctaText: string;
  primaryColor: string; // Brand Blue: #00539F
  accentColor: string; // Brand Red: #E11C1B
  fontFamily: string;
  layoutMode: 'standard' | 'seasonal' | 'promo';
  backgroundImage: string;
  language: string;
}

export interface BrandIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  suggestion: string;
  fixedState?: Partial<DesignState>; // State changes required to fix it
}

export interface HeatmapPoint {
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  intensity: number; // 0-1
}

export interface Template {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  stateConfig: Partial<DesignState>;
}

export enum ActivePanel {
  TEMPLATES = 'TEMPLATES',
  BRAND_CHECK = 'BRAND_CHECK',
  LOCALIZE = 'LOCALIZE',
  HEATMAP = 'HEATMAP',
}

export const TESCO_BLUE = '#00539F';
export const TESCO_RED = '#E11C1B';
export const WARNING_YELLOW = '#FFC107';
export const SUCCESS_GREEN = '#10B981';

export const INITIAL_STATE: DesignState = {
  headline: "Fresh deals for your family",
  subheadline: "Quality food, every day prices.",
  ctaText: "Shop Now",
  primaryColor: "#000000", // Intentionally wrong for demo
  accentColor: "#FF00FF", // Intentionally wrong for demo
  fontFamily: "Times New Roman", // Intentionally wrong
  layoutMode: 'standard',
  backgroundImage: "https://picsum.photos/800/600",
  language: "English"
};