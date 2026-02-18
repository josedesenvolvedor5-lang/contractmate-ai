
-- Create templates table
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'contratos',
  content TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Anyone can read templates
CREATE POLICY "Templates are publicly readable"
  ON public.templates FOR SELECT
  USING (true);

-- Anyone can insert templates (no auth required for simplicity)
CREATE POLICY "Anyone can create templates"
  ON public.templates FOR INSERT
  WITH CHECK (true);

-- Anyone can update templates
CREATE POLICY "Anyone can update templates"
  ON public.templates FOR UPDATE
  USING (true);

-- Anyone can delete templates
CREATE POLICY "Anyone can delete templates"
  ON public.templates FOR DELETE
  USING (true);
