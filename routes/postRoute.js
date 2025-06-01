const postControler = require("../controllers/postControler");
const verifyToken = require("../middlewares/verifyToken");

const postRouter = require("express").Router();

postRouter.get("/", postControler.getAllposts);
postRouter.get("/:id", postControler.getPostById);
postRouter.post("/", verifyToken, postControler.createPost);
postRouter.delete("/:id", verifyToken, postControler.deletePostById);
postRouter.put("/:id", verifyToken, postControler.updatePostById);

module.exports = postRouter;