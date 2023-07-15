//* USER Queries
const createUserStmt =
  "INSERT INTO users (id, full_name, email, password, user_name) VALUES ($1, $2, $3, $4, $5) RETURNING *";
const getUserDetailsQuery = "SELECT * FROM users WHERE id = $1";
const getUserByEmailQuery =
  "SELECT id, email, password FROM users WHERE email = $1";
const updateUserDetailsStmt =
  "UPDATE users SET full_name = $1, user_name = $2, dob = $3, updated_at = $4 WHERE id = $5 RETURNING *";
const updateUserPasswordStmt =
  "UPDATE users SET password = $1, updated_at = $2 WHERE id = $3 RETURNING *";
const deleteUserStmt = "DELETE FROM users WHERE id = $1";

//* POST Queries
const createPostStmt =
  "INSERT INTO posts (id, title, content, category, user_id, active) VALUES ($1, $2, $3, $4, $5, true) RETURNING *";
const updatePostStmt =
  "UPDATE posts SET title = $1, content = $2, updated_at = $3 WHERE id = $4 AND user_id = $5 RETURNING *";

const getPostDetailsQuery = `
  SELECT
  p.*,
  u.user_name AS user_user_name,
  c.content AS comment_content,
  c.created_at AS comment_created_at,
  u2.id AS comment_user_id,
  u2.user_name AS comment_user_name
  FROM
  posts p
  LEFT JOIN
  users u ON p.user_id = u.id
  LEFT JOIN
  comments c ON p.id = c.post_id
  LEFT JOIN
  users u2 ON c.user_id = u2.id
  WHERE p.id = $1 AND p.active = true
  ORDER BY p.created_at
  `;

const deletePostStmt =
  "UPDATE posts SET active = false WHERE id = $1 AND user_id = $2";

const listUsersPostsQuery = `
  SELECT p.id, p.title, p.category, u.user_name, COUNT(c.id) AS comment_count
  FROM posts p
  LEFT JOIN users u ON p.user_id = u.id
  LEFT JOIN comments c ON c.post_id = p.id
  WHERE p.user_id = $1 AND p.active = true
  GROUP BY p.id, p.title, p.category, u.user_name
  ORDER BY p.created_at
  `;

const listPostsQuery = `
  SELECT p.id, p.title, p.category, u.user_name, COUNT(c.id) AS comment_count
  FROM posts p
  LEFT JOIN users u ON p.user_id = u.id
  LEFT JOIN comments c ON c.post_id = p.id
  WHERE p.active = true
  GROUP BY p.id, p.title, p.category, u.user_name
  ORDER BY p.created_at
`;

const listPostsByCategoryQuery = `
SELECT p.id, p.title, p.category, u.user_name, COUNT(c.id) AS comment_count
  FROM posts p
  LEFT JOIN users u ON p.user_id = u.id
  LEFT JOIN comments c ON c.post_id = p.id
  WHERE p.category = $1 AND p.active = true
  GROUP BY p.id, p.title, p.category, u.user_name
  ORDER BY p.created_at
`;

//* COMMENT Queries
const createCommentStmt =
  "INSERT INTO comments (id, content, post_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *";
const listUsersCommentsQuery =
  "SELECT c.id, c.content, c.created_at, u.full_name, u.user_name FROM comments c JOIN users u on u.id = c.user_id WHERE c.user_id = $1";
const deletePostsCommentsStmt = "DELETE FROM comments WHERE post_id = $1";
module.exports = {
  createUserStmt,
  getUserDetailsQuery,
  getUserByEmailQuery,
  updateUserDetailsStmt,
  updateUserPasswordStmt,
  deleteUserStmt,
  createPostStmt,
  updatePostStmt,
  getPostDetailsQuery,
  deletePostStmt,
  createCommentStmt,
  listUsersCommentsQuery,
  listUsersPostsQuery,
  listPostsQuery,
  listPostsByCategoryQuery,
  deletePostsCommentsStmt,
};
