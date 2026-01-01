import { useState, useEffect, useCallback, useRef } from 'react';

export interface TimeState {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  date: Date;
  dayOfWeek: string;
  dayOfMonth: number;
  month: string;
  year: number;
  weekNumber: number;
}

export const useTime = (smoothSeconds: boolean = true) => {
  const [time, setTime] = useState<TimeState>(() => getTimeState(new Date()));
  const animationRef = useRef<number>();

  const updateTime = useCallback(() => {
    const now = new Date();
    setTime(getTimeState(now));
    
    if (smoothSeconds) {
      animationRef.current = requestAnimationFrame(updateTime);
    }
  }, [smoothSeconds]);

  useEffect(() => {
    if (smoothSeconds) {
      animationRef.current = requestAnimationFrame(updateTime);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [smoothSeconds, updateTime]);

  return time;
};

function getTimeState(date: Date): TimeState {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    milliseconds: date.getMilliseconds(),
    date,
    dayOfWeek: days[date.getDay()],
    dayOfMonth: date.getDate(),
    month: months[date.getMonth()],
    year: date.getFullYear(),
    weekNumber: getWeekNumber(date),
  };
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export const formatTime = (
  hours: number,
  minutes: number,
  seconds: number,
  format: '12h' | '24h',
  showSeconds: boolean
): { time: string; period?: string } => {
  let displayHours = hours;
  let period: string | undefined;

  if (format === '12h') {
    period = hours >= 12 ? 'PM' : 'AM';
    displayHours = hours % 12 || 12;
  }

  const h = displayHours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');

  const time = showSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;

  return { time, period };
};

export const getTimeInTimezone = (timezone: string): Date => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  };
  
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(now);
  
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  const second = parseInt(parts.find(p => p.type === 'second')?.value || '0');
  
  const result = new Date(now);
  result.setHours(hour, minute, second);
  
  return result;
};
