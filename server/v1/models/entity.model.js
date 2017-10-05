import Sequelize from 'sequelize';
import config from '../../../config/config';

const sequelize = new Sequelize(config.dbUri, { logging: false });
/**
 * User Schema
 */
const Entity = sequelize.define('Entity', {
  name: {
    type: Sequelize.STRING,
    field: 'name_entity',
    unique: 'name_entity'
  },
  display_name: {
    type: Sequelize.STRING,
    field: 'display_name_entity',
    unique: 'display_name_entity'
  },
  visible: {
    type: Sequelize.BOOLEAN,
    field: 'visible'
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Entity.sync();
export default Entity;
