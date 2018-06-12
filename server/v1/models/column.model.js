import Sequelize from 'sequelize';
import config from '../../../config/config';
import Entity from './entity.model';

const sequelize = new Sequelize(config.dbUri, { logging: false });
/**
 * User Schema
 */
const Column = sequelize.define('Column', {
  name: {
    type: Sequelize.STRING,
    field: 'column_name'
  },
  display_name: {
    type: Sequelize.STRING,
    field: 'display_column_name',
    unique: 'display_column_name'
  },
  type: {
    type: Sequelize.INTEGER,
    field: 'colum_type'
  },
  base_table: {
    type: Sequelize.STRING,
    field: 'base_table'
  },
  second_table: {
    type: Sequelize.STRING,
    field: 'second_table'
  },
  date_column:{
    type: Sequelize.STRING,
    field: 'date_column'
  },
  // It is possible to create foreign keys:
  entity_id: {
    type: Sequelize.INTEGER,
    references: {
      // This is a reference to another model
      model: Entity,

      // This is the column name of the referenced model
      key: 'id',

      // This declares when to check the foreign key constraint. PostgreSQL only.
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Column.sync();
export default Column;
