import { motion } from 'framer-motion';
import { useClockStore } from '@/stores/clockStore';
import { useTime, formatTime } from '@/hooks/useTime';

export const NeonClock = () => {
  const { settings } = useClockStore();
  const time = useTime(settings.smoothSeconds);
  
  const { time: displayTime, period } = formatTime(
    time.hours,
    time.minutes,
    time.seconds,
    settings.timeFormat,
    settings.showSeconds
  );

  const timeParts = displayTime.split(':');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="flex items-center font-clock">
        {timeParts.map((part, index) => (
          <span key={index} className="flex items-center">
            <motion.span
              className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold tracking-tight neon-text text-primary"
              animate={{ 
                textShadow: [
                  '0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary))',
                  '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary)), 0 0 80px hsl(var(--primary))',
                  '0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary))',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {part}
            </motion.span>
            {index < timeParts.length - 1 && (
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold neon-text text-primary mx-2"
              >
                :
              </motion.span>
            )}
          </span>
        ))}
        
        {period && (
          <motion.span 
            className="text-2xl md:text-3xl lg:text-4xl font-semibold neon-text text-primary ml-4"
          >
            {period}
          </motion.span>
        )}
      </div>

      {settings.showDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-primary/60 font-medium tracking-widest"
        >
          {time.dayOfWeek}, {time.month} {time.dayOfMonth}, {time.year}
        </motion.div>
      )}
    </motion.div>
  );
};
