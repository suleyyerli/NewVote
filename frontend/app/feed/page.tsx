"use client";

import { useState, useEffect } from "react";
import Post from "../components/Post";
import api from "../../src/lib/axios";

interface Post {
  id: number;
  content: string;
  username: string;
  createdAt: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Charger les posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data.posts);
        setIsLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des posts");
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Créer un nouveau post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await api.post("/posts", { content: newPost });
      setPosts([response.data.post, ...posts]);
      setNewPost("");
    } catch (err) {
      setError("Erreur lors de la création du post");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen  py-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Section création de post */}
        <div className="card bg-primary text-primary-content shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title mb-4">Créer un nouveau post</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <textarea
                  className="textarea textarea-bordered bg-primary-content text-neutral h-24"
                  placeholder="Que voulez-vous partager ?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
              </div>
              <div className="card-actions justify-end mt-4">
                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={!newPost.trim()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Liste des posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <h3 className="text-lg font-semibold">
                  Aucun post pour le moment
                </h3>
                <p className="text-base-content/70">
                  Soyez le premier à partager quelque chose !
                </p>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                username={post.username}
                content={post.content}
                createdAt={post.createdAt}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
