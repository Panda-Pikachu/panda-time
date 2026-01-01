import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimer } from '@/hooks/useTimer';
import { useState } from 'react';

export const TimerWidget = () => {
  const timer = useTimer(300); // 5 minutes default
  const [isEditing, setIsEditing] = useState(false);

  const presets = [
    { label: '1m', seconds: 60 },
    { label: '5m', seconds: 300 },
    { label: '10m', seconds: 600 },
    { label: '25m', seconds: 1500 },
  ];

  const adjustTime = (delta: number) => {
    const newTime = Math.max(0, timer.totalTime + delta);
    timer.setTime(newTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="widget-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Timer</h3>
      </div>

      {/* Timer display */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2">
          {!timer.isRunning && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => adjustTime(-60)}
              className="h-8 w-8"
            >
              <Minus className="w-4 h-4" />
            </Button>
          )}
          
          <motion.div
            className="font-clock text-4xl font-bold text-foreground"
            animate={timer.isComplete ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: timer.isComplete ? Infinity : 0, duration: 0.5 }}
          >
            {timer.formatted.hours !== '00' && `${timer.formatted.hours}:`}
            {timer.formatted.minutes}:{timer.formatted.seconds}
          </motion.div>

          {!timer.isRunning && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => adjustTime(60)}
              className="h-8 w-8"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${timer.progress}%` }}
            transition={{ type: 'tween', ease: 'linear' }}
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex gap-1 mb-4 justify-center">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="secondary"
            size="sm"
            onClick={() => timer.setTime(preset.seconds)}
            className="text-xs px-2 py-1 h-7"
            disabled={timer.isRunning}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={timer.isRunning ? 'secondary' : 'default'}
          size="sm"
          onClick={timer.isRunning ? timer.pause : timer.start}
          className="flex items-center gap-1"
        >
          {timer.isRunning ? (
            <>
              <Pause className="w-4 h-4" /> Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Start
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={timer.reset}
          className="flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>
    </motion.div>
  );
};
