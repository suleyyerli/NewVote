"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../src/lib/axios";

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const data = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      console.log("Sending request to:", endpoint, "with data:", data);

      const response = await api.post(endpoint, data);
      console.log("Response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        router.push("/feed");
      }
    } catch (err) {
      console.error("Error during auth:", err);
      setError(
        (err as any).response?.data?.message || "Une erreur est survenue"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">
            {isLogin ? "Connexion" : "Inscription"}
          </h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nom d&apos;utilisateur</span>
                </label>
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  className="input input-bordered"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@exemple.com"
                className="input input-bordered"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <input
                type="password"
                placeholder="Mot de passe"
                className="input input-bordered"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                {isLogin ? "Se connecter" : "S'inscrire"}
              </button>
            </div>
          </form>

          <div className="divider">OU</div>

          <button
            className="btn btn-outline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
