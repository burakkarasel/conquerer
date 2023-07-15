const formatUser = (user) => {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    username: user.user_name,
    dob: user.dob,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

const formatPost = (arr) => {
  const post = {
    id: arr[0].id,
    title: arr[0].title,
    content: arr[0].content,
    category: arr[0].category,
    userId: arr[0].user_id,
    active: true,
    createdAt: arr[0].created_at,
    updatedAt: arr[0].updated_at,
    postOwnerUsername: arr[0].user_user_name,
    comments: [],
  };
  arr.forEach((item) => {
    const comment = {};
    comment.commentOwnerId = item.comment_user_id;
    comment.commentOwnerUsername = item.comment_user_name;
    comment.content = item.comment_content;
    comment.createdAt = item.comment_created_at;
    post.comments.push(comment);
  });

  return post;
};

module.exports = { formatUser, formatPost };
