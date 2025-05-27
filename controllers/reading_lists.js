// handle route /api/readinglist
const { tokenExtractor } = require("../util/middleware");
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

router.put("/:id", tokenExtractor, userExtractor, async (req, res, next) => {
  try {
    const readinglist = await ReadingList.findByPk(req.params.id);

    if (readinglist === null) {
      return next("readinglist could not be found by id");
    }

    if (readinglist.userId !== req.decodedToken.id) {
      return res
        .status(400)
        .json({ error: "user has no permission to update readinglist" });
    }

    readinglist.read = req.body.read;

    await readinglist.save();

    console.log(JSON.stringify(readinglist, null, 2));
    return res.status(200).json(readinglist);
  } catch (error) {
    next(error);
  }
});

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
