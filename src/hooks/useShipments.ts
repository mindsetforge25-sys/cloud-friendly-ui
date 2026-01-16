import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Shipment, CreateShipmentData, ShipmentStatus, CarrierType } from '@/types/shipment';
import { toast } from 'sonner';

export function useShipment(trackingNumber: string | null) {
  return useQuery({
    queryKey: ['shipment', trackingNumber],
    queryFn: async () => {
      if (!trackingNumber) return null;

      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_number', trackingNumber)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data as Shipment;
    },
    enabled: !!trackingNumber,
  });
}

export function useAllShipments() {
  return useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Shipment[];
    },
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shipmentData: CreateShipmentData) => {
      // Generate tracking number
      const trackingNumber = 'LT-' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0') + 'US';

      const { data, error } = await supabase
        .from('shipments')
        .insert({
          ...shipmentData,
          tracking_number: trackingNumber,
          status: 'ordered' as ShipmentStatus,
          current_location: shipmentData.origin_location,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Shipment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create shipment: ' + error.message);
    },
  });
}

export function useUpdateShipmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, current_location, note }: { id: string; status: ShipmentStatus; current_location?: string; note?: string }) => {
      const updateData: { status: ShipmentStatus; current_location?: string; note?: string } = { status };
      if (current_location) {
        updateData.current_location = current_location;
      }
      if (note !== undefined) {
        updateData.note = note;
      }

      const { data, error } = await supabase
        .from('shipments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Shipment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['shipment', data.tracking_number] });
      toast.success('Shipment status updated!');
    },
    onError: (error) => {
      toast.error('Failed to update shipment: ' + error.message);
    },
  });
}

export interface UpdateShipmentData {
  id: string;
  sender_name?: string;
  recipient_name?: string;
  recipient_address?: string;
  recipient_phone?: string;
  origin_location?: string;
  current_location?: string;
  destination_location?: string;
  item_description?: string;
  carrier?: CarrierType;
  status?: ShipmentStatus;
  note?: string;
}

export function useUpdateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: UpdateShipmentData) => {
      const { id, ...fields } = updateData;

      const { data, error } = await supabase
        .from('shipments')
        .update(fields)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Shipment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['shipment', data.tracking_number] });
      toast.success('Shipment updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update shipment: ' + error.message);
    },
  });
}

