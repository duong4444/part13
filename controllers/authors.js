const router = require("express").Router();
const { Op, fn } = require("sequelize");
const { Blog } = require("../models");
const { SECRET } = require("../util/config");
const { User } = require("../models");
const {Sequelize} = require("sequelize")

router.get("/", async (req, res) => {
  const where = {};
  //   if (req.query.search) {
  //     where[Op.or] = [
  //       { title: { [Op.iLike]: `%${req.query.search}%` } },
  //       { author: { [Op.iLike]: `%${req.query.search}%` } },
  //     ];
  //   }

  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [Sequelize.fn("SUM", Sequelize.col("likes")), "likes"],
      [Sequelize.fn("COUNT",Sequelize.col("id")),"articles"]
    ],
    order: [['likes','DESC']],
    group: "author",
  });
  //   console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

module.exports = router;
// Make a route for the application /api/authors that returns the number of blogs
// for each author and the total number of likes.
// Implement the operation directly at the database level.
// You will most likely need the group by functionality,
// and the sequelize.fn aggregator function.
// [
//   {
//     author: "Jami Kousa",
//     articles: "3",
//     likes: "10"
//   },
//   {
//     author: "Kalle Ilves",
//     articles: "1",
//     likes: "2"
//   },
//   {
//     author: "Dan Abramov",
//     articles: "1",
//     likes: "4"
//   }
// Bonus task: order the data returned based on the number of likes,
// do the ordering in the database query.
