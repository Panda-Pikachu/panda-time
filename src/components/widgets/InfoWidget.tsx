import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sunset, Moon, Calendar } from 'lucide-react';
import { useTime } from '@/hooks/useTime';

const getGreeting = (hour: number): { text: string; emoji: string } => {
  if (hour >= 5 && hour < 12) return { text: 'Good Morning', emoji: '🌅' };
  if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  if (hour >= 17 && hour < 21) return { text: 'Good Evening', emoji: '🌆' };
  return { text: 'Good Night', emoji: '🌙' };
};

const getMoonPhase = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  let c = 0, e = 0, jd = 0, b = 0;
  
  if (month < 3) {
    c = year - 1;
    e = month + 12;
  } else {
    c = year;
    e = month;
  }
  
  jd = Math.floor(365.25 * (c + 4716)) + Math.floor(30.6001 * (e + 1)) + day - 1524.5;
  b = ((jd - 2451550.1) / 29.530588853) % 1;
  if (b < 0) b += 1;
  
  const phase = Math.floor(b * 8);
  const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  return phases[phase];
};

export const InfoWidget = () => {
  const time = useTime(false);
  const greeting = getGreeting(time.hours);
  const moonPhase = getMoonPhase(time.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="widget-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Today</h3>
      </div>

      <div className="space-y-3">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Greeting</span>
          <span className="font-medium text-foreground">
            {greeting.emoji} {greeting.text}
          </span>
        </div>

        {/* Moon Phase */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Moon Phase</span>
          <span className="text-2xl">{moonPhase}</span>
        </div>

        {/* Day of Year */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Day of Year</span>
          <span className="font-medium text-foreground">
            {Math.floor((time.date.getTime() - new Date(time.date.getFullYear(), 0, 0).getTime()) / 86400000)} / 365
          </span>
        </div>

        {/* Timezone */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Timezone</span>
          <span className="font-medium text-foreground text-sm">
            {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
