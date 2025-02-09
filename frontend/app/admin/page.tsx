"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import api from "../../src/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  postsCount: number;
  createdAt: string;
}

interface Post {
  id: number;
  content: string;
  username: string;
  email: string;
  createdAt: string;
  commentCount: number;
}

export default function AdminPanel() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "posts">("users");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      const decoded = jwtDecode(token) as { role: string };
      if (decoded.role !== "admin") {
        router.push("/feed");
        return;
      }
      fetchData();
    } catch (error) {
      router.push("/auth");
    }
  }, [router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [usersResponse, postsResponse] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/posts"),
      ]);

      setUsers(usersResponse.data.users);
      setPosts(postsResponse.data.posts);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Erreur lors du chargement des données"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression de l'utilisateur"
      );
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      return;
    }

    try {
      await api.delete(`/admin/posts/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression du post"
      );
    }
  };

  const handleToggleAdmin = async (userId: number, currentRole: string) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la modification du rôle"
      );
    }
  };

  if (isLoading) return <div className="text-center p-4">Chargement...</div>;
  if (error) return <div className="text-center text-error p-4">{error}</div>;

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="text-3xl font-bold mb-6">Panneau d&apos;administration</h1>

      <div className="tabs tabs-boxed mb-4">
        <button
          className={`tab ${activeTab === "users" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Utilisateurs ({users.length})
        </button>
        <button
          className={`tab ${activeTab === "posts" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Posts ({posts.length})
        </button>
      </div>

      {activeTab === "users" ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Posts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "admin" ? "badge-warning" : "badge-info"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{user.postsCount}</td>
                  <td className="space-x-2">
                    {user.role !== "admin" && (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleToggleAdmin(user.id, user.role)}
                      >
                        Promouvoir admin
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{post.username}</h3>
                    <p className="text-sm opacity-70">{post.email}</p>
                    <span className="text-sm opacity-70">
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Supprimer
                  </button>
                </div>
                <p className="mt-4 whitespace-pre-wrap">{post.content}</p>
                <div className="card-actions justify-end">
                  <span className="text-sm opacity-70">
                    {post.commentCount} commentaire(s)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
