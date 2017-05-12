import Sequelize from 'sequelize';
import config from '../../../config/config';

const sequelize = new Sequelize(config.dbUri);
/**
 * User Schema
 */
const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    field: 'username'
  },
  email: {
    type: Sequelize.STRING,
    unique: 'email'
  },
  password: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

export default User;
