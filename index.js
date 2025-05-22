require("dotenv").config();

const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();
app.use(express.json());

// create sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL);

// id SERIAL PRIMARY KEY,
// author text,
// url text NOT NULL,
// title text NOT NULL,
// likes INTEGER DEFAULT 0

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);
Blog.sync();
// Exercise 13.4.
// Transform your application into a web application that supports the following operations

// GET api/blogs (list all blogs)
// POST api/blogs (add a new blog)
// DELETE api/blogs/:id (delete a blog)
app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});
app.post("/api/blogs", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});
app.delete("/api/blogs/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    await blog.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
