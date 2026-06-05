-- =============================================
-- ELETROMANIA DISTRIBUIDORA - Setup Supabase
-- Execute este SQL no Supabase > SQL Editor
-- =============================================

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT DEFAULT 'Tag',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissões públicas de leitura (site)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura publica categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Leitura publica products" ON products FOR SELECT USING (visible = true);

-- Permissões completas para operações do admin (anon key)
CREATE POLICY "Admin insert categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Admin delete categories" ON categories FOR DELETE USING (true);

CREATE POLICY "Admin insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (true);
CREATE POLICY "Admin select all products" ON products FOR SELECT USING (true);
