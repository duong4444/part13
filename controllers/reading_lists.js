// handle route /api/readinglist
const router = require("express").Router();
const { Blog, User, ReadingList } = require("../models");

const blogExtractor = async (req, res, next) => {
  req.blog = await Blog.findOne({
    where: {
      id: req.body.blogId,
    },
  });
  next();
};

const userExtractor = async (req, res, next) => {
  req.user = await User.findByPk(req.body.userId);
  next();
};
router.post("/", userExtractor, blogExtractor, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!req.blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    const readingList = await ReadingList.create({
      userId: req.user.id,
      blogId: req.blog.id,
    });
    res.json(readingList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
