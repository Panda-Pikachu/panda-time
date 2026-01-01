import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useClockStore } from '@/stores/clockStore';

export const ParticleBackground = () => {
  const { settings } = useClockStore();

  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10,
      size: 2 + Math.random() * 4,
    }));
  }, []);

  if (!settings.showParticles) return null;

  return (
    <div className="bg-particles">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ y: '100vh', opacity: 0, scale: 0 }}
          animate={{
            y: '-100vh',
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};
