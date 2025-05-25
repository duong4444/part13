const router = require("express").Router();
const { User } = require("../models");
const { Blog } = require("../models");
router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
    order: [['id', 'ASC']],
  });
  res.json(users);
});

router.post("/", async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
});

router.get("/:username", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({error: "invalid username" })
  }
});

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
    res.status(404).json({error: "invalid username" })
  }
});

module.exports = router;
