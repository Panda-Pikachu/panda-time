import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useClockStore } from '@/stores/clockStore';
import { getTimeInTimezone, formatTime } from '@/hooks/useTime';
import { useTime } from '@/hooks/useTime';

export const WorldClockWidget = () => {
  const { settings } = useClockStore();
  const time = useTime(false); // Just to trigger re-renders

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="widget-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">World Clock</h3>
      </div>

      <div className="space-y-3">
        {settings.worldClocks.map((city, index) => {
          const cityTime = getTimeInTimezone(city.timezone);
          const { time: displayTime, period } = formatTime(
            cityTime.getHours(),
            cityTime.getMinutes(),
            cityTime.getSeconds(),
            settings.timeFormat,
            false
          );

          return (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
            >
              <div>
                <p className="font-medium text-foreground">{city.label || city.name}</p>
                <p className="text-xs text-muted-foreground">{city.timezone}</p>
              </div>
              <div className="text-right">
                <p className="font-clock text-xl font-semibold text-foreground">
                  {displayTime}
                </p>
                {period && (
                  <p className="text-xs text-muted-foreground">{period}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
