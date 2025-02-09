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

  if (isLoading) return <div className="text-center p-4">Chargement...</div>;
  if (error) return <div className="text-center text-error p-4">{error}</div>;

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="form-control">
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="Que voulez-vous partager ?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={!newPost.trim()}
        >
          Publier
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            username={post.username}
            content={post.content}
            createdAt={post.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
