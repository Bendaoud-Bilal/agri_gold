import { PredictHistoryInput } from '../sequelize/relation.js';

const INPUT_FIELDS = [
    'id',
    'user_id',
    'nitrogen',
    'phosphorus',
    'potassium',
    'temperature',
    'humidity',
    'ph',
    'rainfall',
    'state',
    'season',
    'crop_year',
    'annual_rainfall',
    'fertilizer',
    'pesticide',
    'area_hectares',
    'created_at'
];

export async function fetchPredictHistoryInputs() {
    return PredictHistoryInput.findAll({
        order: [
            ['user_id', 'ASC'],
            ['created_at', 'ASC']
        ],
        raw: true
    });
}

function escapeCsvValue(value) {
    if (value === null || value === undefined) {
        return '';
    }
    const stringValue = String(value);
    return /[",\n]/.test(stringValue)
        ? `"${stringValue.replace(/"/g, '""')}"`
        : stringValue;
}

export function buildCsvFromInputs(rows) {
    const header = INPUT_FIELDS.join(',');
    const data = rows.map(row => INPUT_FIELDS.map(field => escapeCsvValue(row[field])).join(','));
    return [header, ...data].join('\n');
}

export default {
    fetchPredictHistoryInputs,
    buildCsvFromInputs
};
