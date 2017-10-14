import httpStatus from 'http-status';
import sqlClient from 'squel'

import Sequelize from 'sequelize';
import config from '../../../config/config';

const sequelize = new Sequelize(config.dbUriG, { logging: false });

const selectWithOutOperation = "select {0}";
const fromWithOutJoins = "from {0}";
const groupBy = "group by {0}";

const replaceAll = (search, replacement, target) => {
    return target.split(search).join(replacement);
}

const baseQueryHandler = (baseColumn, operation, column) => {
    let sqlOperation = "";
    if(column.second_table != "dim_fecha" && baseColumn.second_table != "dim_fecha"){
        switch(operation.name){
            case "Contar": {
                sqlOperation = "COUNT(" + 'q.' + column.name + ") as value"
                break;
            }
            case "Sumar":{
                sqlOperation = "SUM(" + 'q.' + column.name + ") as value"
                break;
            }
            case "Promedio":{
                sqlOperation = "AVG(" + 'q.' + column.name + ") as value"
                break;
            }
            default: {
                break;              
            } 
        }
        let sqlColumn = column.name;
        let calculateColumn = "q." + baseColumn.name;
        let groupBy =  calculateColumn;
        let selectFrom = sqlClient.select().distinct().field(column.name).field(baseColumn.name).from("consolidated_table");
        let query = sqlClient.select().field(sqlOperation).field(calculateColumn).from(selectFrom, "q").group(groupBy);

        return query.toString();
    }
    else if (column.second_table != "dim_fecha" && baseColumn.second_table == "dim_fecha"){
        let sqlOperation = "";
        switch(operation.name){
            case "Contar": {
                sqlOperation = "COUNT(" + 'q.' + column.name + ") as value"
                break;
            }
            case "Sumar":{
                sqlOperation = "SUM(" + 'q.' + column.name + ") as value"
                break;
            }
            case "Promedio":{
                sqlOperation = "AVG(" + 'q.' + column.name + ") as value"
                break;
            }
            default: {
                break;              
            }
        } 

        let joinDateField = "b." + baseColumn.date_column;
        let joinOpFielf = "a." + column.name;
        let joinCondition = "a." + baseColumn.name + "=" + "b.id_fecha";
        let sqlColumn = column.date_column;
        let displayColumn = "q." +  baseColumn.date_column;
        let groupBy = displayColumn;
        let selectFrom = sqlClient.select().distinct().field(joinOpFielf).field(joinDateField).from("consolidated_table","a").join("dim_fecha","b",joinCondition);
        let query = sqlClient.select().field(sqlOperation).field(displayColumn).from(selectFrom, "q").group(groupBy);
        return query.toString();
    }
    else if (column.second_table == "dim_fecha" && baseColumn.second_table != "dim_fecha"){
        let sqlOperation = "";
        switch(operation.name){
            case "Contar": {
                sqlOperation = "COUNT(" + 'q.' + column.date_column + ") as value"
                break;
            }
            case "Sumar":{
                sqlOperation = "SUM(" + 'q.' + column.date_column + ") as value"
                break;
            }
            case "Promedio":{
                sqlOperation = "AVG(" + 'q.' + column.date_column + ") as value"
                break;
            }
            default: {
                break;              
            }
        } 

        let joinDateField = "b." + column.name ;
        let joinOpFielf = "a." + baseColumn.name;
        let joinCondition = "a." + column.name + "=" + "b.id_fecha";
        let realColumn = "b." + column.date_column;
        let sqlColumn = column.name;
        let displayColumn = "q." +  baseColumn.name;
        let groupBy = displayColumn;
        let selectFrom = sqlClient.select().distinct().field(joinOpFielf).field(realColumn).from("consolidated_table","a").join("dim_fecha","b",joinCondition);
        let query = sqlClient.select().field(sqlOperation).field(displayColumn).from(selectFrom, "q").group(groupBy);
        return query.toString();
    }else{
        let sqlOperation = "";
        switch(operation.name){
            case "Contar": {
                sqlOperation = "COUNT(" + 'q.' + column.date_column + ") as value"
                break;
            }
            case "Sumar":{
                sqlOperation = "SUM(" + 'q.' + column.date_column + ") as value"
                break;
            }
            case "Promedio":{
                sqlOperation = "AVG(" + 'q.' + column.date_column + ") as value"
                break;
            }
            default: {
                break;              
            }
        } 

        let joinDateField = "b." + column.name ;
        let joinOpFielf = "a." + baseColumn.name;
        let joinCondition = "a." + column.name + "=" + "b.id_fecha";
        let realColumn = "b." + column.date_column;
        let sqlColumn = column.name;
        let displayColumn = "q." +  baseColumn.date_column;
        let groupBy = displayColumn;
        let selectFrom = sqlClient.select().distinct().field(joinOpFielf).field(realColumn).from("consolidated_table","a").join("dim_fecha","b",joinCondition);
        let query = sqlClient.select().field(sqlOperation).field(displayColumn).from(selectFrom, "q").group(groupBy);
        return query.toString();
    }


    
    
};

const getDataForPreview = async(req, res) => {
    try{
        
        const filters = req.body.definition.filters;
        
        const dateFilters = req.body.definition.dateFilters;
        let baseQuery = "";

        //Base Query data
        let baseColumn = req.body.definition.baseColumn;
        let category = req.body.definition.category;
        baseQuery = baseQueryHandler(baseColumn, category.operation, category.column);


        //Filters data
        const filterColumns = []
        const filterOperations = []
        
        if(filters.length > 0){
            filters.forEach(function(item, index){
                if(item.column =! null && item.operation != null){
                    filterColumns.push(item.column);
                    filterOperations.push(item.operation);
                }
            });
        }

        //Date Filter Data


        //Run query
        
        let queryString = replaceAll("`","",baseQuery);   
        const data = await sequelize.query(queryString);
        
        return res.json(data);
    }
    catch (e) {
        console.log(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e);
    }

}

export default {
    getDataForPreview
  };
  