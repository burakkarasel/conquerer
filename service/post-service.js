const postRepository = require("../database/post-repository");
const commentRepository = require("../database/comment-repository");
const { formatPost } = require("../helper/formatter");
const { generateCustomError } = require("../error/custom-error");

class PostService {
  postRepository;
  commentRepository;
  constructor(_postRepository, _commentRepository) {
    this.postRepository = _postRepository;
    this.commentRepository = _commentRepository;
  }

  createPost = async (title, content, category, userId) => {
    try {
      const res = await this.postRepository.createPost(
        title,
        content,
        category,
        userId
      );
      return res.rows[0];
    } catch (error) {
      throw error;
    }
  };

  updatePost = async (postId, userId, title, content) => {
    try {
      const res = await this.postRepository.updatePost(
        postId,
        userId,
        title,
        content
      );
      if (!res.rows.length) {
        throw generateCustomError("Post not found", 404);
      }
      return res.rows[0];
    } catch (error) {
      throw error;
    }
  };

  getPostDetails = async (postId) => {
    try {
      const res = await this.postRepository.getPostDetails(postId);
      if (!res.rows.length) {
        throw generateCustomError("Post not found", 404);
      }
      const formattedPost = formatPost(res.rows);

      return formattedPost;
    } catch (error) {
      throw error;
    }
  };

  listPosts = async (userId, self, category) => {
    try {
      let res;
      switch (true) {
        case Boolean(self):
          res = await this.postRepository.listUsersPosts(userId);
          break;
        case Boolean(category):
          res = await this.postRepository.listPostsByCategory(category);
          break;
        default:
          res = await this.postRepository.listLatestPosts();
      }

      return res.rows;
    } catch (error) {
      throw error;
    }
  };

  deletePost = async (userId, postId) => {
    try {
      await this.postRepository.deletePost(postId, userId);
      await this.commentRepository.deletePostsComments(postId);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = new PostService(postRepository, commentRepository);
