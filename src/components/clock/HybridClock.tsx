import { motion } from 'framer-motion';
import { useClockStore } from '@/stores/clockStore';
import { useTime, formatTime } from '@/hooks/useTime';

export const HybridClock = () => {
  const { settings } = useClockStore();
  const time = useTime(settings.smoothSeconds);
  
  const { time: displayTime, period } = formatTime(
    time.hours,
    time.minutes,
    time.seconds,
    settings.timeFormat,
    settings.showSeconds
  );

  const secondsDegrees = settings.smoothSeconds
    ? (time.seconds + time.milliseconds / 1000) * 6
    : time.seconds * 6;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4"
    >
      {/* Analog ring with digital center */}
      <div className="relative w-[50vw] max-w-[350px] aspect-square">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full glass-panel border-2 border-primary/20" />
        
        {/* Progress ring for seconds */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="hsl(var(--primary) / 0.2)"
            strokeWidth="2"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 48} ${2 * Math.PI * 48}`}
            animate={{
              strokeDashoffset: 2 * Math.PI * 48 * (1 - secondsDegrees / 360),
            }}
            transition={settings.smoothSeconds 
              ? { type: 'tween', ease: 'linear', duration: 0.1 }
              : { type: 'spring', stiffness: 100, damping: 20 }
            }
            style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary)))' }}
          />
        </svg>

        {/* Second indicator dot */}
        <motion.div
          className="absolute w-3 h-3 bg-primary rounded-full shadow-glow"
          style={{
            top: '50%',
            left: '50%',
            transformOrigin: 'center center',
          }}
          animate={{
            x: `calc(${Math.sin(secondsDegrees * Math.PI / 180) * 42}% - 50%)`,
            y: `calc(${-Math.cos(secondsDegrees * Math.PI / 180) * 42}% - 50%)`,
          }}
          transition={settings.smoothSeconds 
            ? { type: 'tween', ease: 'linear', duration: 0.1 }
            : { type: 'spring', stiffness: 300, damping: 30 }
          }
        />

        {/* Digital time in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div 
            className="font-clock text-[8vw] max-text-[70px] font-bold text-foreground tracking-tight"
            key={displayTime}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
          >
            {displayTime.split(':').slice(0, 2).join(':')}
          </motion.div>
          
          {settings.showSeconds && (
            <motion.div 
              className="font-clock text-[4vw] max-text-[35px] text-primary font-semibold"
            >
              {time.seconds.toString().padStart(2, '0')}
            </motion.div>
          )}
          
          {period && (
            <span className="text-sm md:text-base text-muted-foreground font-medium mt-1">
              {period}
            </span>
          )}
        </div>
      </div>

      {settings.showDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground font-medium"
        >
          {time.dayOfWeek}, {time.month} {time.dayOfMonth}
        </motion.div>
      )}
    </motion.div>
  );
};
