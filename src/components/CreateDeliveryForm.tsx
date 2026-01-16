import { useState } from 'react';
import { Building, User, MapPin, Clock, Package, Truck, Zap, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCreateShipment } from '@/hooks/useShipments';
import { CarrierType, CARRIER_LABELS } from '@/types/shipment';
import { toast } from 'sonner';

export function CreateDeliveryForm() {
  const createShipment = useCreateShipment();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdTrackingNumber, setCreatedTrackingNumber] = useState('');
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    sender_name: '',
    recipient_name: '',
    recipient_address: '',
    time_to_deliver: '',
    origin_location: '',
    destination_location: '',
    item_description: '',
    carrier: 'other' as CarrierType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await createShipment.mutateAsync({
        sender_name: formData.sender_name,
        recipient_name: formData.recipient_name,
        recipient_address: formData.recipient_address,
        recipient_phone: formData.time_to_deliver || undefined,
        origin_location: formData.origin_location,
        destination_location: formData.destination_location,
        item_description: formData.item_description || undefined,
        carrier: formData.carrier,
      });
      
      setCreatedTrackingNumber(result.tracking_number);
      setShowSuccessDialog(true);
      
      // Reset form
      setFormData({
        sender_name: '',
        recipient_name: '',
        recipient_address: '',
        time_to_deliver: '',
        origin_location: '',
        destination_location: '',
        item_description: '',
        carrier: 'other' as CarrierType,
      });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCopyTracking = async () => {
    await navigator.clipboard.writeText(createdTrackingNumber);
    setCopied(true);
    toast.success('Tracking number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.sender_name &&
    formData.recipient_name &&
    formData.recipient_address &&
    formData.origin_location &&
    formData.destination_location;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card border-border/50 animate-fade-in">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl sm:text-3xl font-display">Create New Delivery</CardTitle>
        <CardDescription className="text-base">
          Enter shipment details to generate a new delivery order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sender */}
          <div className="space-y-2">
            <Label htmlFor="sender_name">Sender Name</Label>
            <Input
              id="sender_name"
              placeholder="Full name or company"
              value={formData.sender_name}
              onChange={(e) => handleChange('sender_name', e.target.value)}
              icon={<Building className="w-4 h-4" />}
              required
            />
          </div>

          {/* Recipient */}
          <div className="space-y-2">
            <Label htmlFor="recipient_name">Recipient Name</Label>
            <Input
              id="recipient_name"
              placeholder="Contact person name"
              value={formData.recipient_name}
              onChange={(e) => handleChange('recipient_name', e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />
          </div>

          {/* Recipient Address */}
          <div className="space-y-2">
            <Label htmlFor="recipient_address">Recipient Address</Label>
            <Input
              id="recipient_address"
              placeholder="Enter full delivery address"
              value={formData.recipient_address}
              onChange={(e) => handleChange('recipient_address', e.target.value)}
              icon={<MapPin className="w-4 h-4" />}
              required
            />
          </div>

          {/* Time to Deliver */}
          <div className="space-y-2">
            <Label htmlFor="time_to_deliver">Time to Deliver</Label>
            <Input
              id="time_to_deliver"
              placeholder="e.g. 2 Hours, 3 Days"
              value={formData.time_to_deliver}
              onChange={(e) => handleChange('time_to_deliver', e.target.value)}
              icon={<Clock className="w-4 h-4" />}
            />
          </div>

          {/* Sender Location & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin_location">Sender Location</Label>
              <Input
                id="origin_location"
                placeholder="City, Country"
                value={formData.origin_location}
                onChange={(e) => handleChange('origin_location', e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination_location">Destination Location</Label>
              <Input
                id="destination_location"
                placeholder="City, Country"
                value={formData.destination_location}
                onChange={(e) => handleChange('destination_location', e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
                required
              />
            </div>
          </div>

          {/* Item Description */}
          <div className="space-y-2">
            <Label htmlFor="item_description">Item Description</Label>
            <div className="relative">
              <Package className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="item_description"
                placeholder="What are you shipping?"
                value={formData.item_description}
                onChange={(e) => handleChange('item_description', e.target.value)}
                className="pl-10 min-h-[80px] resize-none"
              />
            </div>
          </div>

          {/* Carrier */}
          <div className="space-y-2">
            <Label htmlFor="carrier">Shipped By</Label>
            <Select
              value={formData.carrier}
              onValueChange={(value) => handleChange('carrier', value)}
            >
              <SelectTrigger className="h-11">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a carrier" />
                </div>
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

          {/* Submit */}
          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="w-full"
            disabled={!isFormValid || createShipment.isPending}
          >
            {createShipment.isPending ? (
              'Creating...'
            ) : (
              <>
                Generate Delivery
                <Zap className="w-5 h-5 ml-1" />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground uppercase tracking-wide">
            Instant manifest and tracking ID generation
          </p>
        </form>
      </CardContent>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <Check className="w-5 h-5" />
              Delivery Created!
            </DialogTitle>
            <DialogDescription>
              Your shipment has been created successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-sm text-muted-foreground">Tracking Number</Label>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm font-medium">
                {createdTrackingNumber}
              </div>
              <Button variant="outline" size="icon" onClick={handleCopyTracking}>
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <Button variant="hero" onClick={() => setShowSuccessDialog(false)} className="w-full">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
