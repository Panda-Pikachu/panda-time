import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

export const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="widget-card col-span-1 md:col-span-2"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Calendar</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={goToToday}>
          Today
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h4 className="font-semibold text-foreground">
          {format(currentDate, 'MMMM yyyy')}
        </h4>
        <Button variant="ghost" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);

          return (
            <motion.button
              key={index}
              onClick={() => setSelectedDate(day)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-full transition-colors
                ${!isCurrentMonth ? 'text-muted-foreground/40' : 'text-foreground'}
                ${isToday && !isSelected ? 'bg-primary/20 text-primary font-bold' : ''}
                ${isSelected ? 'bg-primary text-primary-foreground font-bold' : ''}
                ${!isSelected && isCurrentMonth ? 'hover:bg-secondary' : ''}
              `}
            >
              {format(day, 'd')}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          Selected: <span className="text-foreground font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
        </p>
      </div>
    </motion.div>
  );
};