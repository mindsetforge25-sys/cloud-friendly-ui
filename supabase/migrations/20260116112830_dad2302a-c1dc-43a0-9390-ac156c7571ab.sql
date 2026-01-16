-- Create enum for shipment status
CREATE TYPE public.shipment_status AS ENUM ('ordered', 'shipped', 'in_transit', 'out_for_delivery', 'delivered');

-- Create enum for carrier
CREATE TYPE public.carrier_type AS ENUM ('fedex', 'ups', 'dhl', 'usps', 'other');

-- Create shipments table
CREATE TABLE public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_number TEXT NOT NULL UNIQUE,
    status shipment_status NOT NULL DEFAULT 'ordered',
    sender_name TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_address TEXT NOT NULL,
    recipient_phone TEXT,
    recipient_email TEXT,
    origin_location TEXT NOT NULL,
    current_location TEXT,
    destination_location TEXT NOT NULL,
    item_description TEXT,
    carrier carrier_type NOT NULL DEFAULT 'other',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Public read policy for tracking (anyone can track a shipment by number)
CREATE POLICY "Anyone can view shipments by tracking number"
ON public.shipments
FOR SELECT
USING (true);

-- Public insert policy (anyone can create a shipment for demo purposes)
CREATE POLICY "Anyone can create shipments"
ON public.shipments
FOR INSERT
WITH CHECK (true);

-- Public update policy (for demo purposes)
CREATE POLICY "Anyone can update shipments"
ON public.shipments
FOR UPDATE
USING (true);

-- Create function to generate tracking number
CREATE OR REPLACE FUNCTION public.generate_tracking_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_tracking TEXT;
BEGIN
    new_tracking := 'LT-' || LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0') || 'US';
    RETURN new_tracking;
END;
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_shipment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_shipments_updated_at
BEFORE UPDATE ON public.shipments
FOR EACH ROW
EXECUTE FUNCTION public.update_shipment_updated_at();