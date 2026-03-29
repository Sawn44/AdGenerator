import { useCallback, useRef } from 'react';

import type { FormatType } from '../types/template';

export function useExport(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const formatRef = useRef<FormatType>('landscape');

  const setFormat = useCallback((format: FormatType) => {
    formatRef.current = format;
  }, []);

  const exportJpg = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const format = formatRef.current;
    const filename = `pmax-ad-${format}-${Date.now()}.jpg`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/jpeg', 0.92);
    link.click();
  }, [canvasRef]);

  return { exportJpg, setFormat };
}
