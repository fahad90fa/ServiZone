CREATE POLICY "Providers can view unassigned bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  provider_id IS NULL
  AND status IN ('pending', 'confirmed')
  AND has_role(auth.uid(), 'provider'::app_role)
);

-- Allow providers to claim/assign themselves to unassigned bookings
CREATE POLICY "Providers can claim unassigned bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (
  provider_id IS NULL
  AND has_role(auth.uid(), 'provider'::app_role)
);