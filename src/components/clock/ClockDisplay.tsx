import { useClockStore, ClockMode } from '@/stores/clockStore';
import { DigitalClock } from './DigitalClock';
import { AnalogClock } from './AnalogClock';
import { MinimalClock } from './MinimalClock';
import { NeonClock } from './NeonClock';
import { FlipClock } from './FlipClock';
import { HybridClock } from './HybridClock';

const clockComponents: Record<ClockMode, React.FC> = {
  digital: DigitalClock,
  analog: AnalogClock,
  minimal: MinimalClock,
  neon: NeonClock,
  flip: FlipClock,
  hybrid: HybridClock,
};

export const ClockDisplay = () => {
  const { settings } = useClockStore();
  const ClockComponent = clockComponents[settings.mode];

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <ClockComponent />
    </div>
  );
};
