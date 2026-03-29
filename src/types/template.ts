export type LogoPosition = 'left-top' | 'right-top' | 'center';
export type CTAPosition = 'center' | 'bottom-right';
export type FormatType = 'landscape' | 'square' | 'portrait' | 'story';

export interface LogoConfig {
  enabled: boolean;
  positionX: number;
  positionY: number;
  scale: number;
  opacity: number;
  logoUrl?: string;
  logoData?: string;
}

export interface PackshotConfig {
  enabled: boolean;
  positionX: number;
  positionY: number;
  scale: number;
  opacity: number;
  packshotUrl?: string;
  packshotData?: string;
}

export interface TextConfig {
  enabled: boolean;
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  positionX: number;
  positionY: number;
  maxWidth: number;
}

export interface SubtextConfig {
  enabled: boolean;
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  positionX: number;
  positionY: number;
  maxWidth: number;
}

export interface CTAConfig {
  enabled: boolean;
  text: string;
  position: CTAPosition;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
}

export interface BackgroundConfig {
  color: string;
}

export interface TemplateConfig {
  format: FormatType;
  background: BackgroundConfig;
  logo: LogoConfig | null;
  packshot: PackshotConfig | null;
  text: TextConfig | null;
  subtext: SubtextConfig | null;
  cta: CTAConfig | null;
}

export interface Template {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  config: TemplateConfig;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  template: TemplateConfig;
  logoData?: string;
  packshotData?: string;
}
