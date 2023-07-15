const express = require("express");
require("dotenv").config;
const cookieParser = require("cookie-parser");

const authRouter = require("./controller/auth");
const userRouter = require("./controller/user");
const postRouter = require("./controller/post");
const commentRouter = require("./controller/comment");
const { notFound } = require("./middleware/not-found");
const { errorHandlerMiddleware } = require("./middleware/error-handler");

const port = process.env.SERVER_PORT || 8080;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use(notFound);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
