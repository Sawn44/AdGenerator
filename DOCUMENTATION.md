# PMAX Ad Generator - Dokumentacja Techniczna

## Spis treści

1. [Przegląd aplikacji](#przegląd-aplikacji)
2. [Struktura projektu](#struktura-projektu)
3. [Typy danych](#typy-danych)
4. [Komponenty](#komponenty)
5. [Hooki i narzędzia](#hooki-i-narzędzia)
6. [Szablony](#szablony)
7. [Internacjonalizacja](#internacjonalizacja)
8. [Konfiguracja](#konfiguracja)

---

## Przegląd aplikacji

**PMAX Ad Generator** to aplikacja React do tworzenia reklam Google Ads PMAX w czterech formatach:
- Landscape (1200x628) - 1.91:1
- Square (1200x1200) - 1:1
- Portrait (960x1200) - 4:5
- Story (1080x1920) - 9:16

### Główne funkcje
- Edycjacanvas z podglądem na żywo
- Wgrywanie logo i packshota z kontrolą pozycji X/Y, skali i przezroczystości
- Tekst główny i dodatkowy z pełną kontrolą (font, rozmiar, kolor, pozycja)
- Przycisk CTA z konfigurowalnymi opcjami
- Eksport do JPG
- Zapisywanie/wczytywanie projektów z LocalStorage
- 5 wbudowanych szablonów + import/eksport szablonów
- Internacjonalizacja (PL/EN)

---

## Struktura projektu

```
src/
├── main.tsx                 # Punkt wejścia aplikacji
├── App.tsx                  # Główny komponent aplikacji
├── App.css                  # Style aplikacji
├── index.css                # Style globalne + Tailwind
├── i18n/
│   ├── index.ts            # Konfiguracja i18next
│   ├── en.json             # Tłumaczenia angielskie
│   └── pl.json             # Tłumaczenia polskie
├── templates/              # Wbudowane szablony JSON
│   ├── blank-landscape.json
│   ├── blank-square.json
│   ├── product-hero.json
│   ├── promo-red.json
│   └── elegant-dark.json
├── types/
│   └── template.ts         # Definicje typów TypeScript
├── constants/
│   └── formats.ts          # Stałe (formaty, fonty, kolory)
├── hooks/
│   ├── useLocalStorage.ts  # Hook do zarządzania projektami
│   └── useExport.ts        # Hook do eksportu JPG
├── utils/
│   └── fonts.ts            # Funkcje do ładowania Google Fonts
└── components/
    ├── Canvas/
    │   └── CanvasEditor.tsx     # Komponent canvas z logiką rysowania
    ├── Sidebar/
    │   ├── Sidebar.tsx          # Główny sidebar
    │   ├── FormatSelector.tsx   # Wybór formatu reklamy
    │   ├── TemplateSelector.tsx # Wybór szablonu
    │   ├── BackgroundSettings.tsx
    │   ├── LogoSettings.tsx
    │   ├── PackshotSettings.tsx
    │   ├── TextSettings.tsx
    │   ├── SubtextSettings.tsx
    │   ├── CTASettings.tsx
    │   └── ProjectManager.tsx
    └── common/
        ├── Toggle.tsx          # Przełącznik wł./wył.
        ├── Select.tsx          # Lista rozwijana
        ├── ColorPicker.tsx    # Wybór koloru
        ├── Slider.tsx         # Suwak wartości
        └── FileUploader.tsx   # Wgrywanie plików
```

---

## Typy danych

### Plik: `src/types/template.ts`

```typescript
// Typ pozycji przycisku CTA
export type CTAPosition = 'center' | 'bottom-right';

// Typ formatu reklamy
export type FormatType = 'landscape' | 'square' | 'portrait' | 'story';

// Konfiguracja logo
export interface LogoConfig {
  enabled: boolean;        // Czy logo jest włączone
  positionX: number;        // Pozycja X (0-100%)
  positionY: number;        // Pozycja Y (0-100%)
  scale: number;           // Skala (procent szerokości canvas)
  opacity: number;         // Przezroczystość (0-100)
}

// Konfiguracja packshota (zdjęcia produktu)
export interface PackshotConfig {
  enabled: boolean;
  positionX: number;        // Przesunięcie od środka (-50 do 50%)
  positionY: number;        // Pozycja Y procentowo (0-100%)
  scale: number;            // Skala jako procent szerokości
  opacity: number;          // Przezroczystość (0-100)
}

// Konfiguracja tekstu głównego
export interface TextConfig {
  enabled: boolean;
  content: string;         // Treść tekstu (może zawierać \n)
  fontFamily: string;      // Nazwa fontu Google Fonts
  fontSize: number;        // Rozmiar fontu w pikselach
  color: string;           // Kolor hex
  positionX: number;       // Pozycja X (0-100%)
  positionY: number;       // Pozycja Y (0-100%)
  maxWidth: number;        // Maksymalna szerokość (0-100%)
}

// Konfiguracja tekstu dodatkowego (subtext)
export interface SubtextConfig {
  // Identyczne pola jak TextConfig
  enabled: boolean;
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  positionX: number;
  positionY: number;
  maxWidth: number;
}

// Konfiguracja przycisku CTA
export interface CTAConfig {
  enabled: boolean;
  text: string;            // Tekst na przycisku
  position: CTAPosition;   // 'center' | 'bottom-right'
  backgroundColor: string;   // Kolor tła przycisku
  textColor: string;        // Kolor tekstu
  borderRadius: number;    // Zaokrąglenie rogów w pikselach
}

// Konfiguracja tła
export interface BackgroundConfig {
  color: string;           // Kolor hex
}

// Główna konfiguracja szablonu
export interface TemplateConfig {
  format: FormatType;
  background: BackgroundConfig;
  logo: LogoConfig | null;       // null = wyłączone
  packshot: PackshotConfig | null;
  text: TextConfig | null;
  subtext: SubtextConfig | null;
  cta: CTAConfig | null;
}

// Definicja szablonu
export interface Template {
  id: string;              // Unikalny identyfikator
  name: string;            // Nazwa polska
  nameEn: string;          // Nazwa angielska
  category: string;        // Kategoria: 'offer', 'product', 'event', 'blank'
  config: TemplateConfig;  // Pełna konfiguracja
}

// Zapisany projekt
export interface Project {
  id: string;              // Format: 'proj_{timestamp}'
  name: string;             // Nazwa projektu
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
  template: TemplateConfig; // Konfiguracja
  logoData?: string;        // Base64 obrazu logo
  packshotData?: string;    // Base64 obrazu packshota
}
```

---

## Komponenty

### `App.tsx` - Główny komponent aplikacji

**Stan:**
- `templates` - lista wszystkich szablonów (wbudowane + custom)
- `config` - aktualna konfiguracja TemplateConfig
- `logoData` - base64 obrazu logo
- `packshotData` - base64 obrazu packshota

**Funkcje obsługi:**
- `handleConfigChange()` - aktualizuje konfigurację
- `handleFormatChange()` - zmienia format reklamy
- `handleLogoUpload()` - ustawia dane logo
- `handlePackshotUpload()` - ustawia dane packshota
- `handleSaveProject()` - zapisuje projekt do LocalStorage
- `handleLoadProject()` - wczytuje projekt
- `handleExport()` - eksportuje canvas do JPG

**Ładowanie custom szablonów:**
Na starcie aplikacji sprawdza `localStorage.getItem('custom_templates')` i łączy z wbudowanymi szablonami.

---

### `src/components/Canvas/CanvasEditor.tsx`

Główny komponent canvas do rysowania i podglądu reklamy.

**Props:**
```typescript
interface CanvasEditorProps {
  config: TemplateConfig;           // Konfiguracja szablonu
  logoData: string | null;          // Base64 logo
  packshotData: string | null;      // Base64 packshota
  format: FormatType;               // Aktualny format
  canvasRef: React.RefObject<HTMLCanvasElement | null>; // Ref do canvas
}
```

**Funkcje wewnętrzne:**

`wrapText()` - Zawija tekst do wielu linii
```typescript
function wrapText(
  ctx: CanvasRenderingContext2D,  // Kontekst canvas
  text: string,                    // Tekst do zawinięcia
  maxWidth: number                 // Maksymalna szerokość w pikselach
): string[]                        // Tablica linii
```
- Obsługuje段落 (separacja \n)
- Automatycznie dzieli słowa
- Zwraca tablicę linii

`roundRect()` - Rysuje zaokrąglony prostokąt
```typescript
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,                       // Pozycja X
  y: number,                       // Pozycja Y
  width: number,                   // Szerokość
  height: number,                  // Wysokość
  radius: number                   // Promień zaokrąglenia
)
```

**Proces rysowania (funkcja `draw()`):**
1. Ustawia wymiary canvas na podstawie formatu
2. Rysuje tło (fillRect)
3. Rysuje packshot (jeśli włączony) - obraz produktu
4. Rysuje tekst główny (jeśli włączony)
5. Rysuje tekst dodatkowy/subtext (jeśli włączony)
6. Rysuje przycisk CTA (jeśli włączony)
7. Rysuje logo (jeśli włączone)

**Algorytm pozycjonowania:**
- `positionX` 0-100% przeliczane na współrzędną X
- Logo: `x = width/2 + (positionX/100) * (width/2)`
- Packshot: `x = width/2 + (positionX/100) * (width/2)`
- Teksty: `x = (positionX/100) * width`

---

### `src/components/Sidebar/Sidebar.tsx`

Główny kontener sidebar z wszystkimi ustawieniami.

**Props:**
```typescript
interface SidebarProps {
  templates: Template[];
  config: TemplateConfig;
  onConfigChange: (config: TemplateConfig) => void;
  onFormatChange: (format: FormatType) => void;
  onLogoUpload: (data: string) => void;
  onPackshotUpload: (data: string) => void;
  onSaveProject: (name: string) => void;
  onLoadProject: (project: Project) => void;
}
```

**Struktura UI:**
- Nagłówek z tytułem i przełącznikiem języka
- Karty z poszczególnymi sekcjami (FormatSelector, BackgroundSettings, LogoSettings, itd.)

---

### `src/components/Sidebar/LogoSettings.tsx`

Ustawienia logo z kontrolą pozycji X/Y.

**Konfiguracja domyślna (gdy logo włączone):**
```javascript
{
  enabled: false,
  positionX: 50,
  positionY: 5,
  scale: 10,
  opacity: 100
}
```

**Pola:**
- Toggle - włącz/wyłącz
- Upload - wgrywanie obrazu PNG/JPG
- Position X slider (0-100%)
- Position Y slider (0-100%)
- Scale slider (1-30%)
- Opacity slider (0-100%)

---

### `src/components/Sidebar/PackshotSettings.tsx`

Ustawienia packshota (zdjęcia produktu).

**Konfiguracja domyślna:**
```javascript
{
  enabled: false,
  positionX: 0,
  positionY: 50,
  scale: 50,
  opacity: 100
}
```

**Pola:**
- Toggle - włącz/wyłącz
- Upload - wgrywanie obrazu
- Position X slider (-50 do 50%) - przesunięcie od środka
- Position Y slider (0-100%) - pozycja pionowa
- Scale slider (10-100%)
- Opacity slider (0-100%)

---

### `src/components/Sidebar/TextSettings.tsx`

Ustawienia tekstu głównego.

**Konfiguracja domyślna:**
```javascript
{
  enabled: false,
  content: '',
  fontFamily: 'Roboto Slab',
  fontSize: 42,
  color: '#000000',
  positionX: 50,
  positionY: 50,
  maxWidth: 80
}
```

**Pola:**
- Toggle - włącz/wyłącz
- Textarea - treść tekstu (wieloliniowa)
- Font select - wybór fontu Google Fonts
- Font size slider (12-120px)
- Color picker
- Position X slider (0-100%)
- Position Y slider (0-100%)
- Max width slider (20-100%)

---

### `src/components/Sidebar/SubtextSettings.tsx`

Ustawienia tekstu dodatkowego. Identyczna struktura jak TextSettings.

**Konfiguracja domyślna:**
```javascript
{
  enabled: false,
  content: '',
  fontFamily: 'Roboto Slab',
  fontSize: 24,  // Domyślnie mniejszy niż main text
  color: '#666666',
  positionX: 50,
  positionY: 60,
  maxWidth: 70
}
```

---

### `src/components/Sidebar/CTASettings.tsx`

Ustawienia przycisku CTA.

**Konfiguracja domyślna:**
```javascript
{
  enabled: false,
  text: '',
  position: 'bottom-right',
  backgroundColor: '#000000',
  textColor: '#FFFFFF',
  borderRadius: 8
}
```

**Pola:**
- Toggle - włącz/wyłącz
- Input - tekst na przycisku
- Position select - 'center' | 'bottom-right'
- Background color picker
- Text color picker
- Border radius slider (0-50px)

---

### `src/components/Sidebar/FormatSelector.tsx`

Wybór formatu reklamy.

**Dostępne formaty:**
| Format | Wymiary | Proporcje |
|--------|---------|-----------|
| landscape | 1200x628 | 1.91:1 |
| square | 1200x1200 | 1:1 |
| portrait | 960x1200 | 4:5 |
| story | 1080x1920 | 9:16 |

---

### `src/components/Sidebar/TemplateSelector.tsx`

Wybór szablonu z listy wbudowanych i custom.

**Kategorie szablonów:**
- `blank` - puste szablony
- `offer` - oferty promocyjne
- `product` - produkty
- `event` - wydarzenia

**Funkcje:**
- Eksport szablonu do JSON
- Import szablonu z JSON
- Custom szablony zapisywane w LocalStorage

---

### `src/components/Sidebar/BackgroundSettings.tsx`

Ustawienia tła reklamy.

**Presety kolorów:**
| Nazwa PL | Nazwa EN | Kolor |
|----------|----------|-------|
| Biały | White | #FFFFFF |
| Czarny | Black | #000000 |
| Szary jasny | Light Gray | #F5F5F5 |
| Granat | Navy | #1A1A2E |
| Czerwony | Red | #E94560 |

---

### `src/components/Sidebar/ProjectManager.tsx`

Zarządzanie zapisanymi projektami.

**Operacje:**
- Lista zapisanych projektów
- Wczytanie projektu
- Usunięcie projektu
- Zapis aktualnego stanu jako nowy projekt

**Przechowywanie:**
- Klucz LocalStorage: `pmax_projects`
- Format: tablica obiektów Project

---

### `src/components/common/Toggle.tsx`

Przełącznik włącz/wyłącz z opcjonalną ikoną Heroicons.

```typescript
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;  // Opcjonalna ikona
  label?: string;          // Opcjonalna etykieta
}
```

---

### `src/components/common/Select.tsx`

Lista rozwijana z obsługą i18n.

```typescript
interface SelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Array<{
    value: T;
    label: string;
    labelEn?: string;
  }>;
  label?: string;
}
```

---

### `src/components/common/Slider.tsx`

Suwak do wyboru wartości numerycznej.

```typescript
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  unit?: string;  // np. 'px', '%'
  showValue?: boolean;
}
```

---

### `src/components/common/ColorPicker.tsx`

Wybór koloru z predefiniowanymi presetami.

```typescript
interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: Array<{ name: string; nameEn: string; color: string }>;
}
```

---

### `src/components/common/FileUploader.tsx`

Komponent do wgrywania plików obrazów.

```typescript
interface FileUploaderProps {
  onUpload: (dataUrl: string) => void;
  accept?: string;  // np. 'image/*'
  label?: string;
  buttonText?: string;
}
```

**Obsługiwane formaty:** PNG, JPG, JPEG, WEBP, SVG

---

## Hooki i narzędzia

### `src/hooks/useLocalStorage.ts`

Hook do zarządzania projektami w LocalStorage.

```typescript
export function useLocalStorage() {
  // Stan
  projects: Project[]

  // Metody
  saveProject(project: Project): void      // Zapisz/aktualizuj projekt
  deleteProject(id: string): void         // Usuń projekt
  getProject(id: string): Project | undefined

  // Storage key: 'pmax_projects'
}
```

---

### `src/hooks/useExport.ts`

Hook do eksportu canvas do JPG.

```typescript
export function useExport(
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  setFormat(format: FormatType): void       // Ustaw format dla nazwy pliku
  exportJpg(): void                         // Eksportuj jako JPG

  // Domyślna jakość: 0.92
  // Format nazwy: pmax-ad-{format}-{timestamp}.jpg
}
```

---

### `src/utils/fonts.ts`

Funkcje do dynamicznego ładowania Google Fonts.

```typescript
// Ładuje pojedynczy font
loadFont(fontFamily: string): Promise<void>

// Ładuje wiele fontów równolegle
loadFonts(fontFamilies: string[]): Promise<void[]>

// Automatycznie tworzy tag <link> z Google Fonts
// Jeśli font już załadowany - ignoruje
```

**Obsługiwane fonty:**
- Roboto Slab (domyślny)
- Roboto, Open Sans, Lato, Montserrat
- Poppins, Inter, Nunito
- Playfair Display, Merriweather
- Oswald, Raleway, Ubuntu
- Rubik, Work Sans, Quicksand
- Barlow, Josefin Sans, Cormorant Garamond
- Archivo, Karla

---

## Szablony

### Struktura szablonu JSON

```json
{
  "id": "unique-template-id",
  "name": "Nazwa polska",
  "nameEn": "English Name",
  "category": "offer|product|event|blank",
  "config": {
    "format": "landscape|square|portrait|story",
    "background": { "color": "#HEXCOLOR" },
    "logo": LogoConfig | null,
    "packshot": PackshotConfig | null,
    "text": TextConfig | null,
    "subtext": SubtextConfig | null,
    "cta": CTAConfig | null
  }
}
```

### Wbudowane szablony

1. **blank-landscape** - Pusty szablon poziomy
2. **blank-square** - Pusty szablon kwadratowy
3. **promo-red** - Czerwony promocyjny z 50% zniżką
4. **product-hero** - Produkt z kolekcją
5. **elegant-dark** - Elegancki ciemny z premium quality

### Import/Eksport szablonów

- **Eksport:** Konwertuje Template na JSON i pobiera jako plik .json
- **Import:** Czyta plik JSON, waliduje strukturę, zapisuje do LocalStorage

---

## Internacjonalizacja

### Pliki tłumaczeń

**`src/i18n/en.json`** - Angielski
**`src/i18n/pl.json`** - Polski

### Struktura kluczy

```json
{
  "app": { ... },           // Aplikacja
  "templates": { ... },    // Szablony
  "format": { ... },       // Formaty
  "background": { ... },   // Tło
  "logo": { ... },         // Logo
  "packshot": { ... },     // Packshot
  "text": { ... },         // Tekst główny
  "subtext": { ... },      // Tekst dodatkowy
  "cta": { ... },          // Przycisk CTA
  "projects": { ... },     // Projekty
  "export": { ... },       // Eksport
  "confirm": { ... }       // Potwierdzenia
}
```

### Przełączanie języka

Język zapisywany jest w `localStorage.getItem('language')`.
Domyślny język: `pl`

---

## Konfiguracja

### Formaty reklam (`src/constants/formats.ts`)

```typescript
export const FORMATS: Record<FormatType, {
  width: number;      // Szerokość w pikselach
  height: number;     // Wysokość w pikselach
  label: string;      // Etykieta polska
  labelEn: string;    // Etykieta angielska
}>
```

### Tailwind (`tailwind.config.js`)

Zdefiniowana paleta szarości:
- gray-100: #f8f9fc
- gray-200: #f1f3f9
- gray-300: #dee3ed
- gray-400: #c2c9d6
- gray-500: #8f96a3
- gray-600: #5e636e
- gray-700: #2f3237
- gray-800: #1d1e20
- gray-900: #111213

### Vite (`vite.config.ts`)

- Plugin: `@vitejs/plugin-react`
- Brak dodatkowej konfiguracji

### TypeScript (`tsconfig.app.json`)

- Target: ES2023
- JSX: react-jsx
- Strict mode: włączony
- verbatimModuleSyntax: włączony (wymaga `import type`)

---

## Cykl życia komponentu Canvas

```
1. Mount -> loadFontsInConfig() -> loadFont() dla każdego fontu w config
2. Mount -> calculateScale() -> oblicza skalę podglądu
3. logoData change -> tworzy HTMLImageElement, ustawia logoImg
4. packshotData change -> tworzy HTMLImageElement, ustawia packshotImg
5. fontsLoaded OR draw deps change -> draw()
6. Resize -> recalculateScale() -> redraw()
```

## Algorytm rysowania

### Logo
```javascript
const x = width/2 + (positionX/100) * (width/2);
const y = (positionY/100) * height;
// Pozycja X: 0 = lewa krawędź, 50 = środek, 100 = prawa krawędź
// Pozycja Y: 0 = góra, 100 = dół
```

### Packshot
```javascript
const x = width/2 + (positionX/100) * (width/2);
const y = (positionY/100) * height - imgHeight/2;
// positionX jako przesunięcie od środka (-50 do 50)
// positionY jako centrum pionowe
```

### Tekst (główny i dodatkowy)
```javascript
const x = (positionX/100) * width;
const y = (positionY/100) * height;
// Centrowanie wertykalne: startY = y - (lines.length * lineHeight) / 2
```

### CTA Button
```javascript
if (position === 'center') {
  x = width/2 - btnWidth/2;
  y = height * 0.75;
} else { // bottom-right
  x = width - btnWidth - 40;
  y = height - btnHeight - 40;
}
```

---

## LocalStorage Keys

| Klucz | Opis | Format |
|-------|------|--------|
| `pmax_projects` | Zapisane projekty | JSON array |
| `custom_templates` | Importowane szablony | JSON array |
| `language` | Aktualny język | `'pl'` \| `'en'` |

---

## Zależności produkcyjne

| Pakiet | Wersja | Opis |
|--------|--------|------|
| react | ^19.2.4 | Biblioteka React |
| react-dom | ^19.2.4 | React DOM |
| i18next | ^26.0.1 | Internacjonalizacja |
| react-i18next | ^17.0.1 | React bindings dla i18next |
| @heroicons/react | ^2.2.0 | Ikony Heroicons |
| fabric | ^5.3.0 | (zainstalowany, nie używany) |

---

## Budowanie i uruchamianie

```bash
# Development
npm run dev

# Production build
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

---

*Ostatnia aktualizacja dokumentacji: v2*
