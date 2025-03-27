CREATE TABLE mercadolibre_orders (
    order_id TEXT PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES users(id),
    publicacion_id TEXT NOT NULL,
    -- ... (resto de las columnas se mantienen igual) ...
    
    -- Clave foránea compuesta que referencia la tabla de productos
    FOREIGN KEY (publicacion_id, client_id) 
    REFERENCES mercadolibre_products(id, client_id)
    ON DELETE CASCADE
);

-- Habilitar RLS
ALTER TABLE mercadolibre_orders ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can read own orders"
  ON mercadolibre_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Users can insert own orders"
  ON mercadolibre_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

-- Índices para mejor performance
CREATE INDEX idx_orders_client_id ON mercadolibre_orders(client_id);
CREATE INDEX idx_orders_publicacion_id ON mercadolibre_orders(publicacion_id);
