const express = require("express");
require("dotenv").config;
const cookieParser = require("cookie-parser");

const authRouter = require("./router/auth-router");
const userRouter = require("./router/user-router");
const postRouter = require("./router/post-router");
const commentRouter = require("./router/comment-router");
const statisticsRouter = require("./router/statistics-router");
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
app.use("/api/v1/statistics", statisticsRouter);
app.use(notFound);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
