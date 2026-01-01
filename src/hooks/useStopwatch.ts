import { useState, useEffect, useCallback, useRef } from 'react';

export interface StopwatchState {
  time: number; // in milliseconds
  isRunning: boolean;
  laps: number[];
}

export const useStopwatch = () => {
  const [state, setState] = useState<StopwatchState>({
    time: 0,
    isRunning: false,
    laps: [],
  });
  
  const intervalRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);

  const start = useCallback(() => {
    if (state.isRunning) return;
    
    startTimeRef.current = Date.now();
    accumulatedRef.current = state.time;
    
    intervalRef.current = window.setInterval(() => {
      setState(prev => ({
        ...prev,
        time: accumulatedRef.current + (Date.now() - startTimeRef.current),
      }));
    }, 10);
    
    setState(prev => ({ ...prev, isRunning: true }));
  }, [state.isRunning, state.time]);

  const pause = useCallback(() => {
    if (!state.isRunning) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    accumulatedRef.current = state.time;
    setState(prev => ({ ...prev, isRunning: false }));
  }, [state.isRunning, state.time]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    accumulatedRef.current = 0;
    setState({ time: 0, isRunning: false, laps: [] });
  }, []);

  const lap = useCallback(() => {
    if (!state.isRunning) return;
    setState(prev => ({
      ...prev,
      laps: [...prev.laps, prev.time],
    }));
  }, [state.isRunning]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      centiseconds: centiseconds.toString().padStart(2, '0'),
    };
  };

  return {
    ...state,
    formatted: formatTime(state.time),
    start,
    pause,
    reset,
    lap,
  };
};
