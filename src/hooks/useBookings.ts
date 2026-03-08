import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface Booking {
  id: string;
  user_id: string;
  provider_id: string | null;
  service_id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  price: number;
  address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  service_name?: string;
  user_name?: string;
  provider_name?: string;
}

export const useBookings = () => {
  const { currentUser } = useAuth();
  const qc = useQueryClient();

  // Real-time subscription
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          qc.invalidateQueries({ queryKey: ['bookings'] });
          qc.invalidateQueries({ queryKey: ['admin-bookings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, qc]);

  return useQuery({
    queryKey: ['bookings', currentUser?.id, currentUser?.role],
    queryFn: async () => {
      let query = supabase.from('bookings').select('*, services(name)');

      if (currentUser?.role === 'user') {
        query = query.eq('user_id', currentUser.id);
      } else if (currentUser?.role === 'provider') {
        query = query.eq('provider_id', currentUser.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(b => ({
        ...b,
        service_name: (b.services as any)?.name || '',
      })) as Booking[];
    },
    enabled: !!currentUser,
  });
};

export const useCreateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (booking: {
      user_id: string;
      service_id: string;
      scheduled_date: string;
      scheduled_time: string;
      price: number;
      address: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase.from('bookings').insert(booking).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create booking');
    },
  });
};

export const useUpdateBookingStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking status updated');
    },
  });
};
