// handling routes
const router = require("express").Router();

const { Blog } = require("../models");
// PUT /api/blogs/:id (modifying the like count of a blog
// The updated number of likes will be relayed with the request:
// {
//   likes: 3
// }
// Centralize the application error handling in middleware as in part 3. 
// You can also enable middleware express-async-errors as we did in part 4.
// The data returned in the context of an error message is not very important.
// At this point, the situations that require error handling by the application 
// are creating a new blog and changing the number of likes on a blog. 
// Make sure the error handler handles both of these appropriately.
router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post("/", async (req, res) => {
    const blog = await Blog.create(req.body);
    res.json(blog);
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
  }
  res.status(204).end();
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
