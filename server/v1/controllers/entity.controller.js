import Entity from '../models/entity.model';

const getEntities = async (req, res) => {
  try {
    const entities = await Entity.findAll();
    return res.json(entities);
  } catch (e) {
    return res.json(e);
  }
};

export default { getEntities };
