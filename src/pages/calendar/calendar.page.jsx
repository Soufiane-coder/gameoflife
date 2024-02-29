 // ES2015 module syntax
 import { Scheduler, AgendaView, TimelineView, DayView, WeekView, MonthView } from '@progress/kendo-react-scheduler';

export default function CalendarPage() {
  return (
    <Scheduler
      view="week"
      events={EVENTS}
      selectedDate={new Date(2021, 4, 5)}
    />
  );
}
