const sequelize = require("../config/database");

// Créer un commentaire
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.user.id;

    // Vérifier si le post existe
    const [post] = await sequelize.query(
      "SELECT id FROM posts WHERE id = :postId",
      {
        replacements: { postId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post non trouvé",
      });
    }

    // Créer le commentaire
    const [result] = await sequelize.query(
      "INSERT INTO comments (content, userId, postId, likesCount, createdAt, updatedAt) VALUES (:content, :userId, :postId, 0, NOW(), NOW())",
      {
        replacements: { content, userId, postId },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    // Récupérer le commentaire créé avec les infos de l'utilisateur
    const [commentWithUser] = await sequelize.query(
      `SELECT c.*, u.username 
       FROM comments c 
       JOIN users u ON c.userId = u.id 
       WHERE c.id = :commentId`,
      {
        replacements: { commentId: result },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(201).json({
      success: true,
      message: "Commentaire créé avec succès",
      comment: commentWithUser,
    });
  } catch (error) {
    console.error("Erreur lors de la création du commentaire:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du commentaire",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Récupérer les commentaires d'un post
exports.getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await sequelize.query(
      `SELECT c.*, u.username, 
       (SELECT COUNT(*) FROM CommentLikes cl WHERE cl.commentId = c.id) as likesCount
       FROM comments c 
       JOIN users u ON c.userId = u.id 
       WHERE c.postId = :postId
       ORDER BY c.likesCount DESC, c.createdAt DESC`,
      {
        replacements: { postId },
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

// Modifier un commentaire
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Vérifier si le commentaire existe et appartient à l'utilisateur
    const [comment] = await sequelize.query(
      "SELECT * FROM comments WHERE id = :id",
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

    if (comment.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à modifier ce commentaire",
      });
    }

    await sequelize.query(
      "UPDATE comments SET content = :content, updatedAt = NOW() WHERE id = :id",
      {
        replacements: { content, id },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    const [updatedComment] = await sequelize.query(
      "SELECT * FROM comments WHERE id = :id",
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      success: true,
      message: "Commentaire mis à jour avec succès",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du commentaire:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du commentaire",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Supprimer un commentaire
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier si le commentaire existe
    const [comment] = await sequelize.query(
      "SELECT * FROM comments WHERE id = :id",
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

    if (comment.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer ce commentaire",
      });
    }

    await sequelize.query("DELETE FROM comments WHERE id = :id", {
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

// Liker/Unliker un commentaire
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier si le commentaire existe
    const [comment] = await sequelize.query(
      "SELECT * FROM comments WHERE id = :id",
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

    // Vérifier si l'utilisateur a déjà liké
    const [existingLike] = await sequelize.query(
      "SELECT * FROM CommentLikes WHERE commentId = :commentId AND userId = :userId",
      {
        replacements: { commentId: id, userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingLike) {
      // Unlike - Supprimer le like
      await sequelize.query(
        "DELETE FROM CommentLikes WHERE commentId = :commentId AND userId = :userId",
        {
          replacements: { commentId: id, userId },
          type: sequelize.QueryTypes.DELETE,
        }
      );

      await sequelize.query(
        "UPDATE comments SET likesCount = likesCount - 1 WHERE id = :id",
        {
          replacements: { id },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      const [updatedComment] = await sequelize.query(
        "SELECT * FROM comments WHERE id = :id",
        {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      res.json({
        success: true,
        message: "Like retiré avec succès",
        likesCount: updatedComment.likesCount,
      });
    } else {
      // Like - Créer un nouveau like
      await sequelize.query(
        "INSERT INTO CommentLikes (commentId, userId, createdAt, updatedAt) VALUES (:commentId, :userId, NOW(), NOW())",
        {
          replacements: { commentId: id, userId },
          type: sequelize.QueryTypes.INSERT,
        }
      );

      await sequelize.query(
        "UPDATE comments SET likesCount = likesCount + 1 WHERE id = :id",
        {
          replacements: { id },
          type: sequelize.QueryTypes.UPDATE,
        }
      );

      const [updatedComment] = await sequelize.query(
        "SELECT * FROM comments WHERE id = :id",
        {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      res.json({
        success: true,
        message: "Commentaire liké avec succès",
        likesCount: updatedComment.likesCount,
      });
    }
  } catch (error) {
    console.error("Erreur lors du like/unlike:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du like/unlike",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
