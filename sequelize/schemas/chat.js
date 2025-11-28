import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,  // One chat per user
        references: {
            model: 'Users',
            key: 'id_user'
        }
    },
    last_message_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    total_messages: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'chats',
    indexes: [
        {
            name: 'idx_chats_user_id',
            unique: true,
            fields: ['user_id']
        },
        {
            name: 'idx_chats_updated',
            fields: ['updated_at']
        }
    ]
});

export default Chat;
