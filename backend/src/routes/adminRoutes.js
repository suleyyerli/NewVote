const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, restrictTo } = require("../middlewares/auth");

// Protection de toutes les routes admin
router.use(protect);
router.use(restrictTo("admin"));

// Routes pour la gestion des utilisateurs
router.get("/users", adminController.getAllUsers);
router.put("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);

// Routes pour la gestion des posts
router.get("/posts", adminController.getAllPosts);
router.delete("/posts/:id", adminController.deletePost);

// Routes pour la gestion des commentaires
router.get("/comments", adminController.getAllComments);
router.delete("/comments/:id", adminController.deleteComment);

module.exports = router;
