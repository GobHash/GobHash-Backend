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
    return res.json(post);
  } catch (e) {
    return res.json(e);
  }
};

// Read
// Update
// Delete

export default { create };
