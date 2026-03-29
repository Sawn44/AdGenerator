import { useEffect, useRef, useCallback, useState } from 'react';
import { FORMATS } from '../../constants/formats';
import type { TemplateConfig, FormatType } from '../../types/template';
import { loadFont } from '../../utils/fonts';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CanvasEditorProps {
  config: TemplateConfig;
  logoData: string | null;
  packshotData: string | null;
  format: FormatType;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  config,
  logoData,
  packshotData,
  format,
  canvasRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayScale, setDisplayScale] = useState(0.5);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [packshotImg, setPackshotImg] = useState<HTMLImageElement | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const { width, height } = FORMATS[format];

  useEffect(() => {
    const loadFontsInConfig = async () => {
      const fonts = new Set<string>();
      if (config.text?.fontFamily) {
        fonts.add(config.text.fontFamily);
      }
      if (config.subtext?.fontFamily) {
        fonts.add(config.subtext.fontFamily);
      }
      await Promise.all([...fonts].map(loadFont));
      setFontsLoaded(true);
    };
    loadFontsInConfig();
  }, [config.text?.fontFamily, config.subtext?.fontFamily]);

  useEffect(() => {
    const loadLogo = async () => {
      if (logoData) {
        const img = new Image();
        img.onload = () => setLogoImg(img);
        img.src = logoData;
      } else if (config.logo?.logoData) {
        const img = new Image();
        img.onload = () => setLogoImg(img);
        img.src = config.logo.logoData;
      } else if (config.logo?.logoUrl) {
        try {
          const response = await fetch(config.logo.logoUrl);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => {
            setLogoImg(img);
            URL.revokeObjectURL(url);
          };
          img.src = url;
        } catch (err) {
          console.error('Failed to load logo from URL:', err);
          setLogoImg(null);
        }
      } else {
        setLogoImg(null);
      }
    };
    loadLogo();
  }, [logoData, config.logo?.logoUrl, config.logo?.logoData]);

  useEffect(() => {
    const loadPackshot = async () => {
      if (packshotData) {
        const img = new Image();
        img.onload = () => setPackshotImg(img);
        img.src = packshotData;
      } else if (config.packshot?.packshotData) {
        const img = new Image();
        img.onload = () => setPackshotImg(img);
        img.src = config.packshot.packshotData;
      } else if (config.packshot?.packshotUrl) {
        try {
          const response = await fetch(config.packshot.packshotUrl);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => {
            setPackshotImg(img);
            URL.revokeObjectURL(url);
          };
          img.src = url;
        } catch (err) {
          console.error('Failed to load packshot from URL:', err);
          setPackshotImg(null);
        }
      } else {
        setPackshotImg(null);
      }
    };
    loadPackshot();
  }, [packshotData, config.packshot?.packshotUrl, config.packshot?.packshotData]);

  const calculateFitScale = useCallback(() => {
    if (!containerRef.current) return 1;
    const container = containerRef.current;
    const maxWidth = container.clientWidth - 40;
    const maxHeight = container.clientHeight - 40;
    const scaleX = maxWidth / width;
    const scaleY = maxHeight / height;
    return Math.min(scaleX, scaleY, 1);
  }, [width, height]);

  useEffect(() => {
    const fitScale = calculateFitScale();
    setDisplayScale(fitScale);
    const handleResize = () => {
      setDisplayScale(calculateFitScale());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateFitScale]);

  const handleZoomIn = () => {
    setDisplayScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setDisplayScale(prev => Math.max(prev - 0.1, 0.2));
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = config.background.color;
    ctx.fillRect(0, 0, width, height);

    if (config.packshot?.enabled && packshotImg) {
      const { positionX, positionY, scale, opacity } = config.packshot;
      const maxWidth = width * (scale / 100);
      const aspectRatio = packshotImg.height / packshotImg.width;
      const imgHeight = maxWidth * aspectRatio;
      
      const x = (positionX / 100) * width;
      const y = (positionY / 100) * height;
      
      ctx.globalAlpha = opacity / 100;
      ctx.drawImage(packshotImg, x - maxWidth / 2, y - imgHeight / 2, maxWidth, imgHeight);
      ctx.globalAlpha = 1;
    }

    if (config.text?.enabled && config.text.content) {
      const { content, fontFamily, fontSize, color, positionX, positionY, maxWidth: textMaxWidth } = config.text;
      
      ctx.font = `bold ${fontSize}px "${fontFamily}", sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const maxWidthPx = (textMaxWidth / 100) * width;
      const lines = wrapText(ctx, content, maxWidthPx);
      const lineHeight = fontSize * 1.2;
      const startY = (positionY / 100) * height - (lines.length * lineHeight) / 2;
      
      lines.forEach((line, i) => {
        ctx.fillText(line, (positionX / 100) * width, startY + i * lineHeight);
      });
    }

    if (config.subtext?.enabled && config.subtext.content) {
      const { content, fontFamily, fontSize, color, positionX, positionY, maxWidth: textMaxWidth } = config.subtext;
      
      ctx.font = `${fontSize}px "${fontFamily}", sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const maxWidthPx = (textMaxWidth / 100) * width;
      const lines = wrapText(ctx, content, maxWidthPx);
      const lineHeight = fontSize * 1.3;
      const startY = (positionY / 100) * height - (lines.length * lineHeight) / 2;
      
      lines.forEach((line, i) => {
        ctx.fillText(line, (positionX / 100) * width, startY + i * lineHeight);
      });
    }

    if (config.cta?.enabled && config.cta.text) {
      const { text, position, backgroundColor, textColor, borderRadius } = config.cta;
      const btnWidth = Math.min(300, width * 0.3);
      const btnHeight = 60;
      
      let btnX: number, btnY: number;
      if (position === 'center') {
        btnX = width / 2 - btnWidth / 2;
        btnY = height * 0.75;
      } else {
        btnX = width - btnWidth - 40;
        btnY = height - btnHeight - 40;
      }
      
      ctx.fillStyle = backgroundColor;
      roundRect(ctx, btnX, btnY, btnWidth, btnHeight, borderRadius);
      ctx.fill();
      
      ctx.font = `600 24px "Inter", sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, btnX + btnWidth / 2, btnY + btnHeight / 2);
    }

    if (config.logo?.enabled && logoImg) {
      const { positionX, positionY, scale, opacity } = config.logo;
      const logoWidth = width * (scale / 100);
      const aspectRatio = logoImg.height / logoImg.width;
      const logoHeight = logoWidth * aspectRatio;
      
      const x = (positionX / 100) * width;
      const y = (positionY / 100) * height;
      
      ctx.globalAlpha = opacity / 100;
      ctx.drawImage(logoImg, x - logoWidth / 2, y - logoHeight / 2, logoWidth, logoHeight);
      ctx.globalAlpha = 1;
    }
  }, [canvasRef, config, logoImg, packshotImg, width, height]);

  useEffect(() => {
    if (fontsLoaded) {
      draw();
    }
  }, [draw, fontsLoaded]);

  return (
    <div ref={containerRef} className="flex-1 flex flex-col bg-gray-200 p-5 overflow-hidden">
      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-1 bg-white rounded-lg shadow px-2 py-1">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Pomniejsz"
          >
            <MinusIcon className="w-4 h-4 text-gray-700" />
          </button>
          <span className="text-sm text-gray-700 min-w-[50px] text-center">
            {Math.round(displayScale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Powiększ"
          >
            <PlusIcon className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          style={{
            width: width * displayScale,
            height: height * displayScale,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
          className="bg-white"
        />
      </div>
    </div>
  );
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  paragraphs.forEach(paragraph => {
    if (!paragraph.trim()) {
      lines.push('');
      return;
    }
    const words = paragraph.split(' ');
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }
  });

  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
