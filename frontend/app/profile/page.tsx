"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import api from "../../src/lib/axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface UserPost {
  id: number;
  content: string;
  createdAt: string;
  username: string;
  userId: number;
}

interface DecodedToken {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      const decoded = jwtDecode(token) as DecodedToken;
      // Définir le profil initial avec les données du token
      const initialProfile = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
      };
      setProfile(initialProfile);
      fetchUserData(decoded.id);
    } catch (err) {
      localStorage.removeItem("token");
      router.push("/auth");
    }
  }, [router]);

  const fetchUserData = async (userId: number) => {
    try {
      setIsLoading(true);
      setError("");

      // Récupérer les posts
      const postsResponse = await api.get("/posts");
      const userPosts = postsResponse.data.posts.filter(
        (post: UserPost) => post.userId === userId
      );
      setPosts(userPosts || []);

      // Tenter de récupérer les informations mises à jour du profil
      try {
        const userResponse = await api.get(`/auth/me`);
        if (userResponse.data.success) {
          setProfile(userResponse.data.user);
        }
      } catch (profileError) {
        console.warn(
          "Impossible de récupérer les informations mises à jour du profil"
        );
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Erreur lors du chargement des données"
      );
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { status: number } }).response?.status === 401
      ) {
        localStorage.removeItem("token");
        router.push("/auth");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression du post"
      );
    }
  };

  if (isLoading) return <div className="text-center p-4">Chargement...</div>;
  if (error) return <div className="text-center text-error p-4">{error}</div>;
  if (!profile) return <div className="text-center p-4">Profil non trouvé</div>;

  return (
    <div className="container mx-auto max-w-2xl p-4">
      {/* Informations du profil */}
      <div className="card bg-primary text-primary-content shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Mon Profil</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Nom d&apos;utilisateur:</span>{" "}
              {profile.username}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Mes Posts ({posts.length})</h3>

      {/* Liste des posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">
            Vous n&apos;avez pas encore de posts
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="card bg-secondary text-secondary-content shadow-xl"
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <span className="text-sm opacity-75">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                  <button
                    className="btn btn-ghost btn-sm text-error-content bg-error hover:bg-error-focus"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Supprimer
                  </button>
                </div>
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
