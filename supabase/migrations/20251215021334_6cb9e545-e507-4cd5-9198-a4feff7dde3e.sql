-- Add policy to allow product owners to update affiliations for their products
CREATE POLICY "Product owners can update affiliations for their products"
ON public.affiliations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = affiliations.product_id 
    AND products.owner_id = auth.uid()
  )
);

-- Add policy to allow product owners to view affiliations for their products
CREATE POLICY "Product owners can view affiliations for their products"
ON public.affiliations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = affiliations.product_id 
    AND products.owner_id = auth.uid()
  )
);