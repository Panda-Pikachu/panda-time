import { motion } from 'framer-motion';
import { Globe, Timer, Gauge, Brain, CalendarDays, Cloud, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorldClockWidget } from '@/components/widgets/WorldClockWidget';
import { TimerWidget } from '@/components/widgets/TimerWidget';
import { StopwatchWidget } from '@/components/widgets/StopwatchWidget';
import { PomodoroWidget } from '@/components/widgets/PomodoroWidget';
import { CalendarWidget } from '@/components/widgets/CalendarWidget';
import { WeatherWidget } from '@/components/widgets/WeatherWidget';
import { InfoWidget } from '@/components/widgets/InfoWidget';
import { useClockStore } from '@/stores/clockStore';

const tabs = [
  { id: 'time', label: 'Time', icon: Globe },
  { id: 'tools', label: 'Tools', icon: Timer },
  { id: 'focus', label: 'Focus', icon: Brain },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'weather', label: 'Weather', icon: Cloud },
];

export const WidgetTabs = () => {
  const { settings } = useClockStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 max-w-5xl mx-auto w-full"
    >
      <Tabs defaultValue="time" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 glass-panel p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="time" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.showWorldClock && <WorldClockWidget />}
            <InfoWidget />
          </div>
        </TabsContent>

        <TabsContent value="tools" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.showTimer && <TimerWidget />}
            {settings.showStopwatch && <StopwatchWidget />}
          </div>
        </TabsContent>

        <TabsContent value="focus" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.showPomodoro && <PomodoroWidget />}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="widget-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Focus Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Use 25-minute focus sessions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Take 5-minute breaks between sessions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  After 4 sessions, take a longer break
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Stay hydrated during focus time
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Minimize distractions and notifications
                </li>
              </ul>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            <CalendarWidget />
          </div>
        </TabsContent>

        <TabsContent value="weather" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WeatherWidget />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="widget-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Weather Info</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Weather data is fetched from your current location. Allow location access for accurate results.
                </p>
                <p className="text-muted-foreground">
                  Data updates automatically and shows real-time conditions including temperature, humidity, and wind speed.
                </p>
              </div>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};