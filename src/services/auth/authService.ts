import apiClient from "../apiClient";

interface SignupData {
  username: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
}

interface LoginData {
  identifier: string;
  password: string;
  token?: string;
}

const authService = {
  login: async (credentials: LoginData) => {
    const response = await apiClient.post("/auth/login", credentials);
    if (response.data.accessToken) {
      localStorage.setItem("token", response.data.accessToken);
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

  signup: async (userData: SignupData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },
};

export default authService;
