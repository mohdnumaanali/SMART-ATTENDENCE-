import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

interface CaptchaCanvasProps {
  onCaptchaGenerated?: (code: string) => void;
  captchaCode: string;
  setCaptchaCode: (code: string) => void;
}

export const CaptchaCanvas: React.FC<CaptchaCanvasProps> = ({
  onCaptchaGenerated,
  captchaCode,
  setCaptchaCode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentText, setCurrentText] = useState('');
  const onGeneratedRef = useRef(onCaptchaGenerated);

  // Keep ref up to date without triggering effects
  useEffect(() => {
    onGeneratedRef.current = onCaptchaGenerated;
  }, [onCaptchaGenerated]);

  const generateCaptcha = useCallback(() => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Avoid confusing 0/O, 1/I
    let text = '';
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCurrentText(text);
    if (onGeneratedRef.current) {
      onGeneratedRef.current(text);
    }
  }, []);

  // Generate strictly ONCE on mount
  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  // Draw on canvas whenever currentText changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentText) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#f1f5f9');
    bgGradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Random noise lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 100 + 50)}, ${Math.floor(
        Math.random() * 100 + 50
      )}, ${Math.floor(Math.random() * 150 + 80)}, 0.45)`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height
      );
      ctx.stroke();
    }

    // Random noise dots
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(
        Math.random() * 150
      )}, ${Math.floor(Math.random() * 150)}, 0.35)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render distorted characters
    const charList = currentText.split('');
    const charWidth = width / (charList.length + 1);

    charList.forEach((char, index) => {
      ctx.save();
      const x = (index + 0.8) * charWidth;
      const y = height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() * 20 - 10) * (Math.PI / 180);

      ctx.translate(x, y);
      ctx.rotate(angle);

      // Color variation in SRU navy/slate range
      const colors = ['#1A3B70', '#0F2C59', '#1e293b', '#0369a1', '#1e3a8a'];
      ctx.fillStyle = colors[index % colors.length];
      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
      ctx.shadowBlur = 1.5;
      ctx.fillText(char, 0, 0);

      ctx.restore();
    });
  }, [currentText]);

  const handleRefreshClick = () => {
    setCaptchaCode('');
    generateCaptcha();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative border border-slate-300 rounded overflow-hidden shadow-inner bg-slate-100">
        <canvas
          ref={canvasRef}
          width={150}
          height={40}
          className="block cursor-pointer select-none"
          title="Click to refresh CAPTCHA"
          onClick={handleRefreshClick}
        />
      </div>
      <button
        type="button"
        onClick={handleRefreshClick}
        className="p-2 text-slate-500 hover:text-[#1A3B70] hover:bg-slate-100 rounded border border-slate-200 transition-colors"
        title="Refresh CAPTCHA"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <input
        type="text"
        value={captchaCode}
        onChange={(e) => setCaptchaCode(e.target.value.toUpperCase())}
        placeholder="Enter Code"
        maxLength={5}
        className="w-28 px-2.5 py-1.5 text-sm tracking-widest font-mono font-bold uppercase text-center border border-slate-300 rounded focus:ring-2 focus:ring-[#1A3B70] focus:border-[#1A3B70] outline-none bg-white"
        required
      />
    </div>
  );
};
