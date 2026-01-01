import { motion } from 'framer-motion';
import { Clock, Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStopwatch } from '@/hooks/useStopwatch';
import { ScrollArea } from '@/components/ui/scroll-area';

export const StopwatchWidget = () => {
  const stopwatch = useStopwatch();

  const formatLap = (ms: number, index: number, laps: number[]) => {
    const prevMs = index > 0 ? laps[index - 1] : 0;
    const lapMs = ms - prevMs;
    const lapSeconds = Math.floor(lapMs / 1000);
    const minutes = Math.floor(lapSeconds / 60);
    const seconds = lapSeconds % 60;
    const centiseconds = Math.floor((lapMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="widget-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Stopwatch</h3>
      </div>

      {/* Stopwatch display */}
      <div className="text-center mb-4">
        <motion.div
          className="font-clock text-4xl font-bold text-foreground"
          animate={stopwatch.isRunning ? { opacity: [1, 0.9, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          {stopwatch.formatted.minutes}:{stopwatch.formatted.seconds}
          <span className="text-2xl text-muted-foreground">.{stopwatch.formatted.centiseconds}</span>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center mb-4">
        <Button
          variant={stopwatch.isRunning ? 'secondary' : 'default'}
          size="sm"
          onClick={stopwatch.isRunning ? stopwatch.pause : stopwatch.start}
          className="flex items-center gap-1"
        >
          {stopwatch.isRunning ? (
            <>
              <Pause className="w-4 h-4" /> Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Start
            </>
          )}
        </Button>
        
        {stopwatch.isRunning && (
          <Button
            variant="outline"
            size="sm"
            onClick={stopwatch.lap}
            className="flex items-center gap-1"
          >
            <Flag className="w-4 h-4" /> Lap
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={stopwatch.reset}
          className="flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>

      {/* Laps */}
      {stopwatch.laps.length > 0 && (
        <ScrollArea className="h-24">
          <div className="space-y-1">
            {stopwatch.laps.map((lapTime, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between text-sm py-1 border-b border-border/30 last:border-0"
              >
                <span className="text-muted-foreground">Lap {index + 1}</span>
                <span className="font-clock text-foreground">
                  {formatLap(lapTime, index, stopwatch.laps)}
                </span>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      )}
    </motion.div>
  );
};
