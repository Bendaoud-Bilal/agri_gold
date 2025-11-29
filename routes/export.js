import express from 'express';
import { fetchPredictHistoryInputs, buildCsvFromInputs } from '../services/exportService.js';

const router = express.Router();

router.get('/json', async (req, res) => {
    try {
        const rows = await fetchPredictHistoryInputs();
        return res.json({ success: true, count: rows.length, rows });
    } catch (error) {
        console.error('Export JSON error:', error);
        return res.status(500).json({ success: false, error: 'Failed to export data' });
    }
});

router.get('/csv', async (req, res) => {
    try {
        const rows = await fetchPredictHistoryInputs();
        const csv = buildCsvFromInputs(rows);
        res.set('Content-Type', 'text/csv');
        res.set('Content-Disposition', 'attachment; filename="predict_history_inputs.csv"');
        return res.send(csv);
    } catch (error) {
        console.error('Export CSV error:', error);
        return res.status(500).json({ success: false, error: 'Failed to export data' });
    }
});

export default router;
