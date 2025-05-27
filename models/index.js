//export model cho các phần khác sử dụng

const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./reading_list");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "readings" });
Blog.belongsToMany(User, { through: ReadingList });

//add blogs vào READING list.
//Khi đc add vào thì blog ở unread state
//Sau đó có thể marked as read vvvvvvvvvvvvv
//implement reading list dùng connection table
//dùng migrations để make db change

//POST /api/readinglists
// {
//   "blogId": 10,
//   "userId": 3
// }
// modify GET /api/users/:username chứa
// name: "abc",
// username: "kkksda",
// readings: [
//   {
//     id: 3,
//     url: "https://google.com",
//     title: "Clean React",
//     author: "Dan Abramov",
//     likes: 34,
//     year: null,
//   },
//   {
//     id: 4,
//     url: "https://google.com",
//     title: "Clean Code",
//     author: "Bob Martin",
//     likes: 5,
//     year: null,
//   },
// ];
module.exports = {
  Blog,
  User,
  ReadingList,
};
