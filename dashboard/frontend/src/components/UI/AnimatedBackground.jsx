import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const AnimatedBackground = ({ 
  intensity = 'medium', // 'low', 'medium', 'high'
  speed = 'normal', // 'slow', 'normal', 'fast'
  particleCount = null // auto-calculated if null
}) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const { theme } = useTheme();

  // Calculate particle count based on intensity
  const getParticleCount = () => {
    if (particleCount) return particleCount;
    switch (intensity) {
      case 'low': return 30;
      case 'medium': return 50;
      case 'high': return 80;
      default: return 50;
    }
  };

  // Get speed multiplier
  const getSpeedMultiplier = () => {
    switch (speed) {
      case 'slow': return 0.5;
      case 'normal': return 1;
      case 'fast': return 1.5;
      default: return 1;
    }
  };

  // Get colors based on theme
  const getColors = () => {
    if (theme === 'dark') {
      return {
        primary: { r: 147, g: 51, b: 234 }, // purple-600
        secondary: { r: 219, g: 39, b: 119 }, // pink-600
        tertiary: { r: 99, g: 102, b: 241 }, // indigo-600
        glow: { r: 168, g: 85, b: 247 } // purple-400
      };
    } else {
      return {
        primary: { r: 147, g: 51, b: 234 }, // purple-600
        secondary: { r: 219, g: 39, b: 119 }, // pink-600
        tertiary: { r: 99, g: 102, b: 241 }, // indigo-600
        glow: { r: 192, g: 132, b: 252 } // purple-300
      };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const colors = getColors();
    const count = getParticleCount();
    const speedMultiplier = getSpeedMultiplier();

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (theme === 'dark' ? 100 : 80) + 40;
        this.speedX = (Math.random() - 0.5) * 0.5 * speedMultiplier;
        this.speedY = (Math.random() - 0.5) * 0.5 * speedMultiplier;
        this.colorIndex = Math.floor(Math.random() * 3);
        this.opacity = Math.random() * 0.3 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulsePhase += this.pulseSpeed;

        // Wrap around edges
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;

        // Pulsing opacity
        const pulse = Math.sin(this.pulsePhase) * 0.1;
        this.currentOpacity = this.opacity + pulse;
      }

      draw() {
        const colorKeys = ['primary', 'secondary', 'tertiary'];
        const color = colors[colorKeys[this.colorIndex]];

        // Create gradient
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );

        const centerOpacity = theme === 'dark' ? 0.15 : 0.1;
        const edgeOpacity = 0;

        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${centerOpacity * this.currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${centerOpacity * 0.5 * this.currentOpacity})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, ${edgeOpacity})`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => new Particle());

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections between nearby particles
      if (theme === 'dark') {
        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const dx = particlesRef.current[i].x - particlesRef.current[j].x;
            const dy = particlesRef.current[i].y - particlesRef.current[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              const opacity = (1 - distance / 150) * 0.1;
              ctx.strokeStyle = `rgba(${colors.glow.r}, ${colors.glow.g}, ${colors.glow.b}, ${opacity})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
              ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme, intensity, speed, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        opacity: theme === 'dark' ? 0.6 : 0.4,
        transition: 'opacity 0.5s ease-in-out'
      }}
    />
  );
};

export default AnimatedBackground;

