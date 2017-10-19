import httpStatus from 'http-status';
import sqlClient from 'squel'

import Sequelize from 'sequelize';
import config from '../../../config/config';

const sequelize = new Sequelize(config.dbUriG, {
  define: {
    charset: 'utf8mb4',
    collate: 'utf8_general_ci',
    timestamps: true
  },
  logging: false
});

const selectWithOutOperation = "select {0}";
const fromWithOutJoins = "from {0}";
const groupBy = "group by {0}";

const replaceAll = (search, replacement, target) => {
    return target.split(search).join(replacement);
}
const buildConstraints = (baseQuery, columns, operations, values, baseColumnDate, operationColumnDate) => {
    for(let x = 0; x < columns.length; x++){
        let column = columns[x];
        let operation = operations[x];
        let value = values[x];
        let condition = ""
        if(!baseColumnDate && !operationColumnDate){
            baseQuery = baseQuery.where(buildOperation(column, value, operation));
        }
    }
    return baseQuery;
}

const buildOperation = (column, value, operation) =>{
    let sentence = ""
    if(operation.value_type == 1){
        switch(operation.name){
            case "Igual a": {
                sentence = "a." + column.name + "=" + "'" + value + "'";;
                return sentence;
            }
            case "Diferente de":{
                sentence ="a."  + column.name + "!=" + "'" + value + "'";
                return sentence;
            }
            case "Contiene":{
                sentence = "a." + column.name + " like " + "'" + "%" + value + "%" + "'";
                return sentence;
            }
            
            default:{
                break;
            }
        }
    }
    if(operation.value_type == 2 || operation.value_type == 4){
        switch(operation.name){
            case "Mayor que":{
                sentence = "a." + column.name + ">" + value;
                return sentence;
            }
            case "Menor que": {
                sentence = "a." + column.name + "<" + value;
                return sentence;
            }
            case "Igual a": {
                sentence = "a." + column.name + "="  + value ;
                return sentence;
            }
            case "Diferente de":{
                sentence ="a."  + column.name + "!=" + value;
                return sentence;
            }
        }
        
    }
    
}

const baseQueryHandler = (baseColumn, operation, column, filterList) => {
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
        let selectFrom = "";
        if( baseColumn.name == "monto" || column.name == "monto"){
            selectFrom = sqlClient.select().distinct().field("a.nit_proveedor").field("a.nog").field("a." + column.name).field("a."+baseColumn.name).from("consolidated_table","a").join("dim_fecha","b","b.id_fecha = a.fecha_adjudicada");
        }
        else{
            selectFrom = sqlClient.select().distinct().field("a.nog").field("a." + column.name).field("a."+baseColumn.name).from("consolidated_table","a").join("dim_fecha","b","b.id_fecha = a.fecha_adjudicada")
        }
        if(filterList[0] != undefined){
            if (filterList[0].length > 0){
                selectFrom = buildConstraints(selectFrom, filterList[0], filterList[1], filterList[2], false, false)
            }
        }
       
        let query = sqlClient.select().field(sqlOperation).field(calculateColumn).from(selectFrom, "q")
        
        query = query.group(groupBy);

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
        let selectFrom = "";
        if( baseColumn.name == "monto" || column.name == "monto"){
            selectFrom = sqlClient.select().distinct().field("a.nit_proveedor").field("a.nog").field(joinOpFielf).field(joinDateField).from("consolidated_table","a").join("dim_fecha","b",joinCondition);
        }
        else{
            selectFrom = sqlClient.select().distinct().field("a.nog").field(joinOpFielf).field(joinDateField).from("consolidated_table","a").join("dim_fecha","b",joinCondition);
        }
        if(filterList[0] != undefined){
            if (filterList[0].length > 0){
                selectFrom = buildConstraints(selectFrom, filterList[0], filterList[1], filterList[2], false, false)
            }
        }
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
        let selectFrom = "";
        if( baseColumn.name == "monto" || column.name == "monto"){
            selectFrom = sqlClient.select().distinct().field("a.nit_proveedor").field("a.nog").field(joinOpFielf).field(realColumn).from("consolidated_table","a").join("dim_fecha","b",joinCondition);
        }
        else{
            selectFrom = sqlClient.select().distinct().field("a.nog").field(joinOpFielf).field(realColumn).from("consolidated_table","a").join("dim_fecha","b",joinCondition);
        }

        if(filterList[0] != undefined){
            if (filterList[0].length > 0){
                selectFrom = buildConstraints(selectFrom, filterList[0], filterList[1], filterList[2], false, false)
            }
        }
        
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
        let selectFrom = "";
        if( baseColumn.name == "monto" || column.name == "monto"){
            selectFrom = sqlClient.select().distinct().field("a.nit_proveedor").field("a.nog").field(joinOpFielf).field(realColumn).from("consolidated_table","a").join("dim_fecha","b",joinCondition);
        }else{
            selectFrom = sqlClient.select().distinct().field("a.nog").field(joinOpFielf).field(realColumn).from("consolidated_table","a").join("dim_fecha","b",joinCondition);
        }

        if(filterList[0] != undefined){
            if (filterList[0].length > 0){
                selectFrom = buildConstraints(selectFrom, filterList[0], filterList[1], filterList[2], false, false)
            }
        }
        let query = sqlClient.select().field(sqlOperation).field(displayColumn).from(selectFrom, "q").group(groupBy);
        return query.toString();
    }




};

const getDataForPreview = async(req, res) => {
    try{

        const filters = req.body.definition.filters;

        const dateFilters = req.body.definition.dateFilters;
        let finalQuery = "";

        //Base Query data
        let baseColumn = req.body.definition.baseColumn;
        let category = req.body.definition.category;
        


        //Filters data
        let filterColumns = [];
        let filterOperations = [];
        let filterValues = [];
        let filterList = [];
        

        if(filters!= undefined){
            if(filters.length > 0){
                filters.forEach(function(item, index){
                    
                    filterColumns.push(item.column);
                    filterOperations.push(item.operation);
                    filterValues.push(item.value);
                    
                });
                filterList.push(filterColumns, filterOperations, filterValues)
            }
            
        }


        //Date Filter Data


        //Run query
        finalQuery = baseQueryHandler(baseColumn, category.operation, category.column, filterList);
        let queryString = replaceAll("`","",finalQuery);
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

