import { useEffect } from 'react';
import { useClockStore } from '@/stores/clockStore';

export const useKeyboardShortcuts = () => {
  const { toggleSettings, updateSettings, settings, setFullscreen } = useClockStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 's':
          // Toggle settings
          toggleSettings();
          break;
        case 'f':
          // Toggle fullscreen
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setFullscreen(true);
          } else {
            document.exitFullscreen();
            setFullscreen(false);
          }
          break;
        case 't':
          // Toggle theme
          const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
          const currentIndex = themes.indexOf(settings.theme);
          const nextTheme = themes[(currentIndex + 1) % themes.length];
          updateSettings({ theme: nextTheme });
          document.documentElement.classList.toggle('dark', nextTheme === 'dark');
          break;
        case '1':
          updateSettings({ mode: 'digital' });
          break;
        case '2':
          updateSettings({ mode: 'analog' });
          break;
        case '3':
          updateSettings({ mode: 'minimal' });
          break;
        case '4':
          updateSettings({ mode: 'neon' });
          break;
        case '5':
          updateSettings({ mode: 'flip' });
          break;
        case '6':
          updateSettings({ mode: 'hybrid' });
          break;
        case 'escape':
          // Close settings panel
          if (useClockStore.getState().isSettingsOpen) {
            toggleSettings();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSettings, updateSettings, settings.theme, setFullscreen]);
};
