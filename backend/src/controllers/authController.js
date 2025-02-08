const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");

// Inscription
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await sequelize.query(
      "SELECT * FROM Users WHERE email = ? OR username = ?",
      {
        replacements: [email, username],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Un utilisateur avec cet email ou ce nom d'utilisateur existe déjà",
      });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const [result] = await sequelize.query(
      'INSERT INTO Users (username, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, "user", NOW(), NOW())',
      {
        replacements: [username, email, hashedPassword],
        type: sequelize.QueryTypes.INSERT,
      }
    );

    // Récupérer l'utilisateur créé
    const [user] = await sequelize.query(
      "SELECT id, username, email, role FROM Users WHERE id = ?",
      {
        replacements: [result[0]],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      token,
      user,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Récupérer l'utilisateur
    const [user] = await sequelize.query(
      "SELECT * FROM Users WHERE email = ?",
      {
        replacements: [email],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Retourner la réponse sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "Connexion réussie",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
