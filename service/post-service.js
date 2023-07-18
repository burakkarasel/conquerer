const postRepository = require("../database/post-repository");
const commentRepository = require("../database/comment-repository");
const {
  formatPostDetails,
  formatPost,
  formatPostListing,
} = require("../helper/formatter");
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
      return formatPost(res.rows[0]);
    } catch (error) {
      if (error.code === "23503") {
        throw generateCustomError("User not found", 400);
      }
      throw error;
    }
  };

  updatePost = async (postId, userId, title, content) => {
    try {
      const prevPostRes = await this.postRepository.getPostById(postId);

      if (!prevPostRes.rows.length) {
        throw generateCustomError("Post not found", 404);
      }

      const newTitle = title || prevPostRes.rows[0].title;
      const newContent = content || prevPostRes.rows[0].content;

      const res = await this.postRepository.updatePost(
        postId,
        userId,
        newTitle,
        newContent
      );

      if (!res.rows.length) {
        throw generateCustomError("Post not found", 404);
      }

      return formatPost(res.rows[0]);
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
      const formattedPost = formatPostDetails(res.rows);

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

      return formatPostListing(res.rows);
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
