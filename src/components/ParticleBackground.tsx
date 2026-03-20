import React, { useEffect, useRef } from 'react';

interface Particle { x:number;y:number;vx:number;vy:number;r:number;alpha:number;color:string; }

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W=0,H=0, raf=0, mouseX=-9999, mouseY=-9999;
    const COLORS = ['0,245,255','155,89,255','255,45,120'];
    const resize = () => { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; };
    resize();
    const onMouse = (e:MouseEvent) => { mouseX=e.clientX; mouseY=e.clientY; };
    window.addEventListener('resize',resize);
    window.addEventListener('mousemove',onMouse);
    const makeP = ():Particle => ({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35,
      r:Math.random()*1.4+.3, alpha:Math.random()*.45+.1,
      color:COLORS[Math.floor(Math.random()*COLORS.length)],
    });
    const particles:Particle[] = Array.from({length:130},makeP);
    const loop = () => {
      ctx.clearRect(0,0,W,H);
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if(d<110){ ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle=`rgba(0,245,255,${.07*(1-d/110)})`;ctx.lineWidth=.5;ctx.stroke(); }
        }
      }
      particles.forEach(p => {
        const dx=p.x-mouseX, dy=p.y-mouseY, d=Math.sqrt(dx*dx+dy*dy);
        if(d<140){ ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(mouseX,mouseY);ctx.strokeStyle=`rgba(0,245,255,${.18*(1-d/140)})`;ctx.lineWidth=.8;ctx.stroke(); }
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(${p.color},${p.alpha})`;ctx.fill();
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W||p.y<0||p.y>H){ Object.assign(p,makeP()); }
      });
      raf=requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('resize',resize); window.removeEventListener('mousemove',onMouse); cancelAnimationFrame(raf); };
  },[]);
  return <canvas ref={canvasRef} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',opacity:.9}} />;
};

export default ParticleBackground;
