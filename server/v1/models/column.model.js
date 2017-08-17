import Sequelize from 'sequelize';
import config from '../../../config/config';

const sequelize = new Sequelize(config.dbUri, { logging: true });
/**
 * User Schema
 */
import Entity from './entity.model'

const Column = sequelize.define('Column', {
  name: {
    type: Sequelize.STRING,
    field: 'column_name',
    unique: 'column_name'
  },
  type: {
    type: Sequelize.INTEGER,
    field: 'colum_type'
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

console.log('test')
Column.sync();
export default Column;
