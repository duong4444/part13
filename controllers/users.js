const router = require("express").Router();
// Add support for users to the application.
// In addition to ID, users have the following fields:
// name (string, must not be empty)
// username (string, must not be empty)
// do not prevent Sequelize from creating timestamps created_at and updated_at for users

// All users can have the same password as the material.
// Implement the following routes
// POST api/users (adding a new user)
// GET api/users (listing all users)
// PUT api/users/:username (changing a username, keep in mind that the parameter is not id but username)
// Make sure that the timestamps created_at and updated_at automatically set by Sequelize work correctly
//  when creating a new user and changing a username.
const { User } = require("../models");
const { Blog } = require("../models");
router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
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
