import { PredictHistoryInput, PredictHistoryOutput } from '../sequelize/relation.js';

function toFloat(value, fallback = null) {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}

function toInt(value, fallback = null) {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }
    const num = parseInt(value, 10);
    return Number.isFinite(num) ? num : fallback;
}

function requireNumber(label, value) {
    const parsed = toFloat(value);
    if (parsed === null) {
        throw new Error(`${label} is required and must be numeric`);
    }
    return parsed;
}

function parseRanking(value) {
    if (!value) return null;
    if (typeof value === 'number') return value;
    const match = value.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
}

function deriveRegion(yieldPrediction = {}, cropRecommendation = {}) {
    return yieldPrediction.state || cropRecommendation.suitable_for || 'Unknown region';
}

function computeRevenuePerHectare(predictedYield, pricePerTon) {
    if (predictedYield == null || pricePerTon == null) return null;
    return predictedYield * pricePerTon;
}

function mapInputPayload(userId, payload) {
    return {
        user_id: userId,
        nitrogen: requireNumber('Nitrogen', payload.Nitrogen),
        phosphorus: requireNumber('Phosphorus', payload.Phosphorus),
        potassium: requireNumber('Potassium', payload.Potassium),
        temperature: requireNumber('Temperature', payload.Temperature),
        humidity: requireNumber('Humidity', payload.Humidity),
        ph: requireNumber('Ph', payload.Ph ?? payload.pH),
        rainfall: requireNumber('Rainfall', payload.Rainfall),
        state: payload.state,
        season: payload.season,
        crop_year: toInt(payload.crop_year),
        annual_rainfall: toFloat(payload.annual_rainfall),
        fertilizer: toFloat(payload.fertilizer),
        pesticide: toFloat(payload.pesticide),
        area_hectares: toFloat(payload.area_hectares)
    };
}

function mapOutputPayload(analysisData = {}) {
    const yieldPrediction = analysisData.yield_prediction || {};
    const cropRecommendation = analysisData.crop_recommendation || {};
    const agricultural = analysisData.agricultural_parameters || {};
    const alternativeCrops = analysisData.alternative_crops || [];

    const chosenCrop = yieldPrediction.crop || cropRecommendation.recommended_crop;
    const predictedYield = toFloat(yieldPrediction.predicted_yield);
    const currency = analysisData.currency || 'DZD';

    if (!chosenCrop) {
        throw new Error('Analysis data must include a recommended crop');
    }
    if (predictedYield === null) {
        throw new Error('Analysis data must include predicted_yield');
    }

    const revenueCandidate = alternativeCrops.find(crop => crop.price_per_ton && crop.predicted_yield);
    const pricePerTon = revenueCandidate ? toFloat(revenueCandidate.price_per_ton) : null;
    const revenuePerHectare = computeRevenuePerHectare(
        revenueCandidate ? toFloat(revenueCandidate.predicted_yield) : predictedYield,
        pricePerTon
    );

    return {
        best_crop: chosenCrop,
        predicted_yield: predictedYield,
        unit: yieldPrediction.unit || 'metric ton per hectare',
        region: deriveRegion(yieldPrediction, cropRecommendation),
        recommendation_basis: cropRecommendation.recommendation_basis || null,
        ranking: parseRanking(cropRecommendation.ranking),
        selection_criteria: cropRecommendation.selection_criteria || null,
        suitable_for: cropRecommendation.suitable_for || null,
        price_per_ton: pricePerTon,
        revenue_per_hectare: revenuePerHectare,
        total_area_hectares: toFloat(agricultural.area_hectares),
        total_yield_tons: toFloat(agricultural.total_yield_tons),
        total_revenue: toFloat(agricultural.total_revenue),
        currency,
        alternative_crops: alternativeCrops
    };
}

export async function createPredictInput(userId, payload) {
    if (!userId) {
        throw new Error('user_id is required');
    }
    if (!payload?.state || !payload?.season) {
        throw new Error('state and season are required');
    }

    const mapped = mapInputPayload(userId, payload);
    return PredictHistoryInput.create(mapped);
}

export async function deletePredictInput(userId, inputId) {
    const input = await PredictHistoryInput.findOne({ where: { id: inputId, user_id: userId } });

    if (!input) {
        return { success: false, error: 'Prediction input not found' };
    }

    await PredictHistoryOutput.destroy({ where: { input_id: input.id } });
    await input.destroy();

    return { success: true };
}

export async function createPredictOutput(userId, inputId, analysisPayload) {
    if (!userId) {
        throw new Error('user_id is required');
    }

    const input = await PredictHistoryInput.findOne({ where: { id: inputId, user_id: userId } });

    if (!input) {
        throw new Error('Prediction input not found for user');
    }

    const mapped = mapOutputPayload(analysisPayload);
    mapped.input_id = input.id;

    return PredictHistoryOutput.create(mapped);
}

export async function deletePredictOutput(userId, outputId) {
    const output = await PredictHistoryOutput.findOne({
        where: { id: outputId },
        include: [{ model: PredictHistoryInput, attributes: ['user_id'] }]
    });

    if (!output || output.PredictHistoryInput?.user_id !== userId) {
        return { success: false, error: 'Prediction output not found' };
    }

    await output.destroy();
    return { success: true };
}

export default {
    createPredictInput,
    deletePredictInput,
    createPredictOutput,
    deletePredictOutput
};
