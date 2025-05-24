// handling routes
const router = require("express").Router();
const { Op } = require("sequelize");
const { Blog } = require("../models");
const { SECRET } = require("../util/config");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      console.log("log trong blogs:", authorization.substring(7));
      console.log("log secret trong blogs:", SECRET);

      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

// Implement filtering by keyword in the application for the route returning
// all blogs. The filtering should work as follows
// GET /api/blogs?search=react returns all blogs with the search word react
// in the title field, the search word is case-insensitive
// GET /api/blogs returns all blogs

// Expand the filter to search for a keyword in either the title or author fields
// GET /api/blogs?search=jami returns blogs with the search word jami
// in the title field or in the author field
router.get("/", async (req, res) => {
  const where = {};
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ];
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
  });
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    });
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    console.log(req.blog);

    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ error: "invalid blog id" });
  }
  if (req.blog.userId !== req.decodedToken.id) {
    return res
      .status(403)
      .json({ error: "only blog owner can delete this blog" });
  }
  await req.blog.destroy();
  res.status(200).json({ message: "delete successful" });
});

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
