// Example axios interceptor for handling token refresh in the frontend
// This would typically go in your API service file

import axios from "axios";

const API_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-refresh-token"];

    if (newToken) {
      localStorage.setItem("token", newToken);
      console.log("Token refreshed automatically");
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const newToken = response.data.data.accessToken;

        if (newToken) {
          localStorage.setItem("token", newToken);

          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
