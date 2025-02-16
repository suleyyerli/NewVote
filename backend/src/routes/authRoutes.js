const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

// Routes publiques
router.post("/register", authController.register);
router.post("/login", authController.login);

// Routes protégées
router.get("/me", protect, authController.getMe);

// Route pour créer un administrateur
router.post("/create-admin", authController.createAdmin);

module.exports = router;
