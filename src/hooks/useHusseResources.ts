import { useState, useCallback } from 'react';

export interface HusseResource {
  name: string;
  url: string;
  type: 'logo' | 'packshot';
}

const HUSSE_DIRECTORIES = [
  { url: 'https://adgen.dagere.pl/husse/', defaultType: 'packshot' as const },
  { url: 'https://adgen.dagere.pl/husse/TRANSPARENT/', defaultType: 'packshot' as const },
];

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];

function isImageFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  return IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext));
}

function getResourceType(filename: string): 'logo' | 'packshot' {
  const lower = filename.toLowerCase();
  if (lower.includes('logo') || lower.includes('brand')) {
    return 'logo';
  }
  return 'packshot';
}

export function useHusseResources() {
  const [resources, setResources] = useState<HusseResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allFiles: HusseResource[] = [];
      
      for (const dir of HUSSE_DIRECTORIES) {
        const response = await fetch(dir.url);
        const text = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = doc.querySelectorAll('a');
        
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && !href.startsWith('?') && href !== '/') {
            const filename = decodeURIComponent(href.replace(/\/$/, ''));
            if (isImageFile(filename)) {
              allFiles.push({
                name: filename,
                url: dir.url + encodeURIComponent(filename),
                type: getResourceType(filename),
              });
            }
          }
        });
      }
      
      setResources(allFiles);
    } catch (err) {
      setError('Nie udało się pobrać zasobów');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getLogos = useCallback(() => {
    return resources.filter(r => r.type === 'logo');
  }, [resources]);

  const getPackshots = useCallback(() => {
    return resources.filter(r => r.type === 'packshot');
  }, [resources]);

  return {
    resources,
    loading,
    error,
    fetchResources,
    getLogos,
    getPackshots,
  };
}
