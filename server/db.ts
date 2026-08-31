import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { ImcRecord, ImcClassification } from '../src/types';

const { Pool } = pg;

// Define storage paths
const DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_DB_FILE = path.join(DATA_DIR, 'imc_records.json');

// Ensure data directory exists for local fallback
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}

// PostgreSQL Connection Pool (if DATABASE_URL is configured)
let pgPool: pg.Pool | null = null;
let isPostgresConnected = false;

if (process.env.DATABASE_URL) {
  try {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    // Test connection and initialize table
    pgPool.query(`
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
      CREATE INDEX IF NOT EXISTS idx_imc_records_created_at ON imc_records (created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_imc_records_name ON imc_records (name);
    `).then(() => {
      isPostgresConnected = true;
      console.log('✅ PostgreSQL / Supabase connected and schema initialized successfully.');
    }).catch((err) => {
      console.warn('⚠️ PostgreSQL connection failed, falling back to local persistent storage:', err.message);
      isPostgresConnected = false;
    });
  } catch (error) {
    console.warn('⚠️ Could not initialize PostgreSQL pool, using local storage:', error);
  }
}

// Helper: Read local JSON records
function readLocalRecords(): ImcRecord[] {
  try {
    if (!fs.existsSync(LOCAL_DB_FILE)) {
      // Seed with initial sample record for demonstration if empty
      const initialData: ImcRecord[] = [
        {
          id: 'demo-record-1',
          name: 'Maria Silva',
          weight: 64.5,
          height: 165,
          imc: 23.69,
          classification: 'peso_normal',
          classificationLabel: 'Peso Normal (Eutrofia)',
          gender: 'female',
          age: 32,
          notes: 'Avaliação de rotina com exame preventivo semestral.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
        },
        {
          id: 'demo-record-2',
          name: 'Carlos Eduardo Santos',
          weight: 88.0,
          height: 176,
          imc: 28.41,
          classification: 'sobrepeso',
          classificationLabel: 'Sobrepeso (Pré-obesidade)',
          gender: 'male',
          age: 41,
          notes: 'Iniciando programa de caminhada matinal e redução de carboidratos simples.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
        }
      ];
      fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const content = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Error reading local records:', err);
    return [];
  }
}

// Helper: Write local JSON records
function writeLocalRecords(records: ImcRecord[]): void {
  try {
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local records:', err);
    throw new Error('Falha ao salvar registro no armazenamento local.');
  }
}

export const db = {
  /**
   * Check connection status
   */
  async getStatus() {
    if (pgPool && isPostgresConnected) {
      try {
        const countRes = await pgPool.query('SELECT COUNT(*) FROM imc_records');
        return {
          connected: true,
          type: 'postgres' as const,
          message: 'Conectado ao PostgreSQL / Supabase',
          recordCount: parseInt(countRes.rows[0].count, 10) || 0
        };
      } catch {
        // fall through to local
      }
    }

    const localRecords = readLocalRecords();
    return {
      connected: true,
      type: 'local_file' as const,
      message: 'Persistência em arquivo local ativo (data/imc_records.json)',
      recordCount: localRecords.length
    };
  },

  /**
   * Insert a new IMC record
   */
  async insertRecord(record: ImcRecord): Promise<ImcRecord> {
    if (pgPool && isPostgresConnected) {
      try {
        const query = `
          INSERT INTO imc_records (
            id, name, weight, height, imc, classification, classification_label, gender, age, notes, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *;
        `;
        const values = [
          record.id,
          record.name,
          record.weight,
          record.height,
          record.imc,
          record.classification,
          record.classificationLabel,
          record.gender || null,
          record.age || null,
          record.notes || null,
          record.createdAt
        ];
        await pgPool.query(query, values);
        return record;
      } catch (err) {
        console.error('PostgreSQL insert error, writing to local fallback:', err);
      }
    }

    const records = readLocalRecords();
    records.unshift(record);
    writeLocalRecords(records);
    return record;
  },

  /**
   * Fetch all records with optional search filter
   */
  async getRecords(searchQuery?: string, classification?: string): Promise<ImcRecord[]> {
    if (pgPool && isPostgresConnected) {
      try {
        let query = 'SELECT * FROM imc_records WHERE 1=1';
        const params: any[] = [];

        if (searchQuery && searchQuery.trim()) {
          params.push(`%${searchQuery.trim()}%`);
          query += ` AND name ILIKE $${params.length}`;
        }

        if (classification && classification !== 'all') {
          params.push(classification);
          query += ` AND classification = $${params.length}`;
        }

        query += ' ORDER BY created_at DESC LIMIT 100';
        const result = await pgPool.query(query, params);

        return result.rows.map((row) => ({
          id: row.id,
          name: row.name,
          weight: parseFloat(row.weight),
          height: parseFloat(row.height),
          imc: parseFloat(row.imc),
          classification: row.classification as ImcClassification,
          classificationLabel: row.classification_label,
          gender: row.gender || undefined,
          age: row.age ? parseInt(row.age, 10) : undefined,
          notes: row.notes || undefined,
          createdAt: new Date(row.created_at).toISOString()
        }));
      } catch (err) {
        console.error('PostgreSQL get error, reading local records:', err);
      }
    }

    let records = readLocalRecords();

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      records = records.filter((r) => r.name.toLowerCase().includes(q));
    }

    if (classification && classification !== 'all') {
      records = records.filter((r) => r.classification === classification);
    }

    return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Delete an IMC record by ID
   */
  async deleteRecord(id: string): Promise<boolean> {
    if (pgPool && isPostgresConnected) {
      try {
        const result = await pgPool.query('DELETE FROM imc_records WHERE id = $1', [id]);
        if (result.rowCount && result.rowCount > 0) return true;
      } catch (err) {
        console.error('PostgreSQL delete error:', err);
      }
    }

    const records = readLocalRecords();
    const initialLen = records.length;
    const filtered = records.filter((r) => r.id !== id);
    if (filtered.length !== initialLen) {
      writeLocalRecords(filtered);
      return true;
    }
    return false;
  },

  /**
   * Clear all records
   */
  async clearAll(): Promise<void> {
    if (pgPool && isPostgresConnected) {
      try {
        await pgPool.query('TRUNCATE TABLE imc_records');
      } catch (err) {
        console.error('PostgreSQL clear error:', err);
      }
    }
    writeLocalRecords([]);
  }
};
