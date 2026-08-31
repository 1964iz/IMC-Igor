-- =========================================================================
-- SCHEMA SQL: Calculadora de IMC (PostgreSQL / Supabase / Neon / Render)
-- =========================================================================

-- Criação da tabela de registros de avaliações de IMC
CREATE TABLE IF NOT EXISTS imc_records (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    weight NUMERIC(5,2) NOT NULL,
    height NUMERIC(5,2) NOT NULL,
    imc NUMERIC(5,2) NOT NULL,
    classification VARCHAR(32) NOT NULL,
    classification_label VARCHAR(64) NOT NULL,
    gender VARCHAR(16),
    age INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para buscas rápidas por data e nome de paciente
CREATE INDEX IF NOT EXISTS idx_imc_records_created_at ON imc_records (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_imc_records_name ON imc_records (name);
CREATE INDEX IF NOT EXISTS idx_imc_records_classification ON imc_records (classification);

-- Exemplo de inserção para teste inicial (opcional):
-- INSERT INTO imc_records (id, name, weight, height, imc, classification, classification_label, gender, age, notes)
-- VALUES ('demo-1', 'Ana Beatriz Lima', 62.0, 168.0, 21.97, 'peso_normal', 'Peso Normal (Eutrofia)', 'female', 28, 'Avaliação nutricional de rotina.');
