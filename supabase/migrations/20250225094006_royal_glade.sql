/*
  # Create productos table

  1. Table Structure
    - id: UUID primary key
    - nombre: Product name
    - descripcion: Product description
    - precio: Product price
    - stock: Available quantity
    - categoria: Product category
    - created_at: Timestamp
    - updated_at: Timestamp

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  precio numeric(10,2) NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  categoria text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "allow_read_own_products"
  ON productos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_insert_own_products"
  ON productos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "allow_update_own_products"
  ON productos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add indexes
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_categoria ON productos(categoria);
