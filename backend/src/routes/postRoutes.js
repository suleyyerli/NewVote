const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { protect, restrictTo } = require("../middlewares/auth");

// Routes protégées (nécessitent une authentification)
router.use(protect);

// Routes pour les posts
router.post("/", postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
