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

const formatPostDetails = (arr) => {
  const post = {
    id: arr[0].id,
    title: arr[0].title,
    content: arr[0].content,
    category: arr[0].category,
    userId: arr[0].user_id,
    active: true,
    createdAt: arr[0].created_at,
    updatedAt: arr[0].updated_at,
    deletedAt: arr[0].deleted_at,
    postOwnerUsername: arr[0].user_user_name,
    comments: [],
  };
  arr.forEach((item) => {
    if (item.comment_user_id) {
      const comment = {};

      comment.commentOwnerId = item.comment_user_id;
      comment.commentOwnerUsername = item.comment_user_name;
      comment.content = item.comment_content;
      comment.createdAt = item.comment_created_at;

      post.comments.push(comment);
    }
  });

  return post;
};

const formatPostListing = (posts) => {
  return posts.map((item) => {
    return {
      id: item.id,
      title: item.title,
      category: item.category,
      username: item.user_name,
      commentCount: item.comment_count,
    };
  });
};

const formatPost = (post) => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    userId: post.user_id,
    active: post.active,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    deletedAt: post.deleted_at,
  };
};

const formatComment = (comment) => {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    postId: comment.post_id,
    userId: comment.user_id,
  };
};

const formatComments = (comments) => {
  return comments.map((item) => {
    return {
      id: item.id,
      content: item.content,
      createdAt: item.created_at,
      fullName: item.full_name,
      username: item.user_name,
    };
  });
};

module.exports = {
  formatUser,
  formatPostDetails,
  formatComment,
  formatComments,
  formatPost,
  formatPostListing,
};
