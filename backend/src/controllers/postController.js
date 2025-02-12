const sequelize = require("../config/database");

// Créer un nouveau post
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    // Créer le post
    const [result] = await sequelize.query(
      "INSERT INTO posts (content, userId, createdAt, updatedAt) VALUES (:content, :userId, NOW(), NOW())",
      {
        replacements: {
          content: content,
          userId: userId,
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    // Récupérer le post créé avec les infos de l'utilisateur
    const [post] = await sequelize.query(
      `SELECT p.*, u.username 
       FROM posts p 
       JOIN users u ON p.userId = u.id 
       WHERE p.id = :postId`,
      {
        replacements: {
          postId: result,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(201).json({
      success: true,
      message: "Post créé avec succès",
      post,
    });
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du post",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Récupérer tous les posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await sequelize.query(
      `SELECT p.*, u.username,
       (SELECT COUNT(*) FROM comments c WHERE c.postId = p.id) as commentCount
       FROM posts p 
       JOIN users u ON p.userId = u.id 
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

// Récupérer un post spécifique
exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const [post] = await sequelize.query(
      `SELECT p.*, u.username,
       (SELECT COUNT(*) FROM comments c WHERE c.postId = p.id) as commentCount
       FROM posts p 
       JOIN users u ON p.userId = u.id 
       WHERE p.id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post non trouvé",
      });
    }

    // Récupérer les commentaires du post
    const comments = await sequelize.query(
      `SELECT c.*, u.username 
       FROM comments c 
       JOIN users u ON c.userId = u.id 
       WHERE c.postId = :postId 
       ORDER BY c.likesCount DESC, c.createdAt DESC`,
      {
        replacements: { postId: id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    post.comments = comments;

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du post:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du post",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Mettre à jour un post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Vérifier si le post existe et appartient à l'utilisateur
    const [post] = await sequelize.query("SELECT * FROM posts WHERE id = :id", {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post non trouvé",
      });
    }

    if (post.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à modifier ce post",
      });
    }

    await sequelize.query(
      "UPDATE posts SET content = :content, updatedAt = NOW() WHERE id = :id",
      {
        replacements: { content, id },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    const [updatedPost] = await sequelize.query(
      `SELECT p.*, u.username 
       FROM posts p 
       JOIN users u ON p.userId = u.id 
       WHERE p.id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      success: true,
      message: "Post mis à jour avec succès",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du post:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du post",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Supprimer un post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier si le post existe
    const [post] = await sequelize.query("SELECT * FROM posts WHERE id = :id", {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post non trouvé",
      });
    }

    if (post.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer ce post",
      });
    }

    // Supprimer d'abord les commentaires liés au post
    await sequelize.query("DELETE FROM comments WHERE postId = :postId", {
      replacements: { postId: id },
      type: sequelize.QueryTypes.DELETE,
    });

    // Puis supprimer le post
    await sequelize.query("DELETE FROM posts WHERE id = :id", {
      replacements: { id },
      type: sequelize.QueryTypes.DELETE,
    });

    res.json({
      success: true,
      message: "Post supprimé avec succès",
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
