
import React, { useEffect, useRef } from 'react';

interface BackgroundEffectsProps {
  effect: 'none' | 'rain' | 'snow' | 'night' | 'stars';
}

const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ effect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Rain effect
  useEffect(() => {
    if (effect !== 'rain' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const drops: { x: number; y: number; speed: number; length: number }[] = [];
    const dropCount = Math.floor(canvas.width / 5); // Number of raindrops
    
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 5 + Math.random() * 10,
        length: 10 + Math.random() * 20
      });
    }
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();
        
        drop.y += drop.speed;
        
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      }
      
      animationId = requestAnimationFrame(render);
    };
    
    let animationId = requestAnimationFrame(render);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [effect]);
  
  // Snow effect
  useEffect(() => {
    if (effect !== 'snow' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const snowflakes: { x: number; y: number; size: number; speed: number }[] = [];
    const snowflakeCount = Math.floor(canvas.width / 10); // Number of snowflakes
    
    for (let i = 0; i < snowflakeCount; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1 + Math.random() * 4,
        speed: 1 + Math.random() * 3
      });
    }
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      
      for (let i = 0; i < snowflakes.length; i++) {
        const flake = snowflakes[i];
        
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fill();
        
        flake.y += flake.speed;
        flake.x += Math.sin(flake.y / 30) * 0.5;
        
        if (flake.y > canvas.height) {
          flake.y = -5;
          flake.x = Math.random() * canvas.width;
        }
      }
      
      animationId = requestAnimationFrame(render);
    };
    
    let animationId = requestAnimationFrame(render);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [effect]);
  
  // Night effect
  useEffect(() => {
    if (effect !== 'night' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create a dark blue gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(8, 15, 40, 0.7)');
    gradient.addColorStop(1, 'rgba(5, 10, 20, 0.7)');
    
    const render = () => {
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      animationId = requestAnimationFrame(render);
    };
    
    let animationId = requestAnimationFrame(render);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [effect]);
  
  // Stars effect
  useEffect(() => {
    if (effect !== 'stars' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];
    const starCount = Math.floor(canvas.width / 4); // Number of stars
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.9,
        speed: 0.001 + Math.random() * 0.01
      });
    }
    
    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity + Math.sin(time * star.speed) * 0.5})`;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      time += 0.1;
      animationId = requestAnimationFrame(render);
    };
    
    let animationId = requestAnimationFrame(render);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [effect]);
  
  if (effect === 'none') return null;
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
    />
  );
};

export default BackgroundEffects;
