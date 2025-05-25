const router = require("express").Router();
const { Op, fn } = require("sequelize");
const { Blog } = require("../models");
const { SECRET } = require("../util/config");
const { User } = require("../models");
const {Sequelize} = require("sequelize")

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [Sequelize.fn("SUM", Sequelize.col("likes")), "likes"],
      [Sequelize.fn("COUNT",Sequelize.col("id")),"articles"]
    ],
    order: [['likes','DESC']],
    group: "author",
  });

  res.json(blogs);
});

module.exports = router;
