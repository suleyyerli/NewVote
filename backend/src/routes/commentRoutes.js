const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { protect } = require("../middlewares/auth");

// Protection de toutes les routes
router.use(protect);

// Routes pour les commentaires
router.post("/post/:postId", commentController.createComment);
router.get("/post/:postId", commentController.getPostComments);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);
router.post("/:id/like", commentController.toggleLike);

module.exports = router;
