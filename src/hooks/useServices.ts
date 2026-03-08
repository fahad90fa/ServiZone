import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  category_id: string;
  category_name?: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  review_count: number;
  image_url: string;
  is_popular: boolean;
  is_active: boolean;
}

export const useCategories = () => useQuery({
  queryKey: ['categories'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data as ServiceCategory[];
  },
});

export const useServices = () => useQuery({
  queryKey: ['services'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*, service_categories(name)')
      .eq('is_active', true)
      .order('is_popular', { ascending: false });
    if (error) throw error;
    return (data || []).map(s => ({
      ...s,
      category_name: (s.service_categories as any)?.name || '',
    })) as Service[];
  },
});

export const useService = (id: string) => useQuery({
  queryKey: ['service', id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*, service_categories(name)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return {
      ...data,
      category_name: (data.service_categories as any)?.name || '',
    } as Service;
  },
  enabled: !!id,
});

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (service: {
      name: string;
      description: string;
      price: number;
      duration: string;
      category_id: string;
    }) => {
      const { data, error } = await supabase
        .from('services')
        .insert([{ ...service, is_active: true }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};
