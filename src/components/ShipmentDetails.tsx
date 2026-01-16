import { MapPin, Navigation, Target, User, Home, Truck, Package, FileText, Clock } from 'lucide-react';
import { Shipment, STATUS_LABELS, CARRIER_LABELS } from '@/types/shipment';
import { ShipmentTimeline } from './ShipmentTimeline';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ShipmentDetailsProps {
  shipment: Shipment;
}

export function ShipmentDetails({ shipment }: ShipmentDetailsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <Card className="shadow-card border-border/50 overflow-hidden">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wide mb-1">
                Delivery Status
              </p>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                  {STATUS_LABELS[shipment.status]}
                </h2>
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Tracking Number
              </p>
              <p className="text-base sm:text-lg font-semibold font-mono text-foreground">
                {shipment.tracking_number}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6 sm:mb-8">
            <ShipmentTimeline currentStatus={shipment.status} />
          </div>

          {/* Location Info */}
          <div className="mb-6 mx-auto">
            <div className="flex items-center gap-4 p-4 sm:p-5 bg-muted/50 rounded-xl">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-background flex items-center justify-center flex-shrink-0 shadow-sm border border-border/50">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Origin Location
                </p>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-foreground text-lg sm:text-xl truncate">
                    {shipment.origin_location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recipient Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 bg-muted/50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                  Recipient Name
                </p>
                <p className="font-medium text-foreground">
                  {shipment.recipient_name}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                  Address
                </p>
                <p className="font-medium text-foreground">
                  {shipment.recipient_address}
                </p>
              </div>
            </div>
          </div>

          {/* Time to Deliver */}
          {shipment.recipient_phone && (
            <div className="mt-4 p-4 sm:p-5 bg-accent/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    Time to Deliver
                  </p>
                  <p className="font-semibold text-foreground text-lg">
                    {shipment.recipient_phone}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Item Description & Note */}
          {(shipment.item_description || shipment.note) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 sm:p-5 bg-muted/50 rounded-xl">
              {shipment.item_description && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                      Item Description
                    </p>
                    <p className="font-medium text-foreground">
                      {shipment.item_description}
                    </p>
                  </div>
                </div>
              )}
              {shipment.note && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                      Note
                    </p>
                    <p className="font-medium text-foreground">
                      {shipment.note}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Carrier */}
          {shipment.carrier && (
            <div className="mt-4 text-center">
              <span className="text-sm text-muted-foreground">
                Shipped via <span className="font-medium text-foreground">{CARRIER_LABELS[shipment.carrier]}</span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LocationCard({
  label,
  value,
  icon,
  highlighted = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all",
        highlighted ? "bg-accent" : "bg-muted/30"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          highlighted ? "bg-primary text-primary-foreground" : "bg-background text-primary"
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="font-medium text-foreground truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
