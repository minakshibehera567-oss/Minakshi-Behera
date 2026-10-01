import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface PixieDustHandle {
  burst: (
    x: number,
    y: number,
    count?: number,
    theme?: 'elsa' | 'anna' | 'moana' | 'olaf'
  ) => void;
  floatNote: (x: number, y: number, symbol?: string) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  alpha: number;
  decay: number;
  shape: 'snowflake' | 'flower' | 'heart' | 'star' | 'circle' | 'note';
  symbol?: string;
}

export const PixieDustCanvas = forwardRef<PixieDustHandle, { className?: string }>(
  ({ className = '' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    useEffect(() => {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const render = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.06;
          p.vx *= 0.98;
          p.rotation += p.vRot;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, p.alpha);

          if (p.shape === 'snowflake') {
            // Elsa's 6-pointed hexagonal crystal snowflake
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.5;
            for (let arm = 0; arm < 6; arm++) {
              ctx.rotate(Math.PI / 3);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(0, p.size);
              // Small side branches
              ctx.moveTo(0, p.size * 0.5);
              ctx.lineTo(-p.size * 0.25, p.size * 0.75);
              ctx.moveTo(0, p.size * 0.5);
              ctx.lineTo(p.size * 0.25, p.size * 0.75);
              ctx.stroke();
            }
          } else if (p.shape === 'flower') {
            // Moana's 5-petal tropical plumeria flower
            ctx.fillStyle = p.color;
            const petals = 5;
            for (let pet = 0; pet < petals; pet++) {
              ctx.rotate((Math.PI * 2) / petals);
              ctx.beginPath();
              ctx.ellipse(0, p.size * 0.6, p.size * 0.4, p.size * 0.7, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            // Flower center
            ctx.fillStyle = '#FDE047';
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'heart') {
            // Anna's sister love heart
            ctx.fillStyle = p.color;
            ctx.beginPath();
            const topCurveHeight = p.size * 0.3;
            ctx.moveTo(0, topCurveHeight);
            ctx.bezierCurveTo(
              0,
              0,
              -p.size * 0.7,
              0,
              -p.size * 0.7,
              topCurveHeight
            );
            ctx.bezierCurveTo(
              -p.size * 0.7,
              (p.size + topCurveHeight) / 2,
              0,
              (p.size + topCurveHeight) / 1.4,
              0,
              p.size
            );
            ctx.bezierCurveTo(
              0,
              (p.size + topCurveHeight) / 1.4,
              p.size * 0.7,
              (p.size + topCurveHeight) / 2,
              p.size * 0.7,
              topCurveHeight
            );
            ctx.bezierCurveTo(
              p.size * 0.7,
              0,
              0,
              0,
              0,
              topCurveHeight
            );
            ctx.closePath();
            ctx.fill();
          } else if (p.shape === 'star') {
            // 4-pointed magical star
            ctx.fillStyle = p.color;
            ctx.beginPath();
            const spikes = 4;
            const outerR = p.size;
            const innerR = p.size * 0.35;
            let rot = (Math.PI / 2) * 3;
            const step = Math.PI / spikes;

            ctx.moveTo(0, -outerR);
            for (let j = 0; j < spikes; j++) {
              ctx.lineTo(Math.cos(rot) * outerR, Math.sin(rot) * outerR);
              rot += step;
              ctx.lineTo(Math.cos(rot) * innerR, Math.sin(rot) * innerR);
              rot += step;
            }
            ctx.lineTo(0, -outerR);
            ctx.closePath();
            ctx.fill();
          } else if (p.shape === 'note') {
            ctx.fillStyle = p.color;
            ctx.font = `${p.size * 1.8}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.symbol || '♪', 0, 0);
          } else {
            // Shiny bubble / snowball
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        animationFrameRef.current = requestAnimationFrame(render);
      };

      animationFrameRef.current = requestAnimationFrame(render);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, []);

    useImperativeHandle(ref, () => ({
      burst: (x: number, y: number, count = 24, theme = 'elsa') => {
        let colors = ['#38BDF8', '#BAE6FD', '#FFFFFF', '#C084FC'];
        let shape: Particle['shape'] = 'snowflake';

        if (theme === 'moana') {
          colors = ['#10B981', '#06B6D4', '#F43F5E', '#FDE047', '#FFFFFF'];
          shape = 'flower';
        } else if (theme === 'anna') {
          colors = ['#F43F5E', '#FB7185', '#F59E0B', '#34D399', '#FFFFFF'];
          shape = 'heart';
        } else if (theme === 'olaf') {
          colors = ['#38BDF8', '#F59E0B', '#FFFFFF', '#FED7AA'];
          shape = 'circle';
        }

        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
          const speed = 2.5 + Math.random() * 5.5;
          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            size: 5 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.2,
            alpha: 1,
            decay: 0.015 + Math.random() * 0.02,
            shape: Math.random() > 0.4 ? shape : 'star',
          });
        }
      },
      floatNote: (x: number, y: number, symbol = '♫') => {
        const colors = ['#38BDF8', '#10B981', '#F43F5E', '#FBBF24'];
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -2.5 - Math.random() * 1.5,
          size: 8 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: (Math.random() - 0.5) * 0.4,
          vRot: (Math.random() - 0.5) * 0.05,
          alpha: 1,
          decay: 0.02,
          shape: 'note',
          symbol,
        });
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className={`pointer-events-none fixed inset-0 z-50 ${className}`}
      />
    );
  }
);

PixieDustCanvas.displayName = 'PixieDustCanvas';
