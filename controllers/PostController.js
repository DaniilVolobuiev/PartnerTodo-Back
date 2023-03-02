import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (error) {}
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: 'Not possible to get the article',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Article not found',
          });
        }
        res.json(doc);
      },
    );

    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (error) {}
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: 'Not possible to delete article',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Article not found',
          });
        }
      },
      res.json({
        success: true,
      }),
    );
  } catch (error) {}
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      todoStrings: req.body.todoStrings,
      user: req.userId,
      userName: req.body.userName,
      liked: false,
    });
    const post = await doc.save();

    res.json(post);
  } catch (error) {
    return res.status(500).json({
      message: 'Not possible to create the article',
      error,
    });
  }
};

export const patchCard = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        todoStrings: req.body.todoStrings,
        user: req.userId,
        liked: req.body.liked,
      },
    );
    res.json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Not possible to update the article',
    });
  }
};

export const getItemsByUser = (req, res) => {
  const userID = req.params.user;

  // Find all items created by the specified user
  PostModel.find({ user: userID }, (err, posts) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.json(posts);
  }).populate('user');
};
