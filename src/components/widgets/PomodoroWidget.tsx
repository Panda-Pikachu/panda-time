import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

const PHASE_DURATIONS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const PHASE_LABELS = {
  work: 'Focus Time',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export const PomodoroWidget = () => {
  const [phase, setPhase] = useState<PomodoroPhase>('work');
  const [timeLeft, setTimeLeft] = useState(PHASE_DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((PHASE_DURATIONS[phase] - timeLeft) / PHASE_DURATIONS[phase]) * 100;

  const switchPhase = useCallback((newPhase: PomodoroPhase) => {
    setPhase(newPhase);
    setTimeLeft(PHASE_DURATIONS[newPhase]);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Phase complete
          if (phase === 'work') {
            const newCompleted = completedPomodoros + 1;
            setCompletedPomodoros(newCompleted);
            
            // Every 4 pomodoros, take a long break
            if (newCompleted % 4 === 0) {
              switchPhase('longBreak');
            } else {
              switchPhase('shortBreak');
            }
          } else {
            switchPhase('work');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, completedPomodoros, switchPhase]);

  const reset = () => {
    setTimeLeft(PHASE_DURATIONS[phase]);
    setIsRunning(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="widget-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Pomodoro</h3>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < (completedPomodoros % 4) ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Phase indicator */}
      <div className="flex gap-1 mb-4 justify-center">
        <Button
          variant={phase === 'work' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => switchPhase('work')}
          className="text-xs px-2 py-1 h-7 flex items-center gap-1"
        >
          <Zap className="w-3 h-3" /> Focus
        </Button>
        <Button
          variant={phase === 'shortBreak' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => switchPhase('shortBreak')}
          className="text-xs px-2 py-1 h-7 flex items-center gap-1"
        >
          <Coffee className="w-3 h-3" /> Short
        </Button>
        <Button
          variant={phase === 'longBreak' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => switchPhase('longBreak')}
          className="text-xs px-2 py-1 h-7 flex items-center gap-1"
        >
          <Coffee className="w-3 h-3" /> Long
        </Button>
      </div>

      {/* Timer display */}
      <div className="text-center mb-4">
        <motion.div
          className="font-clock text-4xl font-bold text-foreground"
          animate={isRunning ? { opacity: [1, 0.95, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {formatTime(timeLeft)}
        </motion.div>
        <p className="text-sm text-muted-foreground mt-1">{PHASE_LABELS[phase]}</p>

        {/* Progress ring */}
        <div className="relative w-32 h-32 mx-auto mt-4">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="6"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke={phase === 'work' ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
              animate={{
                strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100),
              }}
              transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">
              {phase === 'work' ? '🧠' : '☕'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={isRunning ? 'secondary' : 'default'}
          size="sm"
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-1"
        >
          {isRunning ? (
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
          onClick={reset}
          className="flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>
    </motion.div>
  );
};
