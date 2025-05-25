//export model cho các phần khác sử dụng

const Blog = require('./blog')
const User = require('./user')

User.hasMany(Blog)
Blog.belongsTo(User)

module.exports = {
  Blog,
  User
}