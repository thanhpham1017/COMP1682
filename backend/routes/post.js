const express = require('express');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const BloggerModel = require('../models/Blogger');

const router = express.Router();

const { verifyToken, checkBlogger } = require('../middlewares/auth');
const { text } = require('body-parser');
const { nextTick } = require('process');
const AdminModel = require('../models/Admin');


router.post('/post', verifyToken, checkBlogger , uploadMiddleware.single('file'), async (req,res) => {
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);

    const accountId = req.accountId.username;
    const {title,summary,content,likes, comments} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:accountId,
    });
    res.json(postDoc);

});

router.put('/post', verifyToken, checkBlogger , uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }
    const accountId = req.accountId._id;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(accountId);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    res.json(postDoc);

});

router.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});



router.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']).populate('comments.postedBy', 'username');
  res.json(postDoc);
});

router.delete('/post/delete/:id', verifyToken, async (req, res) => {
  try {

      const accountId = req.accountId._id;
      const {id} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(accountId);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }

      const DeletePost = await Post.findByIdAndDelete(id);

      if (!DeletePost) {
          res.status(404).json({ success: false, error: "account not found" });
          return;
      }
      res.status(200).json({ success: true, message: "blogger deleted successfully" });
  } catch (error) {
      console.error("Error while deleting category:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.put('post/comment/:id', verifyToken, async (req, res) => {
  const accountId = req.accountId._id;
  const { comment } = req.body;
  try {
      const blogComment = await Post.findByIdAndUpdate(req.params.id, {
        $push: { comments: { text: comment, postedBy: accountId } }
      }, 
        { new: true }
      );
      const blog = await Post.findById(blogComment._id).populate('comments.postedBy', 'username email');
      res.status(200).json({success: true, blog});
  } catch (error) {
    next(error);
  }
});

router.put('post/addLike/:id', verifyToken, async (req, res) => {
  try {
    const accountId = req.accountId._id;
    const post = await Post.findByIdAndUpdate(req.params.id, {
        $addToSet: { likes: accountId }
    },
        { new: true }
    );
    const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'username');
    main.io.emit('add-like', posts);

    res.status(200).json({
        success: true,
        post,
        posts
    })

  } catch (error) {
      next(error);
  }
});

router.put('post/removeLike/:id', verifyToken, async (req, res) =>{
  try {
    const accountId = req.accountId._id;
    const post = await Post.findByIdAndUpdate(req.params.id, {
        $pull: { likes: accountId }
    },
        { new: true }
    );

    const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'username');
    main.io.emit('remove-like', posts);

    res.status(200).json({
        success: true,
        post
    })

} catch (error) {
    next(error);
}
});
module.exports = router;