//export model cho các phần khác sử dụng

const Blog = require('./blog')

Blog.sync()

module.exports = {
  Blog
}