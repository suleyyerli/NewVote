import axios from "axios";

console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log toutes les requêtes
api.interceptors.request.use(
  (config) => {
    console.log("Full request URL:", config.baseURL + config.url);
    console.log("Request config:", config);
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
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Log toutes les réponses
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  async (error) => {
    console.error("Response error:", error);
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
