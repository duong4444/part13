// configure and launch the app

const express = require("express");
const app = express();
require("express-async-errors");

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");
const middleware = require("./util/middleware");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/authors");
const logOutRouter = require("./controllers/logout");
const readingListRouter = require("./controllers/reading_lists");

app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);
app.use(middleware.tokenExtractor);
app.use("/api/logout", logOutRouter);
app.use(middleware.userExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/readinglists", readingListRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// users ko có token, token ko hợp lệ (bị thu hồi)không thể thực hiện chức năng
// mà yêu cầu login

start();
