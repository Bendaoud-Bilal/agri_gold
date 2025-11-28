import express from 'express';
import { sendMessage, getMessages, deleteMessage } from '../services/chatbotService.js';

const router = express.Router();

/**
 * POST /api/chatbot/messages
 * Send a message to the chatbot and get AI response
 */
router.post('/messages', async (req, res) => {
    try {
        const {
            user_id,
            message
        } = req.body;

        // Validation
        if (!user_id || !message) {
            return res.status(400).json({
                success: false,
                error: 'user_id and message are required'
            });
        }

        if (typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'message must be a non-empty string'
            });
        }

        // Process message
        const result = await sendMessage(user_id, message);

        return res.json(result);

    } catch (error) {
        console.error('Message API error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * GET /api/chatbot/messages
 * Get paginated messages (newest first, inverse order)
 */
router.get('/messages', async (req, res) => {
    try {
        const rawUserId = req.query.user_id ?? req.get('x-user-id') ?? req.body?.user_id;
        const userId = parseInt(rawUserId);

        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID'
            });
        }

        const rawLimit = req.query.limit ?? req.body.limit;
        const rawBefore = req.query.before ?? req.body.before;
        const limit = rawLimit ? parseInt(rawLimit) : 50;
        const before = rawBefore ? parseInt(rawBefore) : null;

        const result = await getMessages(userId, { limit, before });

        return res.json(result);

    } catch (error) {
        console.error('Get messages API error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

/**
 * DELETE /api/chatbot/messages/:messageId
 * Delete a specific message for the user
 */
router.delete('/messages/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { user_id } = req.body;
        const parsedUserId = parseInt(user_id);
        const parsedMessageId = parseInt(messageId);

        if (isNaN(parsedUserId) || isNaN(parsedMessageId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user or message ID'
            });
        }

        const result = await deleteMessage(parsedUserId, parsedMessageId);

        if (!result.success) {
            const status = result.error === 'Message not found' ? 404 : 400;
            return res.status(status).json(result);
        }

        return res.json(result);

    } catch (error) {
        console.error('Delete message API error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

export default router;
