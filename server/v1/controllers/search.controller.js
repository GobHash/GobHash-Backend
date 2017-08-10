import httpStatus from 'http-status';
import User from '../models/user.model';


const searchUser = async (req, res) => {
  try {
    if (req.query.username === undefined && req.query.name === undefined) {
      return res.status(httpStatus.NOT_FOUND).json([]);
    }
    let re = new RegExp(req.query.username, 'i');
    let users = await User
      .find()
      .where('username')
      .regex(re)
      .exec();
    if (users.length === 0) {
      re = new RegExp(req.query.name, 'i');
      users = await User
        .find()
        .where('name')
        .regex(re)
        .exec();
    }
    if (users.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json([]);
    }
    return res.status(httpStatus.OK).json(users);
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e);
  }
};

export default { searchUser };
