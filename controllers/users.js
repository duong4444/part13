const router = require("express").Router();
const { User } = require("../models");
const { Blog } = require("../models");
const { ReadingList } = require("../models");
router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
      },
    ],
    order: [["id", "ASC"]],
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});


router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: {
          exclude: ['userId', 'reading_list','createdAt','updatedAt'],
        },
        through: {
          as: 'readingLists',
          attributes: [
            'read','id'
          ],
        },
      },
    ],
  })
  res.json(user)
})

router.put("/:username", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (user) {
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ error: "invalid username" });
  }
});

module.exports = router;
