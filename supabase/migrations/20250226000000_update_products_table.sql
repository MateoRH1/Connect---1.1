/*
  Recreate mercadolibre_products table with client-specific connection
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS mercadolibre_products;

-- Create new table with client-specific connection
CREATE TABLE mercadolibre_products (
  id VARCHAR(50) NOT NULL,
  client_id UUID NOT NULL REFERENCES users(id),
  titulo VARCHAR(500) NOT NULL,
  precio NUMERIC(15,2) NOT NULL,
  link TEXT NOT NULL,
  categoria VARCHAR(255) NOT NULL,
  condicion VARCHAR(50) NOT NULL,
  cantidad_disponible INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  ultima_actualizacion TIMESTAMP NOT NULL,
  imagen_principal TEXT,
  estado VARCHAR(50) NOT NULL,
  garantia VARCHAR(255),
  tipo_publicacion VARCHAR(50) NOT NULL,
  marca VARCHAR(255),
  health VARCHAR(50),
  tipo_logistica VARCHAR(50),
  es_flex BOOLEAN DEFAULT FALSE,
  es_full BOOLEAN DEFAULT FALSE,
  en_catalogo BOOLEAN DEFAULT FALSE,
  id_producto_catalogo VARCHAR(50),
  sku VARCHAR(255),
  envio_gratis BOOLEAN DEFAULT FALSE,
  costo_total_vender NUMERIC(15,2),
  porcentaje_fee NUMERIC(5,2),
  tiene_fixed_fee BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (id, client_id)
);

-- Enable RLS
ALTER TABLE mercadolibre_products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own products"
  ON mercadolibre_products
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Users can insert own products"
  ON mercadolibre_products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update own products"
  ON mercadolibre_products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- Add indexes
CREATE INDEX idx_mercadolibre_products_client_id ON mercadolibre_products(client_id);
CREATE INDEX idx_mercadolibre_products_id ON mercadolibre_products(id);
