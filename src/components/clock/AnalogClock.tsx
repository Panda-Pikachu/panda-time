import { motion } from 'framer-motion';
import { useTime } from '@/hooks/useTime';
import { useClockStore } from '@/stores/clockStore';

export const AnalogClock = () => {
  const { settings } = useClockStore();
  const time = useTime(settings.smoothSeconds);
  
  const secondsDegrees = settings.smoothSeconds
    ? (time.seconds + time.milliseconds / 1000) * 6
    : time.seconds * 6;
  const minutesDegrees = (time.minutes + time.seconds / 60) * 6;
  const hoursDegrees = ((time.hours % 12) + time.minutes / 60) * 30;

  const hourMarkers = Array.from({ length: 12 }, (_, i) => i * 30);
  const minuteMarkers = Array.from({ length: 60 }, (_, i) => i * 6);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="relative w-[60vw] max-w-[400px] aspect-square">
        {/* Clock face */}
        <div className="absolute inset-0 rounded-full glass-panel border-4 border-border shadow-glow-lg" />
        
        {/* Minute markers */}
        {minuteMarkers.map((deg) => (
          <div
            key={`min-${deg}`}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <div 
              className={`absolute top-2 left-1/2 -translate-x-1/2 rounded-full ${
                deg % 30 === 0 ? 'w-1 h-3 bg-foreground' : 'w-0.5 h-2 bg-muted-foreground/50'
              }`}
            />
          </div>
        ))}

        {/* Hour numbers */}
        {hourMarkers.map((deg, i) => (
          <div
            key={`hour-${deg}`}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <span 
              className="absolute top-6 left-1/2 -translate-x-1/2 text-lg font-clock font-bold text-foreground"
              style={{ transform: `rotate(-${deg}deg)` }}
            >
              {i === 0 ? 12 : i}
            </span>
          </div>
        ))}

        {/* Hour hand */}
        <motion.div
          className="absolute top-1/2 left-1/2 origin-bottom"
          style={{
            width: '6px',
            height: '25%',
            marginLeft: '-3px',
            marginTop: '-25%',
            borderRadius: '4px',
            backgroundColor: 'hsl(var(--foreground))',
          }}
          animate={{ rotate: hoursDegrees }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />

        {/* Minute hand */}
        <motion.div
          className="absolute top-1/2 left-1/2 origin-bottom"
          style={{
            width: '4px',
            height: '35%',
            marginLeft: '-2px',
            marginTop: '-35%',
            borderRadius: '4px',
            backgroundColor: 'hsl(var(--foreground))',
          }}
          animate={{ rotate: minutesDegrees }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />

        {/* Second hand */}
        {settings.showSeconds && (
          <motion.div
            className="absolute top-1/2 left-1/2 origin-bottom"
            style={{
              width: '2px',
              height: '40%',
              marginLeft: '-1px',
              marginTop: '-40%',
              borderRadius: '4px',
              backgroundColor: 'hsl(var(--primary))',
            }}
            animate={{ rotate: secondsDegrees }}
            transition={settings.smoothSeconds 
              ? { type: 'tween', ease: 'linear', duration: 0.1 }
              : { type: 'spring', stiffness: 300, damping: 30 }
            }
          />
        )}

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-glow" />
      </div>

      {settings.showDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground font-medium"
        >
          {time.dayOfWeek}, {time.month} {time.dayOfMonth}, {time.year}
        </motion.div>
      )}
    </motion.div>
  );
};
