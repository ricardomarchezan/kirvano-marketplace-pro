-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  commission NUMERIC(5,2) NOT NULL DEFAULT 0,
  model TEXT NOT NULL CHECK (model IN ('recurring', 'whitelabel')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  image_url TEXT,
  video_url TEXT,
  webhook_url TEXT,
  github_url TEXT,
  auto_approve_affiliates BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  producer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  amount NUMERIC(10,2) NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'refunded', 'chargeback')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'refund', 'withdrawal')),
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliations table
CREATE TABLE public.affiliations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliations ENABLE ROW LEVEL SECURITY;

-- Products RLS policies
CREATE POLICY "Users can view all products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can create own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own products" ON public.products FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own products" ON public.products FOR DELETE USING (auth.uid() = owner_id);

-- Sales RLS policies (producer or affiliate can view)
CREATE POLICY "Users can view own sales" ON public.sales FOR SELECT USING (auth.uid() = producer_id OR auth.uid() = affiliate_id);
CREATE POLICY "Users can create sales for own products" ON public.sales FOR INSERT WITH CHECK (auth.uid() = producer_id);

-- Transactions RLS policies
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Affiliations RLS policies
CREATE POLICY "Users can view own affiliations" ON public.affiliations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create affiliations" ON public.affiliations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own affiliations" ON public.affiliations FOR UPDATE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();