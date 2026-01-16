import { Check, Package, Truck, MapPin, Home } from 'lucide-react';
import { ShipmentStatus, STATUS_ORDER, STATUS_LABELS } from '@/types/shipment';
import { cn } from '@/lib/utils';

interface ShipmentTimelineProps {
  currentStatus: ShipmentStatus;
}

const STATUS_ICONS: Record<ShipmentStatus, React.ReactNode> = {
  ordered: <Package className="w-4 h-4" />,
  shipped: <Check className="w-4 h-4" />,
  in_transit: <Truck className="w-4 h-4" />,
  out_for_delivery: <MapPin className="w-4 h-4" />,
  delivered: <Home className="w-4 h-4" />,
};

export function ShipmentTimeline({ currentStatus }: ShipmentTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="w-full py-4">
      {/* Desktop Timeline */}
      <div className="hidden sm:block relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentIndex / (STATUS_ORDER.length - 1)) * 100}%` }}
          />
        </div>

        {/* Status Points */}
        <div className="relative flex justify-between">
          {STATUS_ORDER.map((status, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={status} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                    isCurrent && "ring-4 ring-primary/20 scale-110"
                  )}
                >
                  {STATUS_ICONS[status]}
                </div>
                <span
                  className={cn(
                    "mt-3 text-xs sm:text-sm font-medium text-center",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {STATUS_LABELS[status]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="sm:hidden space-y-3">
        {STATUS_ORDER.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={status} className="flex items-center gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                  isCurrent && "ring-2 ring-primary/20"
                )}
              >
                {STATUS_ICONS[status]}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {STATUS_LABELS[status]}
              </span>
              {index < STATUS_ORDER.length - 1 && (
                <div
                  className={cn(
                    "hidden flex-1 h-0.5",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
