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
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-12">
                <span className="text-xl">{username[0].toUpperCase()}</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary">{username}</h3>
              <span className="text-sm text-base-content/70">
                {formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </span>
            </div>
          </div>
        </div>
        <p className="whitespace-pre-wrap text-base-content">{content}</p>

        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-ghost btn-sm gap-2"
            onClick={handleShowComments}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
              />
            </svg>
            {showComments
              ? "Masquer les commentaires"
              : "Afficher les commentaires"}
          </button>
        </div>

        {showComments && (
          <div className="mt-4 border-t pt-4">
            <form onSubmit={handleAddComment} className="mb-4">
              <div className="form-control">
                <textarea
                  className="textarea textarea-bordered h-16 bg-base-200"
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
                Commenter
              </button>
            </form>

            {isLoading ? (
              <div className="flex justify-center">
                <span className="loading loading-dots loading-md"></span>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-base-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-secondary text-secondary-content rounded-full w-8">
                            <span className="text-xs">
                              {comment.username[0].toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold text-sm">
                          {comment.username}
                        </span>
                      </div>
                      <span className="text-xs text-base-content/70">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{comment.content}</p>
                    <div className="flex items-center justify-between">
                      <button
                        className="btn btn-ghost btn-xs gap-1"
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                          />
                        </svg>
                        {comment.likesCount}
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
