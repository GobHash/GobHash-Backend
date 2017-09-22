import Operation from '../models/operations.model';

const getOperations = async(req, res) => {
    try {
        //const vl = req.query.id;
        const operations = await Operation.findAll();
        return res.json(operations)
    }
    catch (e){
        return res.json(e);
    }
}

export default { getOperations };