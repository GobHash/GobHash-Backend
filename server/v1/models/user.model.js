import Sequelize from 'sequelize';
import config from '../../../config/config';

const sequelize = new Sequelize(config.dbUri, { logging: false });
/**
 * User Schema
 */
const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    field: 'username',
    unique: 'username'
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  resetPasswordToken: {
    type: Sequelize.STRING
  },
  resetPasswordExpiration: {
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

export default User;
