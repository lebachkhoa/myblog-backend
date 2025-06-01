const postModel = require("../models/postModel");
const logger = require("../utils/log4js");

const postControler = {
    getAllposts: async (req, res) => {
        try {
            const posts = await postModel.getAll();
            res.status(200).json(posts);
        } catch (err) {
            logger.error(`Failed to get all post: ${err.message}`);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    getPostById: async (req, res) => {
        try {
            const post = await postModel.getPostById(req.params.id);
            if (!post) {
                logger.error("Post not found")
                return res.status(404).json({ error: "Post not found" });
            }
            res.status(200).json(post);
        } catch (err) {
            logger.error(`Failed to get post ${err.message}`);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    createPost: async (req, res) => {
        try {
            const { title, content, category_id } = req.body;
            if (!title || !content || !category_id) {
                logger.error("Missing title or content when creating post");
                return res.status(400).json({ error: "Missing title or content" });
            }

            // chi admin moi co the tao post
            const role = req.user.role;
            if (role !== "admin") {
                return res.status(403).json({ error: "Forbidden: Only admin can post" });
            }

            const user_id = req.user.id;
            await postModel.createNewPost({ title, content, user_id, category_id });
            res.status(200).json({ message: "Post created" });

        } catch (err) {
            logger.error(`Failed to create post: ${err.message}`);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    deletePostById: async (req, res) => {
        try {
            // lay thong tin bai post
            const post = await postModel.getPostById(req.params.id);
            if (!post) {
                logger.error("Post not found when deleting post");
                return res.status(404).json({ error: "Post not found" });
            }

            // chi admin moi co the xoa post
            const role = req.user.role
            if (role !== "admin") {
                logger("Not allowed to delete post");
                return res.status(403).json({ error: "Not allowed to delete post" });
            }

            await postModel.deletePostById(req.params.id);
            res.status(200).json({ message: "Post deleted" });

        } catch (err) {
            logger.error(`Failed to delete post: ${err.message}`);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    updatePostById: async (req, res) => {
        try {
            const { title, content } = req.body;

            // lay thong tin bai post
            const post = await postModel.getPostById(req.params.id);
            if (!post) {
                logger.error("Post not found when deleting post")
                return res.status(404).json({ error: "Post not found" });
            }

            // chi admin moi co the cap nhat post
            const role = req.user.role;
            if (role !== "admin") {
                logger("Not allowed to delete post");
                return res.status(403).json({ error: "Not allowed to update this post" });
            }

            const id = req.params.id;
            await postModel.updatePostById({ title, content, id });
            res.status(200).json({ message: "Post updated" });

        } catch (err) {
            logger.error(`Failed to update post: ${err.message}`);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = postControler;