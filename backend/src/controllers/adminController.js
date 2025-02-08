const sequelize = require("../config/database");

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await sequelize.query(
      `SELECT id, username, email, role, createdAt, updatedAt,
       (SELECT COUNT(*) FROM Posts WHERE userId = Users.id) as postsCount,
       (SELECT COUNT(*) FROM Comments WHERE userId = Users.id) as commentsCount
       FROM Users 
       ORDER BY createdAt DESC`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Récupérer tous les posts avec détails
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await sequelize.query(
      `SELECT p.*, u.username, u.email,
       (SELECT COUNT(*) FROM Comments c WHERE c.postId = p.id) as commentCount
       FROM Posts p
       JOIN Users u ON p.userId = u.id
       ORDER BY p.createdAt DESC`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des posts",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Récupérer tous les commentaires avec détails
exports.getAllComments = async (req, res) => {
  try {
    const comments = await sequelize.query(
      `SELECT c.*, u.username, u.email, p.content as postContent
       FROM Comments c
       JOIN Users u ON c.userId = u.id
       JOIN Posts p ON c.postId = p.id
       ORDER BY c.createdAt DESC`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commentaires",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Modifier le rôle d'un utilisateur
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Rôle invalide",
      });
    }

    // Vérifier si l'utilisateur existe
    const [user] = await sequelize.query("SELECT * FROM Users WHERE id = :id", {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Empêcher la modification du rôle du super admin
    if (user.role === "admin" && req.user.id !== user.id) {
      return res.status(403).json({
        success: false,
        message:
          "Vous ne pouvez pas modifier le rôle d'un autre administrateur",
      });
    }

    await sequelize.query(
      "UPDATE Users SET role = :role, updatedAt = NOW() WHERE id = :id",
      {
        replacements: { role, id },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    res.json({
      success: true,
      message: "Rôle de l'utilisateur mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du rôle",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Supprimer un post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le post existe
    const [post] = await sequelize.query("SELECT * FROM Posts WHERE id = :id", {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post non trouvé",
      });
    }

    // Supprimer les commentaires associés
    await sequelize.query("DELETE FROM Comments WHERE postId = :postId", {
      replacements: { postId: id },
      type: sequelize.QueryTypes.DELETE,
    });

    // Supprimer le post
    await sequelize.query("DELETE FROM Posts WHERE id = :id", {
      replacements: { id },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({
      success: true,
      message: "Post et ses commentaires supprimés avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du post:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du post",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Supprimer un commentaire
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le commentaire existe
    const [comment] = await sequelize.query(
      "SELECT * FROM Comments WHERE id = :id",
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Commentaire non trouvé",
      });
    }

    // Supprimer le commentaire
    await sequelize.query("DELETE FROM Comments WHERE id = :id", {
      replacements: { id },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({
      success: true,
      message: "Commentaire supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du commentaire",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const [user] = await sequelize.query("SELECT * FROM Users WHERE id = :id", {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Empêcher la suppression d'un admin par un autre admin
    if (user.role === "admin" && req.user.id !== user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous ne pouvez pas supprimer un autre administrateur",
      });
    }

    // Supprimer l'utilisateur (les posts et commentaires seront supprimés en cascade)
    await sequelize.query("DELETE FROM Users WHERE id = :id", {
      replacements: { id },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'utilisateur",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Statistiques du site
exports.getStats = async (req, res) => {
  try {
    const [[userCount]] = await sequelize.query(
      "SELECT COUNT(*) as count FROM Users",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const [[postCount]] = await sequelize.query(
      "SELECT COUNT(*) as count FROM Posts",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const [[commentCount]] = await sequelize.query(
      "SELECT COUNT(*) as count FROM Comments",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const [topPosts] = await sequelize.query(
      `SELECT p.*, u.username, 
       (SELECT COUNT(*) FROM Comments c WHERE c.postId = p.id) as commentCount
       FROM Posts p
       JOIN Users u ON p.userId = u.id
       ORDER BY commentCount DESC
       LIMIT 5`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const [activeUsers] = await sequelize.query(
      `SELECT u.id, u.username, u.email,
       COUNT(DISTINCT p.id) as postsCount,
       COUNT(DISTINCT c.id) as commentsCount
       FROM Users u
       LEFT JOIN Posts p ON u.id = p.userId
       LEFT JOIN Comments c ON u.id = c.userId
       GROUP BY u.id
       ORDER BY (COUNT(DISTINCT p.id) + COUNT(DISTINCT c.id)) DESC
       LIMIT 5`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      success: true,
      stats: {
        userCount: userCount.count,
        postCount: postCount.count,
        commentCount: commentCount.count,
        topPosts,
        activeUsers,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
