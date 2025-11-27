import { DataTypes } from 'sequelize';
import sequelize from '../config.js';
const User = sequelize.define('User', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING, // Changed to DataTypes.STRING
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING, // Changed to DataTypes.STRING
        allowNull: false,
    },
    refresh_token: {
        type: DataTypes.TEXT, // Changed to DataTypes.STRING
        allowNull: true,
    },
},
    {
        timestamps: true, createdAt: 'created_at', updatedAt: false,
        hooks: {
            beforeSave: (user) => {
                if (user.email) {
                    user.email = user.email.toLowerCase();
                }
            }
        }
    }
);

export default User;