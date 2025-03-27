/*
  # Update mercadolibre_products Table Structure

  1. Changes
    - Add new columns for enhanced product tracking
    - Modify existing columns for better data integrity
    - Add proper indexes for performance
    - Update RLS policies
*/

BEGIN;

-- Temporarily disable RLS
ALTER TABLE mercadolibre_products DISABLE ROW LEVEL SECURITY;

-- Drop existing constraints and indexes
ALTER TABLE mercadolibre_products DROP CONSTRAINT IF EXISTS mercadolibre_products_pkey;
DROP INDEX IF EXISTS idx_mercadolibre_products_client_id;
DROP INDEX IF EXISTS idx_mercadolibre_products_mla;

-- Create new table structure
CREATE TABLE IF NOT EXISTS new_mercadolibre_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mla text NOT NULL, -- MercadoLibre product ID
  client_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category_id text NOT NULL,
  price numeric(12,2) NOT NULL,
  currency_id text NOT NULL,
  available_quantity integer NOT NULL,
  sold_quantity integer NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('active', 'paused', 'closed')),
  listing_type_id text NOT NULL,
  condition text NOT NULL CHECK (condition IN ('new', 'used', 'refurbished')),
  thumbnail text,
  pictures jsonb,
  attributes jsonb,
  variations jsonb,
  shipping jsonb,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Copy data from old table
INSERT INTO new_mercadolibre_products (
  mla, client_id, title, category_id, price, currency_id,
  available_quantity, sold_quantity, status, listing_type_id,
  condition, thumbnail, pictures, attributes, variations, shipping,
  last_updated, created_at, updated_at
)
SELECT 
  mla, client_id,
  COALESCE(title, ''),
  COALESCE(category_id, ''),
  COALESCE(price, 0),
  COALESCE(currency_id, 'ARS'),
  COALESCE(available_quantity, 0),
  COALESCE(sold_quantity, 0),
  COALESCE(status, 'active'),
  COALESCE(listing_type_id, ''),
  COALESCE(condition, 'new'),
  thumbnail,
  pictures,
  attributes,
  variations,
  shipping,
  last_updated,
  created_at,
  updated_at
FROM mercadolibre_products;

-- Drop old table
DROP TABLE mercadolibre_products;

-- Rename new table
ALTER TABLE new_mercadolibre_products RENAME TO mercadolibre_products;

-- Create indexes
CREATE INDEX idx_mercadolibre_products_client_id ON mercadolibre_products(client_id);
CREATE INDEX idx_mercadolibre_products_mla ON mercadolibre_products(mla);
CREATE INDEX idx_mercadolibre_products_status ON mercadolibre_products(status);
CREATE INDEX idx_mercadolibre_products_category ON mercadolibre_products(category_id);

-- Re-enable RLS
ALTER TABLE mercadolibre_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "enable_select_for_owner"
  ON mercadolibre_products
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "enable_insert_for_owner"
  ON mercadolibre_products
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "enable_update_for_owner"
  ON mercadolibre_products
  FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

COMMIT;
