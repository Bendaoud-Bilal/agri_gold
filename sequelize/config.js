import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
let sequelize;
if (process.env.NODE_ENV == 'development') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // This line will fix potential certificate issues
            }
        }
    });
} else {
    sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
        host: process.env.DATABASE_HOST,
        dialect: 'postgres',
        port: process.env.DATABASE_PORT || 5432,
        logging: false
    });
}

export default sequelize;