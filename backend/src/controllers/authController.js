const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");

// Inscription
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await sequelize.query(
      "SELECT * FROM users WHERE email = :email OR username = :username",
      {
        replacements: { email, username },
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
      "INSERT INTO users (username, email, password, role, createdAt, updatedAt) VALUES (:username, :email, :password, :role, NOW(), NOW())",
      {
        replacements: {
          username,
          email,
          password: hashedPassword,
          role: "user",
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    // Récupérer l'utilisateur créé
    const [user] = await sequelize.query(
      "SELECT id, username, email, role FROM users WHERE id = :id",
      {
        replacements: { id: result },
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
      "SELECT * FROM users WHERE email = :email",
      {
        replacements: { email },
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

// Récupérer les informations de l'utilisateur connecté
exports.getMe = async (req, res) => {
  try {
    const [user] = await sequelize.query(
      "SELECT id, username, email, role FROM users WHERE id = :id",
      {
        replacements: { id: req.user.id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Création d'un administrateur
exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password, adminSecret } = req.body;

    // Vérifier le secret administrateur
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Code secret administrateur invalide",
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await sequelize.query(
      "SELECT * FROM users WHERE email = :email OR username = :username",
      {
        replacements: { email, username },
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

    // Créer l'administrateur
    const [result] = await sequelize.query(
      "INSERT INTO users (username, email, password, role, createdAt, updatedAt) VALUES (:username, :email, :password, :role, NOW(), NOW())",
      {
        replacements: {
          username,
          email,
          password: hashedPassword,
          role: "admin",
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    // Récupérer l'administrateur créé
    const [user] = await sequelize.query(
      "SELECT id, username, email, role FROM users WHERE id = :id",
      {
        replacements: { id: result },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(201).json({
      success: true,
      message: "Administrateur créé avec succès",
      data: user,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'administrateur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'administrateur",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

module.exports = exports;
