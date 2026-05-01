import { useMemo, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useBookings } from '@/hooks/useBookings';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarDays, Clock } from 'lucide-react';

interface Props {
  selectedDate?: Date;
  onSelectDate?: (date: Date | undefined) => void;
}

export default function BookingCalendar({ selectedDate, onSelectDate }: Props) {
  const { bookings } = useBookings();
  const [localDate, setLocalDate] = useState<Date | undefined>(selectedDate);

  const activeDate = selectedDate ?? localDate;
  const handleSelect = (d: Date | undefined) => {
    setLocalDate(d);
    onSelectDate?.(d);
  };

  // Group bookings by date
  const bookedDates = useMemo(() => {
    const map = new Map<string, { count: number; status: string }>();
    for (const b of bookings) {
      if (b.status === 'approved' || b.status === 'pending') {
        const existing = map.get(b.date);
        map.set(b.date, {
          count: (existing?.count || 0) + 1,
          status: b.status === 'approved' ? 'approved' : existing?.status === 'approved' ? 'approved' : 'pending',
        });
      }
    }
    return map;
  }, [bookings]);

  const activeDateStr = activeDate ? format(activeDate, 'yyyy-MM-dd') : null;
  const selectedBookings = activeDateStr
    ? bookings.filter(b => b.date === activeDateStr && (b.status === 'approved' || b.status === 'pending'))
    : [];

  const modifiers = useMemo(() => {
    const approved: Date[] = [];
    const pending: Date[] = [];
    bookedDates.forEach((val, dateStr) => {
      const d = new Date(dateStr + 'T00:00:00');
      if (val.status === 'approved') approved.push(d);
      else pending.push(d);
    });
    return { approved, pending };
  }, [bookedDates]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        Booking Calendar
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4 flex justify-center">
          <Calendar
            mode="single"
            selected={activeDate}
            onSelect={handleSelect}
            modifiers={modifiers}
            modifiersClassNames={{
              approved: 'bg-[hsl(var(--status-approved))] text-white hover:bg-[hsl(var(--status-approved))]',
              pending: 'bg-[hsl(var(--status-pending))] text-white hover:bg-[hsl(var(--status-pending))]',
            }}
            className={cn('p-3 pointer-events-auto')}
          />
        </div>

        <div className="glass-card p-4">
          {activeDateStr ? (
            <>
              <h4 className="font-display font-semibold text-foreground mb-3">
                {format(activeDate!, 'PPP')}
              </h4>
              {selectedBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No bookings on this date.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedBookings.map(b => (
                    <div key={b.id} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground">{b.auditoriums?.name}</p>
                        <span className={`status-${b.status} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {b.time_slot}
                      </div>
                      {b.purpose && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{b.purpose}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--status-approved))]" /> Approved
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--status-pending))]" /> Pending
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <CalendarDays className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Select a date to view bookings</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
