const postRepository = require("../database/post-repository");
const commentRepository = require("../database/comment-repository");
const { formatPost } = require("../helper/formatter");

class PostService {
  postRepository;
  commentRepository;
  constructor(_postRepository, _commentRepository) {
    this.postRepository = _postRepository;
    this.commentRepository = _commentRepository;
  }

  createPost = (title, content, category, userId) => {
    return this.postRepository.createPost(title, content, category, userId);
  };

  updatePost = (postId, userId, title, content) => {
    return this.postRepository.updatePost(postId, userId, title, content);
  };

  getPostDetails = async (postId) => {
    const unformattedPost = await this.postRepository.getPostDetails(postId);
    if (!unformattedPost.length) {
      return null;
    }
    const formattedPost = formatPost(unformattedPost);

    return formattedPost;
  };

  listPosts = async (userId, self, category) => {
    let posts;
    switch (true) {
      case Boolean(self):
        posts = await this.postRepository.listUsersPosts(userId);
        break;
      case Boolean(category):
        posts = await this.postRepository.listPostsByCategory(category);
        break;
      default:
        posts = await this.postRepository.listLatestPosts();
    }

    return posts;
  };

  deletePost = async (userId, postId) => {
    try {
      await this.postRepository.deletePost(postId, userId);
      await this.commentRepository.deletePostsComments(postId);
    } catch (error) {
      return error;
    }
  };
}

module.exports = new PostService(postRepository, commentRepository);
