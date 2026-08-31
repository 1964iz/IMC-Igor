import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db';
import { calculateImc, getImcClassificationInfo, sanitizeString } from '../../src/utils/imc';
import { ImcRecord, ImcClassification } from '../../src/types';

export const imcRouter = Router();

/**
 * POST /api/imc
 * Validates, calculates, classifies, and persists IMC evaluation
 */
imcRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, weight, height, gender, age, notes } = req.body;

    // Validation
    const cleanName = sanitizeString(name);
    if (!cleanName || cleanName.length < 2) {
      res.status(400).json({ error: 'O nome do usuário é obrigatório e deve ter no mínimo 2 caracteres.' });
      return;
    }

    const numWeight = parseFloat(weight);
    if (isNaN(numWeight) || numWeight < 10 || numWeight > 500) {
      res.status(400).json({ error: 'Informe um peso válido em kg (entre 10kg e 500kg).' });
      return;
    }

    let numHeight = parseFloat(height);
    if (isNaN(numHeight) || numHeight <= 0) {
      res.status(400).json({ error: 'Informe uma altura válida.' });
      return;
    }

    // Standardize height to cm if entered in meters (e.g. 1.75 -> 175)
    if (numHeight < 3.0) {
      numHeight = Math.round(numHeight * 100);
    }

    if (numHeight < 40 || numHeight > 260) {
      res.status(400).json({ error: 'Informe uma altura realista em centímetros (entre 40cm e 260cm).' });
      return;
    }

    // Optional age validation
    let validAge: number | undefined;
    if (age !== undefined && age !== null && age !== '') {
      const parsedAge = parseInt(age, 10);
      if (!isNaN(parsedAge) && parsedAge >= 1 && parsedAge <= 120) {
        validAge = parsedAge;
      }
    }

    // Calculate IMC
    const imc = calculateImc(numWeight, numHeight);
    const classificationInfo = getImcClassificationInfo(imc);

    const record: ImcRecord = {
      id: crypto.randomUUID ? crypto.randomUUID() : `imc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: cleanName,
      weight: Number(numWeight.toFixed(2)),
      height: Number(numHeight.toFixed(1)),
      imc,
      classification: classificationInfo.key,
      classificationLabel: classificationInfo.label,
      gender: gender === 'male' || gender === 'female' || gender === 'other' ? gender : undefined,
      age: validAge,
      notes: notes ? sanitizeString(notes) : undefined,
      createdAt: new Date().toISOString()
    };

    const savedRecord = await db.insertRecord(record);

    res.status(201).json({
      success: true,
      data: savedRecord,
      classificationInfo
    });
  } catch (error: any) {
    console.error('Error saving IMC record:', error);
    res.status(500).json({ error: 'Erro interno ao processar e salvar a avaliação de IMC.' });
  }
});

/**
 * GET /api/imc
 * Retrieves list of IMC records with optional search query & filter
 */
imcRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const q = req.query.q as string | undefined;
    const classification = req.query.classification as string | undefined;
    const records = await db.getRecords(q, classification);

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error: any) {
    console.error('Error listing IMC records:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de avaliações.' });
  }
});

/**
 * GET /api/imc/stats
 * Provides overview statistics
 */
imcRouter.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const records = await db.getRecords();
    const total = records.length;

    const classificationsCount: Record<ImcClassification, number> = {
      abaixo_peso: 0,
      peso_normal: 0,
      sobrepeso: 0,
      obesidade_grau_1: 0,
      obesidade_grau_2: 0,
      obesidade_grau_3: 0
    };

    let totalImc = 0;
    records.forEach((r) => {
      totalImc += r.imc;
      if (classificationsCount[r.classification] !== undefined) {
        classificationsCount[r.classification]++;
      }
    });

    const averageImc = total > 0 ? Number((totalImc / total).toFixed(2)) : 0;

    res.json({
      success: true,
      stats: {
        total,
        averageImc,
        classificationsCount,
        latestRecord: records[0] || null
      }
    });
  } catch (error: any) {
    console.error('Error fetching IMC stats:', error);
    res.status(500).json({ error: 'Erro ao calcular estatísticas.' });
  }
});

/**
 * DELETE /api/imc/:id
 * Removes a record
 */
imcRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteRecord(id);
    if (!deleted) {
      res.status(404).json({ error: 'Registro não encontrado para exclusão.' });
      return;
    }

    res.json({ success: true, message: 'Registro excluído com sucesso.' });
  } catch (error: any) {
    console.error('Error deleting IMC record:', error);
    res.status(500).json({ error: 'Erro ao excluir registro.' });
  }
});

/**
 * GET /api/db-status
 * Status of database connection and records count
 */
imcRouter.get('/db-status', async (_req: Request, res: Response): Promise<void> => {
  try {
    const status = await db.getStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({
      connected: false,
      type: 'local_file',
      message: 'Erro ao verificar banco de dados',
      recordCount: 0
    });
  }
});
