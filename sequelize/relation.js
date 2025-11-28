import User from "./schemas/user.js";
import Field from "./schemas/field.js";
import Prediction from "./schemas/prediction.js";
// Define associations
User.hasMany(Field, { foreignKey: 'id_user' });
Field.belongsTo(User, { foreignKey: 'id_user' });
Field.hasMany(Prediction, { foreignKey: 'id_field' });
Prediction.belongsTo(Field, { foreignKey: 'id_field' });
User.hasMany(Prediction, { foreignKey: 'id_user' });
Prediction.belongsTo(User, { foreignKey: 'id_user' });
export { User, Field, Prediction };