import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClockStore } from '@/stores/clockStore';
import { useTime, formatTime } from '@/hooks/useTime';

interface FlipDigitProps {
  digit: string;
  prevDigit: string;
}

const FlipDigit = ({ digit, prevDigit }: FlipDigitProps) => {
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== prevDigit) {
      setIsFlipping(true);
      const timer = setTimeout(() => setIsFlipping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [digit, prevDigit]);

  return (
    <div className="relative w-[8vw] max-w-[80px] h-[12vw] max-h-[120px] mx-0.5">
      {/* Background cards */}
      <div className="absolute inset-0 rounded-lg bg-secondary overflow-hidden shadow-lg">
        {/* Top half */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-secondary flex items-end justify-center overflow-hidden border-b border-background/20">
          <span className="font-clock text-[8vw] max-text-[80px] font-bold text-foreground translate-y-1/2">
            {isFlipping ? prevDigit : digit}
          </span>
        </div>
        
        {/* Bottom half */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-secondary/90 flex items-start justify-center overflow-hidden">
          <span className="font-clock text-[8vw] max-text-[80px] font-bold text-foreground -translate-y-1/2">
            {digit}
          </span>
        </div>
      </div>

      {/* Flip animation */}
      <AnimatePresence>
        {isFlipping && (
          <>
            {/* Top flipping down */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              exit={{ rotateX: -90 }}
              transition={{ duration: 0.15, ease: 'easeIn' }}
              className="absolute top-0 left-0 right-0 h-1/2 rounded-t-lg bg-secondary flex items-end justify-center overflow-hidden origin-bottom"
              style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
            >
              <span className="font-clock text-[8vw] max-text-[80px] font-bold text-foreground translate-y-1/2">
                {prevDigit}
              </span>
            </motion.div>
            
            {/* Bottom flipping up */}
            <motion.div
              initial={{ rotateX: 90 }}
              animate={{ rotateX: 0 }}
              exit={{ rotateX: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut', delay: 0.15 }}
              className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-lg bg-secondary/90 flex items-start justify-center overflow-hidden origin-top"
              style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
            >
              <span className="font-clock text-[8vw] max-text-[80px] font-bold text-foreground -translate-y-1/2">
                {digit}
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Center line */}
      <div className="absolute left-0 right-0 top-1/2 h-px bg-background/30" />
    </div>
  );
};

export const FlipClock = () => {
  const { settings } = useClockStore();
  const time = useTime(false); // Flip clock uses step seconds
  const prevTimeRef = useRef({ hours: 0, minutes: 0, seconds: 0 });
  
  const { time: displayTime, period } = formatTime(
    time.hours,
    time.minutes,
    time.seconds,
    settings.timeFormat,
    settings.showSeconds
  );

  const currentDigits = displayTime.replace(/:/g, '').split('');
  
  const prevTime = formatTime(
    prevTimeRef.current.hours,
    prevTimeRef.current.minutes,
    prevTimeRef.current.seconds,
    settings.timeFormat,
    settings.showSeconds
  );
  const prevDigits = prevTime.time.replace(/:/g, '').split('');

  useEffect(() => {
    prevTimeRef.current = { hours: time.hours, minutes: time.minutes, seconds: time.seconds };
  }, [time.hours, time.minutes, time.seconds]);

  const renderDigitGroup = (start: number, end: number) => {
    return currentDigits.slice(start, end).map((digit, index) => (
      <FlipDigit
        key={start + index}
        digit={digit}
        prevDigit={prevDigits[start + index] || digit}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="flex items-center">
        {/* Hours */}
        <div className="flex">{renderDigitGroup(0, 2)}</div>
        <span className="font-clock text-[6vw] max-text-[60px] font-bold text-primary mx-2 animate-pulse">:</span>
        
        {/* Minutes */}
        <div className="flex">{renderDigitGroup(2, 4)}</div>
        
        {/* Seconds */}
        {settings.showSeconds && (
          <>
            <span className="font-clock text-[6vw] max-text-[60px] font-bold text-primary mx-2 animate-pulse">:</span>
            <div className="flex">{renderDigitGroup(4, 6)}</div>
          </>
        )}
        
        {period && (
          <span className="font-clock text-xl md:text-2xl font-semibold text-muted-foreground ml-4">
            {period}
          </span>
        )}
      </div>

      {settings.showDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground font-medium"
        >
          {time.dayOfWeek}, {time.month} {time.dayOfMonth}, {time.year}
        </motion.div>
      )}
    </motion.div>
  );
};
