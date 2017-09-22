import Columns from '../models/column.model';
import Entity from '../models/entity.model';

const getColumnsByEntity = async(req, res) => {
    try {
        const vl = req.params.id;
        const clumns = await Columns.findAll({
            where: {
                entity_id: vl
            }
        });
        console.log("YESSSSS")
        console.log(clumns)
        return res.json(clumns)
    }
    catch (e){
        return res.json(e);
    }
}

const getColumns = async(req, res) => {
    try {
        //const vl = req.query.id;
        const entities = await Columns.findAll();
        return res.json(entities)
    }
    catch (e){
        return res.json(e);
    }
}

export default { getColumnsByEntity, getColumns };