import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'chats',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    message_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_message: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: 'true = user message, false = bot message'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'messages',
    indexes: [
        {
            name: 'idx_messages_chat_created',
            fields: ['chat_id', { attribute: 'created_at', order: 'DESC' }]
        },
        {
            name: 'idx_messages_created',
            fields: [{ attribute: 'created_at', order: 'DESC' }]
        }
    ]
});

export default Message;
