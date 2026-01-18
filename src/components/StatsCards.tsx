import { Truck, Building, CheckCircle, AlertTriangle } from 'lucide-react';
import { Shipment } from '@/types/shipment';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  shipments: Shipment[];
}

export function StatsCards({ shipments }: StatsCardsProps) {
  const inTransit = shipments.filter((s) => s.status === 'in_transit').length;
  const atFacility = shipments.filter((s) => s.status === 'Delivered' || s.status === 'ordered').length;
  const delivered = shipments.filter((s) => s.status === 'delivered').length;
  const exceptions = shipments.filter((s) => s.status === 'out_for_delivery').length;

  const stats = [
    {
      label: 'In Transit',
      value: inTransit,
      icon: Truck,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'At Facility',
      value: atFacility,
      icon: Building,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      label: 'Delivered',
      value: delivered,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Out for Delivery',
      value: exceptions,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl border border-border/50 p-3 sm:p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', stat.bgColor)}>
              <stat.icon className={cn('w-4 h-4', stat.color)} />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
              {stat.label}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
