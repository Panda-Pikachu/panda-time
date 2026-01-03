import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClockDisplay } from '@/components/clock/ClockDisplay';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Header } from '@/components/Header';
import { WidgetTabs } from '@/components/WidgetTabs';
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

        {/* Widget Tabs */}
        <WidgetTabs />
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
