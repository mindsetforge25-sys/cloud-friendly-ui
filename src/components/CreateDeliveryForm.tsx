import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, User, MapPin, Phone, Mail, Package, Truck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCreateShipment } from '@/hooks/useShipments';
import { CarrierType, CARRIER_LABELS } from '@/types/shipment';

export function CreateDeliveryForm() {
  const navigate = useNavigate();
  const createShipment = useCreateShipment();

  const [formData, setFormData] = useState({
    sender_name: '',
    recipient_name: '',
    recipient_address: '',
    recipient_phone: '',
    recipient_email: '',
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
        recipient_phone: formData.recipient_phone || undefined,
        recipient_email: formData.recipient_email || undefined,
        origin_location: formData.origin_location,
        destination_location: formData.destination_location,
        item_description: formData.item_description || undefined,
        carrier: formData.carrier,
      });
      
      navigate(`/track/${result.tracking_number}`);
    } catch (error) {
      // Error is handled by the mutation
    }
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

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipient_phone">Recipient Phone Number</Label>
              <Input
                id="recipient_phone"
                placeholder="+1 (555) 000-0000"
                value={formData.recipient_phone}
                onChange={(e) => handleChange('recipient_phone', e.target.value)}
                icon={<Phone className="w-4 h-4" />}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient_email">Email</Label>
              <Input
                id="recipient_email"
                type="email"
                placeholder="recipient@example.com"
                value={formData.recipient_email}
                onChange={(e) => handleChange('recipient_email', e.target.value)}
                icon={<Mail className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin_location">Origin Location</Label>
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
    </Card>
  );
}
