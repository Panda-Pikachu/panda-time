import { motion } from 'framer-motion';
import { useClockStore } from '@/stores/clockStore';
import { useTime, formatTime } from '@/hooks/useTime';

export const MinimalClock = () => {
  const { settings } = useClockStore();
  const time = useTime(settings.smoothSeconds);
  
  const { time: displayTime, period } = formatTime(
    time.hours,
    time.minutes,
    time.seconds,
    settings.timeFormat,
    settings.showSeconds
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center gap-8"
    >
      <motion.div 
        className="font-clock text-[15vw] md:text-[12vw] lg:text-[10vw] font-extralight tracking-widest text-foreground"
        initial={{ letterSpacing: '0.5em' }}
        animate={{ letterSpacing: '0.2em' }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {displayTime}
        {period && (
          <span className="text-[3vw] ml-4 text-muted-foreground font-light">
            {period}
          </span>
        )}
      </motion.div>

      {settings.showDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground font-light"
        >
          {time.dayOfWeek} · {time.month} {time.dayOfMonth}
        </motion.div>
      )}
    </motion.div>
  );
};
