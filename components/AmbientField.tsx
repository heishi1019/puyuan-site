"use client";

import { useEffect, useRef } from "react";

type AmbientVariant = "source" | "proposal" | "scholar";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
  captureAngle: number | null;
  captureRadius: number;
  captureProgress: number;
  captureDirection: 1 | -1;
  cooldown: number;
  hiddenFrames: number;
  spawnProgress: number;
};

const variantSeeds: Record<AmbientVariant, number> = {
  source: 9137,
  proposal: 24103,
  scholar: 53051,
};

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createParticles(count: number, variant: AmbientVariant): Particle[] {
  const random = seededRandom(variantSeeds[variant]);
  return Array.from({ length: count }, () => ({
    x: random(),
    y: random(),
    vx: (random() - 0.5) * 0.000085,
    vy: (random() - 0.5) * 0.000068,
    radius: 0.8 + random() * 1.2,
    alpha: 0.36 + random() * 0.42,
    phase: random() * Math.PI * 2,
    captureAngle: null,
    captureRadius: 0,
    captureProgress: 0,
    captureDirection: random() > 0.5 ? 1 : -1,
    cooldown: Math.floor(random() * 30),
    hiddenFrames: 0,
    spawnProgress: 1,
  }));
}

export default function AmbientField({ variant }: { variant: AmbientVariant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 639px)");
    let particles = createParticles(compact.matches ? 24 : 58, variant);
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let pointerX = 0;
    let pointerY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let pointerActive = false;

    const releaseParticle = (particle: Particle, cooldown = 180) => {
      if (particle.captureAngle === null) return;
      const departureAngle = particle.captureAngle;
      const departureSpeed = 0.62;
      particle.vx = Math.cos(departureAngle) * departureSpeed / Math.max(width, 1);
      particle.vy = Math.sin(departureAngle) * departureSpeed / Math.max(height, 1);
      particle.captureAngle = null;
      particle.captureProgress = 0;
      particle.cooldown = cooldown;
    };

    const getAttractPoint = (particle: Particle, progress: number) => {
      const eased = 1 - Math.pow(1 - Math.min(progress, 1), 3);
      const bend = Math.sin(progress * Math.PI)
        * (0.12 + Math.sin(particle.phase) * 0.045)
        * particle.captureDirection;
      const angle = (particle.captureAngle ?? 0)
        + bend
        + Math.sin(progress * Math.PI * 2 + particle.phase) * 0.018;
      const radius = particle.captureRadius * (1 - eased);
      return {
        x: mouseX - pointerX + Math.cos(angle) * radius,
        y: mouseY - pointerY + Math.sin(angle) * radius,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const density = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      context.setTransform(density, 0, 0, density, 0, 0);
      particles = createParticles(compact.matches ? 24 : 58, variant);
      if (reducedMotion.matches) render(0);
    };

    const drawBackdrop = (time: number) => {
      context.save();
      context.translate(pointerX, pointerY);
      context.lineWidth = 1;
      const proposalColor = variant === "proposal" ? "29,91,255" : "0,229,160";

      if (variant === "source") {
        const centerX = width * 0.66;
        const centerY = height * 0.5;
        const maxRadius = Math.max(width, height) * 0.7;
        for (let index = 0; index < 4; index += 1) {
          const progress = reducedMotion.matches
            ? (index + 1) / 5
            : ((time * 0.00011 + index * 0.24) % 1);
          context.beginPath();
          context.arc(centerX, centerY, 44 + progress * maxRadius, -0.72, Math.PI * 1.25);
          context.strokeStyle = `rgba(0,229,160,${0.18 * (1 - progress)})`;
          context.stroke();
        }

        const routes = [
          [0.02, 0.2, 0.38, 0.05, 0.78, 0.37],
          [0.04, 0.74, 0.43, 0.9, 0.94, 0.19],
          [0.22, 0.94, 0.5, 0.4, 0.98, 0.68],
          [0.01, 0.53, 0.46, 0.45, 0.84, 0.3],
        ];

        routes.forEach((route, index) => {
          const [startX, startY, controlX, controlY, endX, endY] = route;
          const progress = reducedMotion.matches ? 0.45 + index * 0.08 : ((time * 0.00016 + index * 0.23) % 1);
          const trailProgress = Math.max(0, progress - 0.055);
          const pointAt = (value: number) => {
            const inverse = 1 - value;
            return {
              x: (inverse * inverse * startX + 2 * inverse * value * controlX + value * value * endX) * width,
              y: (inverse * inverse * startY + 2 * inverse * value * controlY + value * value * endY) * height,
            };
          };
          const head = pointAt(progress);
          const tail = pointAt(trailProgress);
          const signalGradient = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
          signalGradient.addColorStop(0, "rgba(0,229,160,0)");
          signalGradient.addColorStop(1, "rgba(0,229,160,0.82)");
          context.beginPath();
          context.moveTo(tail.x, tail.y);
          context.lineTo(head.x, head.y);
          context.lineWidth = 1.5;
          context.strokeStyle = signalGradient;
          context.stroke();
          context.beginPath();
          context.arc(head.x, head.y, 2.7, 0, Math.PI * 2);
          context.fillStyle = "rgba(71,244,201,0.9)";
          context.fill();
        });
      }

      if (variant === "proposal") {
        const lanes = [0.13, 0.34, 0.72, 0.9];
        lanes.forEach((lane, index) => {
          context.beginPath();
          context.moveTo(width * lane, -20);
          context.bezierCurveTo(
            width * (lane + 0.035),
            height * 0.34,
            width * (lane - 0.025),
            height * 0.68,
            width * lane,
            height + 20,
          );
          context.strokeStyle = `rgba(${proposalColor},0.14)`;
          context.stroke();

          const progress = reducedMotion.matches ? (index + 1) / 5 : ((time * 0.00016 + index * 0.19) % 1);
          const y = progress * height;
          const laneGradient = context.createLinearGradient(0, Math.max(0, y - 70), 0, y);
          laneGradient.addColorStop(0, `rgba(${proposalColor},0)`);
          laneGradient.addColorStop(1, `rgba(${proposalColor},0.58)`);
          context.beginPath();
          context.moveTo(width * lane, Math.max(0, y - 70));
          context.lineTo(width * lane, y);
          context.lineWidth = 1.4;
          context.strokeStyle = laneGradient;
          context.stroke();
          context.beginPath();
          context.arc(width * lane, y, 2.8, 0, Math.PI * 2);
          context.fillStyle = `rgba(${proposalColor},${0.68 * (1 - progress * 0.35)})`;
          context.fill();
        });
      }

      if (variant === "scholar") {
        const centerX = width * 0.72;
        const centerY = height * 0.49;
        [0.25, 0.39, 0.56].forEach((scale, index) => {
          context.save();
          context.translate(centerX, centerY);
          context.rotate(-0.18 + index * 0.12);
          context.beginPath();
          context.ellipse(0, 0, width * scale, height * scale * 0.48, 0, 0, Math.PI * 2);
          context.strokeStyle = `rgba(75,136,255,${0.13 + index * 0.022})`;
          context.stroke();
          context.restore();

          const angle = reducedMotion.matches
            ? index * 1.8
            : time * (0.00024 + index * 0.000035) + index * 1.8;
          const x = centerX + Math.cos(angle) * width * scale;
          const y = centerY + Math.sin(angle) * height * scale * 0.48;
          context.beginPath();
          context.arc(x, y, 2, 0, Math.PI * 2);
          context.fillStyle = "rgba(71,244,201,0.76)";
          context.fill();
        });
      }

      context.restore();
    };

    const drawParticles = (time: number) => {
      const linkDistance = compact.matches ? 88 : 132;
      const linkDistanceSquared = linkDistance * linkDistance;
      const color = variant === "scholar" ? "75,136,255" : variant === "proposal" ? "29,91,255" : "0,229,160";

      if (!reducedMotion.matches) {
        let capturedCount = particles.reduce(
          (count, particle) => count + (particle.captureAngle === null ? 0 : 1),
          0,
        );

        particles.forEach((particle) => {
          if (particle.hiddenFrames > 0) {
            particle.hiddenFrames -= 1;
            if (particle.hiddenFrames === 0) particle.spawnProgress = 0;
            return;
          }

          particle.spawnProgress = Math.min(1, particle.spawnProgress + 0.024);

          if (particle.captureAngle !== null) {
            particle.captureProgress += 0.014;
            if (particle.captureProgress >= 1) {
              particle.captureAngle = null;
              particle.captureProgress = 0;
              particle.hiddenFrames = 38;
              particle.cooldown = 170 + Math.round((particle.phase / (Math.PI * 2)) * 50);
              particle.x = (particle.x + 0.43 + particle.phase / (Math.PI * 10)) % 1;
              particle.y = (particle.y + 0.37 + particle.phase / (Math.PI * 12)) % 1;
              particle.spawnProgress = 0;
              capturedCount -= 1;
              return;
            } else if (pointerActive) {
              const attractPoint = getAttractPoint(particle, particle.captureProgress);
              particle.x = attractPoint.x / width;
              particle.y = attractPoint.y / height;
              return;
            } else {
              releaseParticle(particle, 100);
              capturedCount -= 1;
            }
          }

          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.cooldown = Math.max(0, particle.cooldown - 1);
          if (particle.x < -0.04) particle.x = 1.04;
          if (particle.x > 1.04) particle.x = -0.04;
          if (particle.y < -0.04) particle.y = 1.04;
          if (particle.y > 1.04) particle.y = -0.04;

          if (!pointerActive || particle.cooldown > 0 || particle.spawnProgress < 1 || capturedCount >= 9) return;
          const screenX = particle.x * width + pointerX;
          const screenY = particle.y * height + pointerY;
          const dx = screenX - mouseX;
          const dy = screenY - mouseY;
          const distance = Math.hypot(dx, dy);
          if (distance < 10 || distance > 88) return;

          particle.captureAngle = Math.atan2(dy, dx);
          particle.captureRadius = distance;
          particle.captureProgress = 0;
          capturedCount += 1;
        });
      }

      for (let first = 0; first < particles.length; first += 1) {
        const a = particles[first];
        for (let second = first + 1; second < particles.length; second += 1) {
          const b = particles[second];
          if (a.hiddenFrames > 0 || b.hiddenFrames > 0) continue;
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared > linkDistanceSquared) continue;
          const strength = 1 - distanceSquared / linkDistanceSquared;
          context.beginPath();
          context.moveTo(a.x * width + pointerX, a.y * height + pointerY);
          context.lineTo(b.x * width + pointerX, b.y * height + pointerY);
          context.strokeStyle = `rgba(${color},${strength * 0.16})`;
          context.stroke();
        }
      }

      particles.forEach((particle) => {
        if (particle.hiddenFrames > 0) return;
        const pulse = reducedMotion.matches ? 0.86 : 0.8 + Math.sin(time * 0.001 + particle.phase) * 0.18;
        const captured = particle.captureAngle !== null;
        const captureFade = captured ? 1 - particle.captureProgress : 1;
        const particleRadius = captured ? particle.radius * (1.35 + captureFade * 0.35) : particle.radius;
        const particleAlpha = captured
          ? Math.min(1, particle.alpha * pulse * (1.4 + captureFade * 0.9)) * captureFade
          : particle.alpha * pulse * particle.spawnProgress;
        const drawX = particle.x * width + pointerX;
        const drawY = particle.y * height + pointerY;
        if (captured) {
          const trailLength = Math.min(0.2, particle.captureProgress * 0.18 + 0.08);
          const trailOpacity = captureFade * 0.58;
          for (let trail = 3; trail >= 1; trail -= 1) {
            const trailStart = Math.max(0, particle.captureProgress - trailLength * (trail / 3));
            context.beginPath();
            for (let step = 0; step <= 9; step += 1) {
              const progress = trailStart
                + (particle.captureProgress - trailStart) * (step / 9);
              const point = getAttractPoint(particle, progress);
              if (step === 0) context.moveTo(point.x, point.y);
              else context.lineTo(point.x, point.y);
            }
            context.lineWidth = particleRadius * (0.8 + trail * 0.22);
            context.lineCap = "round";
            context.strokeStyle = `rgba(${color},${trailOpacity * (0.42 + (3 - trail) * 0.2)})`;
            context.stroke();
          }
          const glow = context.createRadialGradient(drawX, drawY, 0, drawX, drawY, particleRadius * 5.5);
          glow.addColorStop(0, `rgba(${color},${0.32 * captureFade})`);
          glow.addColorStop(1, `rgba(${color},0)`);
          context.beginPath();
          context.arc(drawX, drawY, particleRadius * 5.5, 0, Math.PI * 2);
          context.fillStyle = glow;
          context.fill();
        }
        context.beginPath();
        context.arc(
          drawX,
          drawY,
          particleRadius,
          0,
          Math.PI * 2,
        );
        context.fillStyle = `rgba(${color},${particleAlpha})`;
        context.fill();
      });
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);
      drawBackdrop(time);
      drawParticles(time);
    };

    const animate = (time: number) => {
      if (visible) render(time);
      frame = window.requestAnimationFrame(animate);
    };

    const handlePointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 7;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 5;
      const rect = canvas.getBoundingClientRect();
      pointerActive = event.clientX >= rect.left
        && event.clientX <= rect.right
        && event.clientY >= rect.top
        && event.clientY <= rect.bottom;
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.02 });
    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);
    observer.observe(canvas);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    resize();
    render(0);
    if (!reducedMotion.matches) frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointer);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, [variant]);

  return <canvas ref={canvasRef} className={`ambient-field ambient-field--${variant}`} aria-hidden="true" />;
}
