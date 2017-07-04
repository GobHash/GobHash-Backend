import Post from '../models/post.model';

// Create
const create = async (req, res) => {
  try {
    const user = req.user.id;
    const post = await new Post({
      user,
      layout: req.body.layout,
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags
    });
    await post.save();
    return res.json(post);
  } catch (e) {
    return res.json(e);
  }
};

// Read
const get = async (req, res) => {
  try {
    const post = await Post.get(req.params.postId);
    return res.json(post);
  } catch (e) {
    return res.json(e);
  }
};
/**
 * Get post list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
const list = async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
  try {
    const users = await Post.list({ limit, skip });
    return res.json(users);
  } catch (e) {
    return res.json(e);
  }
};
// Update
// Delete
export default { create, get, list };
