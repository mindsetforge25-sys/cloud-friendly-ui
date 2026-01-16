-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.generate_tracking_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    new_tracking TEXT;
BEGIN
    new_tracking := 'LT-' || LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0') || 'US';
    RETURN new_tracking;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_shipment_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;