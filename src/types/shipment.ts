export type ShipmentStatus = 'ordered' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered';

export type CarrierType = 'fedex' | 'ups' | 'dhl' | 'usps' | 'other';

export interface Shipment {
  id: string;
  tracking_number: string;
  status: ShipmentStatus;
  sender_name: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string | null;
  recipient_email: string | null;
  origin_location: string;
  current_location: string | null;
  destination_location: string;
  item_description: string | null;
  carrier: CarrierType;
  created_at: string;
  updated_at: string;
}

export interface CreateShipmentData {
  sender_name: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone?: string;
  recipient_email?: string;
  origin_location: string;
  destination_location: string;
  item_description?: string;
  carrier: CarrierType;
}

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  ordered: 'Ordered',
  shipped: 'Shipped',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

export const CARRIER_LABELS: Record<CarrierType, string> = {
  fedex: 'FedEx',
  ups: 'UPS',
  dhl: 'DHL',
  usps: 'USPS',
  other: 'Other',
};

export const STATUS_ORDER: ShipmentStatus[] = ['ordered', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];
