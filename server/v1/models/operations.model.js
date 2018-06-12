import Sequelize from 'sequelize';
import config from '../../../config/config';

const sequelize = new Sequelize(config.dbUri, { logging: false });
/**
 * User Schema
 */
const Operation = sequelize.define('Operation', {
  name: {
    type: Sequelize.STRING,
    field: 'operation_name'
  },
  type: {
    type: Sequelize.INTEGER,
    field: 'operation_type'
  },
  value_type: {
    type: Sequelize.INTEGER,
    field: 'operation_value_type'
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Operation.sync();
export default Operation;
