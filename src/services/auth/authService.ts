import apiClient from "../apiClient";

const authService = {
  login: async (credentials: any) => {
    const response = await apiClient.post("/auth/login", credentials);
    if (response.data.tokens) {
      localStorage.setItem("token", response.data.tokens);
    }
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    localStorage.removeItem("token");
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post("/auth/refresh-token");
    if (response.data.data.accessToken) {
      localStorage.setItem("token", response.data.data.accessToken);
    }
    return response.data;
  },
};

export default authService;
