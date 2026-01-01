import { motion } from 'framer-motion';
import { useClockStore } from '@/stores/clockStore';
import { useTime, formatTime } from '@/hooks/useTime';

export const DigitalClock = () => {
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center gap-4"
    >
      <div className="flex items-baseline gap-2 font-clock">
        <div className="flex items-center">
          {timeParts.map((part, index) => (
            <span key={index} className="flex items-center">
              <motion.span
                key={`${index}-${part}`}
                initial={{ opacity: 0.8, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold tracking-tight text-foreground"
              >
                {part}
              </motion.span>
              {index < timeParts.length - 1 && (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold text-primary mx-1"
                >
                  :
                </motion.span>
              )}
            </span>
          ))}
        </div>
        
        {period && (
          <motion.span 
            className="text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground ml-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {period}
          </motion.span>
        )}
      </div>

      {settings.showDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium"
        >
          {time.dayOfWeek}, {time.month} {time.dayOfMonth}, {time.year}
          {settings.showWeekNumber && (
            <span className="ml-3 text-primary">Week {time.weekNumber}</span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
