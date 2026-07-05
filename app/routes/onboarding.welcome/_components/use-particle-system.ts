import { useRef, useEffect, useCallback } from "react";

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number | null;
  targetY: number | null;
  size: number;
  opacity: number;
  color: string;
  originalColor: string;
  phase: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  isOrbiting: boolean;
  isInShape: boolean;
  treeIndex: number;
  settled: boolean;
  dissolveOriginDistance: number;
  dissolveOriginAngle: number;
  dissolveDelay: number;
  dissolveStartSize: number;
  dissolveStartOpacity: number;
}

export type ParticleMode =
  | "chaos"
  | "slowing"
  | "orbiting"
  | "forming-number"
  | "final-circle"
  | "dissolving";

interface ParticleSystemProps {
  mode: ParticleMode;
  screenIndex: number;
}

const PARTICLE_COUNT = 50;

const COLORS = {
  light: [
    "hsl(120 12% 81%)",
    "hsl(120 18% 75%)",
    "hsl(120 20% 85%)",
    "hsl(120 10% 69%)",
    "hsl(120 19% 90%)",
  ],
  cream: [
    "hsl(83 39% 94%)",
    "hsl(96 34% 91%)",
    "hsl(90 44% 96%)",
    "hsl(96 27% 87%)",
  ],
};

const BG_COLOR = "hsl(150 45% 9%)";

const NUMBER_21_SHAPE: Array<{ x: number; y: number }> = [];

const generate2 = () => {
  const points: Array<{ x: number; y: number }> = [];
  const offsetX = 0.42;
  const offsetY = 0.22;

  for (let i = 0; i < 7; i++) {
    const angle = -Math.PI + (Math.PI * i) / 6;
    points.push({
      x: offsetX + Math.cos(angle) * 0.045,
      y: offsetY - 0.04 + Math.sin(angle) * 0.04,
    });
  }

  for (let i = 0; i < 3; i++) {
    const angle = -Math.PI + (Math.PI * (i + 0.5)) / 4;
    points.push({
      x: offsetX + Math.cos(angle) * 0.03,
      y: offsetY - 0.04 + Math.sin(angle) * 0.028,
    });
  }

  for (let i = 0; i < 4; i++) {
    points.push({
      x: offsetX + 0.04 - i * 0.025,
      y: offsetY + 0.01 + i * 0.028,
    });
  }

  for (let i = 0; i < 5; i++) {
    points.push({
      x: offsetX - 0.05 + i * 0.025,
      y: offsetY + 0.1,
    });
  }

  return points;
};

const generate1 = () => {
  const points: Array<{ x: number; y: number }> = [];
  const offsetX = 0.58;
  const offsetY = 0.22;

  points.push({ x: offsetX - 0.03, y: offsetY - 0.055 });
  points.push({ x: offsetX - 0.018, y: offsetY - 0.068 });
  points.push({ x: offsetX - 0.006, y: offsetY - 0.078 });

  for (let i = 0; i < 8; i++) {
    points.push({
      x: offsetX,
      y: offsetY - 0.08 + i * 0.025,
    });
  }

  points.push({ x: offsetX - 0.04, y: offsetY + 0.1 });
  points.push({ x: offsetX - 0.015, y: offsetY + 0.1 });
  points.push({ x: offsetX + 0.015, y: offsetY + 0.1 });
  points.push({ x: offsetX + 0.04, y: offsetY + 0.1 });

  return points;
};

NUMBER_21_SHAPE.push(...generate2(), ...generate1());

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

export function useParticleSystem({ mode, screenIndex }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const modeRef = useRef<ParticleMode>(mode);
  const dissolveStartRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const colorSet = COLORS.light;
      particles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 300,
        vy: (Math.random() - 0.5) * 300,
        targetX: null,
        targetY: null,
        size: 6 + Math.random() * 6,
        opacity: 0.7 + Math.random() * 0.3,
        color: colorSet[Math.floor(Math.random() * colorSet.length)]!,
        originalColor: colorSet[Math.floor(Math.random() * colorSet.length)]!,
        phase: Math.random() * Math.PI * 2,
        orbitRadius: 180 + Math.random() * 80,
        orbitSpeed: 0.3 + Math.random() * 0.4,
        orbitAngle: Math.random() * Math.PI * 2,
        isOrbiting: false,
        isInShape: false,
        treeIndex: -1,
        settled: false,
        dissolveOriginDistance: 0,
        dissolveOriginAngle: 0,
        dissolveDelay: 0,
        dissolveStartSize: 0,
        dissolveStartOpacity: 0,
      });
    }

    return particles;
  }, []);

  const updateParticleBehavior = useCallback(
    (
      particles: Particle[],
      width: number,
      height: number,
      deltaTime: number,
      currentMode: ParticleMode,
    ) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const dt = Math.min(deltaTime, 0.05);
      const now = Date.now();
      const safeZoneRadius = 160;

      particles.forEach((p, index) => {
        switch (currentMode) {
          case "chaos": {
            if (Math.random() < 0.04) {
              p.vx += (Math.random() - 0.5) * 400;
              p.vy += (Math.random() - 0.5) * 400;
            }
            p.vx *= 0.995;
            p.vy *= 0.995;
            p.vx += Math.sin(now * 0.003 + p.id) * 2;
            p.vy += Math.cos(now * 0.003 + p.id * 1.3) * 2;
            p.x += p.vx * dt * 1.5;
            p.y += p.vy * dt * 1.5;

            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < safeZoneRadius && dist > 0) {
              const pushForce = (safeZoneRadius - dist) * 0.15;
              p.vx += (dx / dist) * pushForce;
              p.vy += (dy / dist) * pushForce;
            }

            if (p.x < 0 || p.x > width) p.vx *= -0.9;
            if (p.y < 0 || p.y > height) p.vy *= -0.9;
            p.x = Math.max(0, Math.min(width, p.x));
            p.y = Math.max(0, Math.min(height, p.y));

            if (Math.random() < 0.01) {
              p.color =
                COLORS.light[Math.floor(Math.random() * COLORS.light.length)]!;
            }
            break;
          }

          case "slowing": {
            p.vx *= 0.97;
            p.vy *= 0.97;
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < safeZoneRadius && dist > 0) {
              p.vx += (dx / dist) * 30 * dt;
              p.vy += (dy / dist) * 30 * dt;
            }
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.x < 0) {
              p.x = 0;
              p.vx *= -0.5;
            }
            if (p.x > width) {
              p.x = width;
              p.vx *= -0.5;
            }
            if (p.y < 0) {
              p.y = 0;
              p.vy *= -0.5;
            }
            if (p.y > height) {
              p.y = height;
              p.vy *= -0.5;
            }
            break;
          }

          case "orbiting": {
            if (!p.isOrbiting) {
              p.isOrbiting = true;
              p.orbitAngle = (index / PARTICLE_COUNT) * Math.PI * 2;
              p.orbitRadius = 180 + (index % 3) * 30;
            }
            p.orbitAngle += p.orbitSpeed * dt * 0.5;
            const targetX = centerX + Math.cos(p.orbitAngle) * p.orbitRadius;
            const targetY = centerY + Math.sin(p.orbitAngle) * p.orbitRadius;
            p.x += (targetX - p.x) * 0.08;
            p.y += (targetY - p.y) * 0.08;
            break;
          }

          case "forming-number": {
            if (index < NUMBER_21_SHAPE.length) {
              const target = NUMBER_21_SHAPE[index]!;
              p.targetX = target.x * width;
              p.targetY = target.y * height;
              p.isInShape = true;
              const dx = p.targetX - p.x;
              const dy = p.targetY - p.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > 2) {
                p.vx = dx * 0.12;
                p.vy = dy * 0.12;
              } else {
                p.vx *= 0.8;
                p.vy *= 0.8;
                p.settled = true;
              }
              p.x += p.vx;
              p.y += p.vy;
              p.color = COLORS.cream[index % COLORS.cream.length]!;
              p.size = 10;
              p.opacity = 1;
            } else {
              p.opacity = 0;
            }
            break;
          }

          case "final-circle": {
            const ringRadius = 148 + (index % 3) * 24;
            const targetAngle =
              (index / PARTICLE_COUNT) * Math.PI * 2 + now * 0.00016;
            const targetX = centerX + Math.cos(targetAngle) * ringRadius;
            const targetY = centerY + Math.sin(targetAngle) * ringRadius;
            p.x += (targetX - p.x) * 0.04;
            p.y += (targetY - p.y) * 0.04;
            p.opacity = 0.46 + Math.sin(now * 0.0018 + index * 0.3) * 0.16;
            p.size = 5.8 + Math.sin(now * 0.001 + index * 0.5) * 0.9;
            break;
          }

          case "dissolving": {
            const elapsed = (now - dissolveStartRef.current) / 1000;
            const ringIndex = index % 3;
            const duration = 1.1 + ringIndex * 0.1;
            const rawProgress = clamp(
              (elapsed - p.dissolveDelay) / duration,
              0,
              1,
            );

            if (rawProgress === 0) {
              p.x =
                centerX +
                Math.cos(p.dissolveOriginAngle) * p.dissolveOriginDistance;
              p.y =
                centerY +
                Math.sin(p.dissolveOriginAngle) * p.dissolveOriginDistance;
              p.size = p.dissolveStartSize;
              p.opacity = p.dissolveStartOpacity;
              p.color = COLORS.cream[index % COLORS.cream.length]!;
              break;
            }

            const progress = easeOutCubic(rawProgress);
            const expansion = p.dissolveOriginDistance * 0.4 * progress;
            const radius = p.dissolveOriginDistance + expansion;
            const fade = Math.pow(1 - rawProgress, 2);
            p.x = centerX + Math.cos(p.dissolveOriginAngle) * radius;
            p.y = centerY + Math.sin(p.dissolveOriginAngle) * radius;
            p.size = Math.max(0, p.dissolveStartSize * fade);
            p.opacity = p.dissolveStartOpacity * fade;
            p.color = COLORS.cream[index % COLORS.cream.length]!;
            break;
          }
        }
      });

      return particles;
    },
    [],
  );

  const render = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);

      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7,
      );
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "hsla(0, 0%, 0%, 0.3)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      if (modeRef.current === "dissolving") {
        const elapsed = (Date.now() - dissolveStartRef.current) / 1000;
        const ringRadii = [148, 172, 196];
        const hazeOpacity = Math.max(0, 1 - elapsed / 0.9) * 0.08;

        if (hazeOpacity > 0.001) {
          const glow = ctx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            Math.max(width, height) * 0.3,
          );
          glow.addColorStop(0, `hsla(83, 39%, 94%, ${hazeOpacity * 0.6})`);
          glow.addColorStop(0.55, `hsla(83, 39%, 94%, ${hazeOpacity * 0.2})`);
          glow.addColorStop(1, "hsla(83, 39%, 94%, 0)");
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, width, height);
        }

        for (let i = 0; i < 3; i++) {
          const ringProgress = clamp((elapsed - i * 0.12) / 0.9, 0, 1);
          const expandedRadius =
            ringRadii[i]! + ringRadii[i]! * 0.35 * easeOutCubic(ringProgress);
          const ringOpacity = Math.pow(1 - ringProgress, 2) * 0.12;

          if (ringProgress > 0 && ringOpacity > 0.001) {
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, expandedRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(96, 27%, 87%, ${ringOpacity})`;
            ctx.lineWidth = 1.3 - i * 0.08;
            ctx.stroke();
          }
        }
      }

      particlesRef.current.forEach((p) => {
        if (p.opacity <= 0 || p.size <= 0) return;

        if (p.size > 6) {
          ctx.beginPath();
          ctx.arc(p.x + 2, p.y + 2, p.size, 0, Math.PI * 2);
          ctx.fillStyle = "hsla(0, 0%, 0%, 0.2)";
          ctx.globalAlpha = p.opacity * 0.3;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
    },
    [],
  );

  const animate = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const deltaTime = lastTimeRef.current
        ? (timestamp - lastTimeRef.current) / 1000
        : 0.016;
      lastTimeRef.current = timestamp;

      particlesRef.current = updateParticleBehavior(
        particlesRef.current,
        canvas.width,
        canvas.height,
        deltaTime,
        modeRef.current,
      );
      render(ctx, canvas.width, canvas.height);
      animationRef.current = requestAnimationFrame(animate);
    },
    [updateParticleBehavior, render],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) {
        particlesRef.current = initParticles(canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, initParticles]);

  useEffect(() => {
    modeRef.current = mode;

    if (mode === "dissolving") {
      dissolveStartRef.current = Date.now();
      const canvas = canvasRef.current;
      if (canvas) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        particlesRef.current.forEach((p, index) => {
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          p.dissolveOriginAngle = Math.atan2(dy, dx);
          p.dissolveOriginDistance = Math.sqrt(dx * dx + dy * dy);
          p.dissolveDelay = (index % 3) * 0.12;
          p.dissolveStartSize = p.size;
          p.dissolveStartOpacity = p.opacity;
        });
      }
    }

    if (mode === "chaos") {
      particlesRef.current.forEach((p) => {
        p.isOrbiting = false;
        p.isInShape = false;
        p.settled = false;
        p.treeIndex = -1;
        p.opacity = 0.6 + Math.random() * 0.4;
      });
    }
  }, [mode]);

  return { canvasRef };
}
