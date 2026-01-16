import { useState } from 'react';
import { Edit, Truck } from 'lucide-react';
import { Shipment, STATUS_LABELS, ShipmentStatus, STATUS_ORDER } from '@/types/shipment';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUpdateShipmentStatus } from '@/hooks/useShipments';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShipmentTableProps {
  shipments: Shipment[];
  statusFilter: ShipmentStatus | 'all';
}

const STATUS_COLORS: Record<ShipmentStatus, string> = {
  ordered: 'bg-muted text-muted-foreground',
  shipped: 'bg-info/10 text-info',
  in_transit: 'bg-primary/10 text-primary',
  out_for_delivery: 'bg-warning/10 text-warning',
  delivered: 'bg-success/10 text-success',
};

export function ShipmentTable({ shipments, statusFilter }: ShipmentTableProps) {
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('ordered');
  const [newLocation, setNewLocation] = useState('');
  const updateStatus = useUpdateShipmentStatus();

  const filteredShipments = statusFilter === 'all'
    ? shipments
    : shipments.filter((s) => s.status === statusFilter);

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setNewStatus(shipment.status);
    setNewLocation(shipment.current_location || '');
  };

  const handleUpdate = async () => {
    if (!editingShipment) return;

    await updateStatus.mutateAsync({
      id: editingShipment.id,
      status: newStatus,
      current_location: newLocation || undefined,
    });

    setEditingShipment(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (filteredShipments.length === 0) {
    return (
      <div className="text-center py-12">
        <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No shipments found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Tracking ID
              </th>
              <th className="pb-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Recipient
              </th>
              <th className="pb-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Current Node
              </th>
              <th className="pb-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="pb-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Last Sync
              </th>
              <th className="pb-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredShipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-4 px-4">
                  <span className="font-mono text-sm font-medium">
                    #{shipment.tracking_number.slice(0, 10)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-sm">{shipment.recipient_name}</p>
                    <p className="text-xs text-muted-foreground">{shipment.destination_location}</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm">
                  {shipment.current_location || '-'}
                </td>
                <td className="py-4 px-4">
                  <Badge className={cn('font-medium', STATUS_COLORS[shipment.status])}>
                    • {STATUS_LABELS[shipment.status]}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-sm text-muted-foreground">
                  {formatDate(shipment.updated_at)}
                </td>
                <td className="py-4 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(shipment)}
                    className="gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit Movement
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredShipments.map((shipment) => (
          <div
            key={shipment.id}
            className="p-4 bg-card rounded-xl border border-border/50 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="font-mono text-sm font-medium">
                  #{shipment.tracking_number.slice(0, 10)}
                </span>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {shipment.recipient_name}
                </p>
              </div>
              <Badge className={cn('font-medium text-xs', STATUS_COLORS[shipment.status])}>
                {STATUS_LABELS[shipment.status]}
              </Badge>
            </div>

            <div className="space-y-1.5 text-sm mb-3">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Location:</span>{' '}
                {shipment.current_location || '-'}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Destination:</span>{' '}
                {shipment.destination_location}
              </p>
              <p className="text-xs text-muted-foreground">
                Updated {formatDate(shipment.updated_at)}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(shipment)}
              className="w-full gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit Movement
            </Button>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingShipment} onOpenChange={() => setEditingShipment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Update Shipment
            </DialogTitle>
            <DialogDescription>
              #{editingShipment?.tracking_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Update Status</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ShipmentStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Current Location Node</Label>
              <Input
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g., Distribution Hub, Node 4"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setEditingShipment(null)} className="flex-1">
              Discard
            </Button>
            <Button
              variant="hero"
              onClick={handleUpdate}
              disabled={updateStatus.isPending}
              className="flex-1"
            >
              {updateStatus.isPending ? 'Updating...' : 'Publish Update'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
