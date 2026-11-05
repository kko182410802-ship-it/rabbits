import React, { useEffect, useRef } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  size: number;
  color: string;
  shape: 'circle' | 'rect' | 'star' | 'heart';
  opacity: number;
}

const PASTEL_CONFETTI_COLORS = [
  '#FFB6C1', // Light pink
  '#BAE6FD', // Light sky
  '#FED7AA', // Peach
  '#FDE047', // Yellow
  '#A7F3D0', // Mint
  '#E9D5FF', // Lavender
  '#F472B6', // Rose
  '#38BDF8', // Cyan
  '#FBBF24', // Amber gold
  '#C084FC', // Violet
];

export const ConfettiCanvas: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const pieces: ConfettiPiece[] = [];
    const shapes: ConfettiPiece['shape'][] = ['circle', 'rect', 'star', 'heart'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: Math.random() * width,
        y: Math.random() * height - height * 0.4,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 1.8 + Math.random() * 2.8,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 4,
        size: 8 + Math.random() * 12,
        color: PASTEL_CONFETTI_COLORS[Math.floor(Math.random() * PASTEL_CONFETTI_COLORS.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 0.85 + Math.random() * 0.15,
      });
    }

    const drawStar = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      for (let i = 0; i < 5; i++) {
        c.lineTo(
          Math.cos(((18 + i * 72) * Math.PI) / 180) * size,
          -Math.sin(((18 + i * 72) * Math.PI) / 180) * size
        );
        c.lineTo(
          Math.cos(((54 + i * 72) * Math.PI) / 180) * (size / 2),
          -Math.sin(((54 + i * 72) * Math.PI) / 180) * (size / 2)
        );
      }
      c.closePath();
      c.fill();
    };

    const drawHeart = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 2, 0, size);
      // bottom right curve
      c.bezierCurveTo(0, (size + topCurveHeight) / 2, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      pieces.forEach((p) => {
        p.x += p.vx + Math.sin(p.y * 0.015) * 0.8;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(ctx, p.size / 1.5);
        } else if (p.shape === 'heart') {
          drawHeart(ctx, p.size / 1.8);
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40 w-full h-full"
    />
  );
};
