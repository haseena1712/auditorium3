import { useAuditoriums } from '@/hooks/useAuditoriums';
import { useBookings } from '@/hooks/useBookings';
import { motion } from 'framer-motion';
import { Building2, Users, Wrench, CalendarCheck, Trophy } from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  available: { label: 'Available', class: 'status-available', icon: Building2 },
  occupied: { label: 'Occupied', class: 'status-occupied', icon: Users },
  maintenance: { label: 'Maintenance', class: 'status-maintenance', icon: Wrench },
};

interface Props {
  selectedDate?: Date;
}

export default function AuditoriumStatusGrid({ selectedDate }: Props) {
  const { auditoriums, loading } = useAuditoriums();
  const { bookings } = useBookings();

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : new Date().toISOString().split('T')[0];
  const occupiedAuditoriumIds = new Set(
    bookings
      .filter(b => b.status === 'approved' && b.date === dateStr)
      .map(b => b.auditorium_id)
  );

  // Count total approved bookings per auditorium
  const bookingCounts = new Map<string, number>();
  for (const b of bookings) {
    if (b.status === 'approved') {
      bookingCounts.set(b.auditorium_id, (bookingCounts.get(b.auditorium_id) || 0) + 1);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-3" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const maxCount = Math.max(...Array.from(bookingCounts.values()), 0);
  const mostPopularId = maxCount > 0
    ? [...bookingCounts.entries()].find(([, count]) => count === maxCount)?.[0]
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {auditoriums.map((aud, index) => {
        const isMostPopular = aud.id === mostPopularId;
        // If the auditorium has an approved booking today, show as occupied
        const effectiveStatus = aud.status === 'maintenance'
          ? 'maintenance'
          : occupiedAuditoriumIds.has(aud.id)
            ? 'occupied'
            : 'available';
        const config = statusConfig[effectiveStatus];
        const Icon = config.icon;
        const totalBooked = bookingCounts.get(aud.id) || 0;
        return (
          <motion.div
            key={aud.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`glass-card p-6 hover:shadow-lg transition-shadow relative ${isMostPopular ? 'ring-2 ring-primary/40' : ''}`}
          >
            {isMostPopular && (
              <span className="absolute -top-2 -right-2 gradient-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shadow-md">
                <Trophy className="h-3 w-3" /> Most Popular
              </span>
            )}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-display font-semibold text-foreground">{aud.name}</h4>
                <p className="text-sm text-muted-foreground">{aud.description}</p>
              </div>
              <span className={`${config.class} text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {config.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>Capacity: {aud.capacity}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarCheck className="h-4 w-4" />
                <span>Booked {totalBooked} time{totalBooked !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
