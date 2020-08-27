const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// Model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.post(
  '/',
  [auth, [check('text', 'Text is require').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // sort({ date: -1 }) a descending sort on the date field
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    // Purpose for line 59: If req.params.id != type of ObjectId -> return msg: 'Post not found', If have not line 59 -> err return Server Error (test with id: 1 and id: 5f45d666d098b82f1249d7f6 we will see different)
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.user !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    } // Purpose: Khi xoa post, chi user da post commemt do moi dc xoa

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked - Purpose: neu user da like post do roi, thi ko dc like nua
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked - Purpose: post nay minh chua like, ko thao tac dc unlike
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been like' });
    }

    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is require').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id)

    // Make sure comment exitsts
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" })
    }

    // Check user - User da post thi moi co the xoa dc
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }

    // Get remove index
    // const removeIndex = post.comments
    //   .map(comment => comment.user.toString())
    //   .indexOf(req.user.id);
    
    // console.log(post.comments
    //   .map(comment => comment.user.toString()).indexOf(req.user.id))

    // post.comments.splice(removeIndex, 1);
    // await post.save();
    // res.json(post.comments);

    post.comments = post.comments.filter(
      (id) => {
        // console.log(id)
        return  id !== req.params.comment_id
      }
     
    );

    await post.save();

    return res.json(post.comments);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
 /* Mai coi tiep route nay */
});

module.exports = router;
