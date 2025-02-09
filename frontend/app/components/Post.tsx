import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import api from "../../src/lib/axios";

interface Comment {
  id: number;
  content: string;
  username: string;
  createdAt: string;
  likesCount: number;
}

interface PostProps {
  id: number;
  username: string;
  content: string;
  createdAt: string;
}

export default function Post({ id, username, content, createdAt }: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/comments/post/${id}`);
      // Trier les commentaires par nombre de likes
      const sortedComments = response.data.comments.sort(
        (a: Comment, b: Comment) => b.likesCount - a.likesCount
      );
      setComments(sortedComments);
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowComments = async () => {
    if (!showComments) {
      await fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/comments/post/${id}`, {
        content: newComment,
      });
      setComments([...comments, response.data.comment]);
      setNewComment("");
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire", error);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      await api.post(`/comments/${commentId}/like`);
      await fetchComments(); // Recharger les commentaires pour mettre à jour les likes
    } catch (error) {
      console.error("Erreur lors du like du commentaire", error);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{username}</h3>
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: fr,
            })}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-ghost btn-sm" onClick={handleShowComments}>
            {showComments
              ? "Masquer les commentaires"
              : "Afficher les commentaires"}
          </button>
        </div>

        {showComments && (
          <div className="mt-4">
            <form onSubmit={handleAddComment} className="mb-4">
              <div className="form-control">
                <textarea
                  className="textarea textarea-bordered h-16"
                  placeholder="Ajouter un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-sm mt-2"
                disabled={!newComment.trim()}
              >
                Commenter
              </button>
            </form>

            {isLoading ? (
              <div className="text-center">Chargement des commentaires...</div>
            ) : (
              <div className="space-y-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-base-200 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{comment.username}</span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{comment.content}</p>
                    <div className="flex items-center justify-between">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        👍 {comment.likesCount}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
