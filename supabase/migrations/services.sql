CREATE POLICY "Providers can insert services"
ON public.services
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'provider'::app_role));