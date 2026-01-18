import { useState } from 'react';
import { Edit, Truck, StickyNote, Pencil, Building, User, MapPin, Clock, Package } from 'lucide-react';
import { Shipment, STATUS_LABELS, ShipmentStatus, STATUS_ORDER, CARRIER_LABELS, CarrierType } from '@/types/shipment';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUpdateShipmentStatus, useUpdateShipment } from '@/hooks/useShipments';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ShipmentTableProps {
  shipments: Shipment[];
  statusFilter: ShipmentStatus | 'all';
  searchQuery?: string;
}

const STATUS_COLORS: Record<ShipmentStatus, string> = {
  ordered: 'bg-muted text-muted-foreground',
  Delivered: 'bg-info/10 text-info',
  in_transit: 'bg-primary/10 text-primary',
  out_for_delivery: 'bg-warning/10 text-warning',
  delivered: 'bg-success/10 text-success',
  pending_payment: 'bg-destructive/10 text-destructive',
};

export function ShipmentTable({ shipments, statusFilter, searchQuery = '' }: ShipmentTableProps) {
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [fullEditShipment, setFullEditShipment] = useState<Shipment | null>(null);
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('ordered');
  const [newLocation, setNewLocation] = useState('');
  const [newNote, setNewNote] = useState('');
  const updateStatus = useUpdateShipmentStatus();
  const updateShipment = useUpdateShipment();

  // Full edit form state
  const [editForm, setEditForm] = useState({
    sender_name: '',
    recipient_name: '',
    recipient_address: '',
    recipient_phone: '',
    origin_location: '',
    destination_location: '',
    item_description: '',
    carrier: 'other' as CarrierType,
    status: 'ordered' as ShipmentStatus,
    note: '',
    current_location: '',
  });

  // Filter by status
  let filteredShipments = statusFilter === 'all'
    ? shipments
    : shipments.filter((s) => s.status === statusFilter);

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredShipments = filteredShipments.filter((s) => 
      s.tracking_number.toLowerCase().includes(query) ||
      s.recipient_name.toLowerCase().includes(query) ||
      s.sender_name.toLowerCase().includes(query) ||
      s.destination_location.toLowerCase().includes(query) ||
      s.origin_location.toLowerCase().includes(query) ||
      (s.item_description && s.item_description.toLowerCase().includes(query)) ||
      (s.recipient_address && s.recipient_address.toLowerCase().includes(query)) ||
      (s.note && s.note.toLowerCase().includes(query))
    );
  }

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setNewStatus(shipment.status);
    setNewLocation(shipment.current_location || '');
    setNewNote(shipment.note || '');
  };

  const handleFullEdit = (shipment: Shipment) => {
    setFullEditShipment(shipment);
    setEditForm({
      sender_name: shipment.sender_name,
      recipient_name: shipment.recipient_name,
      recipient_address: shipment.recipient_address,
      recipient_phone: shipment.recipient_phone || '',
      origin_location: shipment.origin_location,
      destination_location: shipment.destination_location,
      item_description: shipment.item_description || '',
      carrier: shipment.carrier,
      status: shipment.status,
      note: shipment.note || '',
      current_location: shipment.current_location || '',
    });
  };

  const handleUpdate = async () => {
    if (!editingShipment) return;

    await updateStatus.mutateAsync({
      id: editingShipment.id,
      status: newStatus,
      current_location: newLocation || undefined,
      note: newNote || undefined,
    });

    setEditingShipment(null);
  };

  const handleFullUpdate = async () => {
    if (!fullEditShipment) return;

    await updateShipment.mutateAsync({
      id: fullEditShipment.id,
      sender_name: editForm.sender_name,
      recipient_name: editForm.recipient_name,
      recipient_address: editForm.recipient_address,
      recipient_phone: editForm.recipient_phone || undefined,
      origin_location: editForm.origin_location,
      current_location: editForm.current_location || undefined,
      destination_location: editForm.recipient_address,
      item_description: editForm.item_description || undefined,
      carrier: editForm.carrier,
      status: editForm.status,
      note: editForm.note || undefined,
    });

    setFullEditShipment(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
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
        <p className="text-muted-foreground">
          {searchQuery ? 'No shipments match your search' : 'No shipments found'}
        </p>
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
                Actions
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(shipment)}
                      className="gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Movement
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleFullEdit(shipment)}
                      className="gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit All
                    </Button>
                  </div>
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

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(shipment)}
                className="flex-1 gap-1"
              >
                <Edit className="w-3 h-3" />
                Movement
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleFullEdit(shipment)}
                className="flex-1 gap-1"
              >
                <Pencil className="w-3 h-3" />
                Edit All
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Movement Edit Dialog */}
      <Dialog open={!!editingShipment} onOpenChange={() => setEditingShipment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Update Movement
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

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <StickyNote className="w-4 h-4" />
                Note
              </Label>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add any notes about this shipment..."
                className="min-h-[80px] resize-none"
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

      {/* Full Edit Dialog */}
      <Dialog open={!!fullEditShipment} onOpenChange={() => setFullEditShipment(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary" />
              Edit Delivery
            </DialogTitle>
            <DialogDescription>
              #{fullEditShipment?.tracking_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Sender */}
            <div className="space-y-2">
              <Label htmlFor="edit_sender_name">Sender Name</Label>
              <Input
                id="edit_sender_name"
                value={editForm.sender_name}
                onChange={(e) => handleFormChange('sender_name', e.target.value)}
                icon={<Building className="w-4 h-4" />}
              />
            </div>

            {/* Recipient */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_recipient_name">Recipient Name</Label>
                <Input
                  id="edit_recipient_name"
                  value={editForm.recipient_name}
                  onChange={(e) => handleFormChange('recipient_name', e.target.value)}
                  icon={<User className="w-4 h-4" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_recipient_address">Recipient Address</Label>
                <Input
                  id="edit_recipient_address"
                  value={editForm.recipient_address}
                  onChange={(e) => handleFormChange('recipient_address', e.target.value)}
                  icon={<MapPin className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* Time to Deliver */}
            <div className="space-y-2">
              <Label htmlFor="edit_time_to_deliver">Time to Deliver</Label>
              <Input
                id="edit_time_to_deliver"
                placeholder="e.g. 2 Hours, 3 Days"
                value={editForm.recipient_phone}
                onChange={(e) => handleFormChange('recipient_phone', e.target.value)}
                icon={<Clock className="w-4 h-4" />}
              />
            </div>

            {/* Locations */}
            <div className="space-y-2">
              <Label htmlFor="edit_origin">Origin Location</Label>
              <Input
                id="edit_origin"
                value={editForm.origin_location}
                onChange={(e) => handleFormChange('origin_location', e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
              />
            </div>

            {/* Current Location */}
            <div className="space-y-2">
              <Label htmlFor="edit_current_location">Current Location</Label>
              <Input
                id="edit_current_location"
                placeholder="e.g., Distribution Hub, Node 4"
                value={editForm.current_location}
                onChange={(e) => handleFormChange('current_location', e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
              />
            </div>

            {/* Item Description */}
            <div className="space-y-2">
              <Label htmlFor="edit_item_description">Item Description</Label>
              <div className="relative">
                <Package className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Textarea
                  id="edit_item_description"
                  value={editForm.item_description}
                  onChange={(e) => handleFormChange('item_description', e.target.value)}
                  placeholder="What is being Delivered?"
                  className="pl-10 min-h-[80px] resize-none"
                />
              </div>
            </div>

            {/* Status & Carrier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={(v) => handleFormChange('status', v)}>
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
                <Label>Carrier</Label>
                <Select value={editForm.carrier} onValueChange={(v) => handleFormChange('carrier', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CARRIER_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <StickyNote className="w-4 h-4" />
                Note
              </Label>
              <Textarea
                value={editForm.note}
                onChange={(e) => handleFormChange('note', e.target.value)}
                placeholder="Add any notes about this shipment..."
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setFullEditShipment(null)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={handleFullUpdate}
              disabled={updateShipment.isPending}
              className="flex-1"
            >
              {updateShipment.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
