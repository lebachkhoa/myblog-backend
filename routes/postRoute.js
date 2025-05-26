const postControler = require("../controllers/postControler");
const verifyToken = require("../middlewares/verifyToken");

const postRouter = require("express").Router();

// router.get("/posts", verifyToken, postController.getAll);
// router.get("/posts/:id", verifyToken, postController.getById);
// router.post("/posts", verifyToken, postController.create);
// router.put("/posts/:id", verifyToken, postController.update);
// router.delete("/posts/:id", verifyToken, postController.deletePost);

postRouter.get("/posts", verifyToken, postControler.getAllposts);
postRouter.get("/post/:id", verifyToken, postControler.getPostById);
postRouter.post("/posts", verifyToken, postControler.createPost);
postRouter.delete("/post/:id", verifyToken, postControler.deletePostById);
postRouter.put("/post/:id", verifyToken, postControler.updatePostById);

module.exports = postRouter;