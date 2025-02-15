import axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig() || {};
const API_URL =
  publicRuntimeConfig?.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL;

console.log("API URL from config:", API_URL);

if (!API_URL) {
  console.error("NEXT_PUBLIC_API_URL n'est pas définie !");
  console.log("Utilisation de l'URL de fallback");
}

const api = axios.create({
  baseURL:
    API_URL || "http://jkc88wogss8kg0ccsgwkgk08.147.93.94.82.sslip.io/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    // Vérification côté client uniquement
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Gérer l'expiration du token
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
