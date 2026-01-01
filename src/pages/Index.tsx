import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClockDisplay } from '@/components/clock/ClockDisplay';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Header } from '@/components/Header';
import { WorldClockWidget } from '@/components/widgets/WorldClockWidget';
import { TimerWidget } from '@/components/widgets/TimerWidget';
import { StopwatchWidget } from '@/components/widgets/StopwatchWidget';
import { PomodoroWidget } from '@/components/widgets/PomodoroWidget';
import { InfoWidget } from '@/components/widgets/InfoWidget';
import { useClockStore } from '@/stores/clockStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const Index = () => {
  const { settings } = useClockStore();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (settings.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches);
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    }
  }, [settings.theme]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <ParticleBackground />

      {/* Header */}
      <Header />

      {/* Settings Panel */}
      <SettingsPanel />

      {/* Main content */}
      <main className="relative z-10 pt-24 pb-8 px-4 md:px-8 min-h-screen flex flex-col">
        {/* Clock display - centered */}
        <div className="flex-1 flex items-center justify-center">
          <ClockDisplay />
        </div>

        {/* Widgets grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto w-full"
        >
          {settings.showWorldClock && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <WorldClockWidget />
            </motion.div>
          )}

          {settings.showTimer && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <TimerWidget />
            </motion.div>
          )}

          {settings.showStopwatch && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <StopwatchWidget />
            </motion.div>
          )}

          {settings.showPomodoro && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <PomodoroWidget />
            </motion.div>
          )}

          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <InfoWidget />
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-muted-foreground/60 flex items-center gap-4"
        >
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] font-mono">S</kbd> Settings
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] font-mono">F</kbd> Fullscreen
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] font-mono">1-6</kbd> Clock modes
          </span>
          <span>🐼</span>
        </motion.p>
      </footer>
    </div>
  );
};

export default Index;
