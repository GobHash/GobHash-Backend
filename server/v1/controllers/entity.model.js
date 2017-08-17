import Sequelize from 'sequelize';
import config from '../../../config/config';

const sequelize = new Sequelize(config.dbUri, { logging: true });
/**
 * User Schema
 */
const Entity = sequelize.define('Entity', {
  name: {
    type: Sequelize.STRING,
    field: 'name_entity',
    unique: 'name_entity'
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

console.log('test')
Entity.sync();
export default Entity;
