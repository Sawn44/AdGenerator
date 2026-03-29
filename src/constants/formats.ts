import type { FormatType } from '../types/template';

export const FORMATS: Record<FormatType, { width: number; height: number; label: string; labelEn: string }> = {
  landscape: { width: 1200, height: 628, label: 'Poziomy (1.91:1)', labelEn: 'Landscape (1.91:1)' },
  square: { width: 1200, height: 1200, label: 'Kwadrat (1:1)', labelEn: 'Square (1:1)' },
  portrait: { width: 960, height: 1200, label: 'Pionowy (4:5)', labelEn: 'Portrait (4:5)' },
  story: { width: 1080, height: 1920, label: 'Story (9:16)', labelEn: 'Story (9:16)' },
};

export const PRESET_COLORS = [
  { name: 'Biały', nameEn: 'White', color: '#FFFFFF' },
  { name: 'Czarny', nameEn: 'Black', color: '#000000' },
  { name: 'Szary jasny', nameEn: 'Light Gray', color: '#F5F5F5' },
  { name: 'Granat', nameEn: 'Navy', color: '#1A1A2E' },
  { name: 'Czerwony', nameEn: 'Red', color: '#E94560' },
];

export const GOOGLE_FONTS = [
  'Roboto Slab',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Inter',
  'Nunito',
  'Playfair Display',
  'Merriweather',
  'Oswald',
  'Raleway',
  'Ubuntu',
  'Rubik',
  'Work Sans',
  'Quicksand',
  'Barlow',
  'Josefin Sans',
  'Cormorant Garamond',
  'Archivo',
  'Karla',
];

export const CTA_POSITIONS = [
  { value: 'center', label: 'Środek', labelEn: 'Center' },
  { value: 'bottom-right', label: 'Prawy dolny', labelEn: 'Bottom right' },
];
