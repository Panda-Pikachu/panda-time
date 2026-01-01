import { useState, useEffect, useCallback, useRef } from 'react';

export interface TimerState {
  remainingTime: number; // in seconds
  totalTime: number;
  isRunning: boolean;
  isComplete: boolean;
}

export const useTimer = (initialSeconds: number = 300) => {
  const [state, setState] = useState<TimerState>({
    remainingTime: initialSeconds,
    totalTime: initialSeconds,
    isRunning: false,
    isComplete: false,
  });
  
  const intervalRef = useRef<number>();

  const start = useCallback(() => {
    if (state.isRunning || state.remainingTime <= 0) return;
    
    intervalRef.current = window.setInterval(() => {
      setState(prev => {
        if (prev.remainingTime <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return { ...prev, remainingTime: 0, isRunning: false, isComplete: true };
        }
        return { ...prev, remainingTime: prev.remainingTime - 1 };
      });
    }, 1000);
    
    setState(prev => ({ ...prev, isRunning: true, isComplete: false }));
  }, [state.isRunning, state.remainingTime]);

  const pause = useCallback(() => {
    if (!state.isRunning) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setState(prev => ({ ...prev, isRunning: false }));
  }, [state.isRunning]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setState(prev => ({
      ...prev,
      remainingTime: prev.totalTime,
      isRunning: false,
      isComplete: false,
    }));
  }, []);

  const setTime = useCallback((seconds: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setState({
      remainingTime: seconds,
      totalTime: seconds,
      isRunning: false,
      isComplete: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return {
      hours: hrs.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const progress = state.totalTime > 0 
    ? ((state.totalTime - state.remainingTime) / state.totalTime) * 100 
    : 0;

  return {
    ...state,
    formatted: formatTime(state.remainingTime),
    progress,
    start,
    pause,
    reset,
    setTime,
  };
};
