import apiClient from "../apiClient";

export const setup2FA = async () => {
  try {
    const response = await apiClient.post("/auth/2fa/setup");
    return response.data;
  } catch (error) {
    console.error("Error setting up 2FA:", error);
    throw error;
  }
};

export const verify2FA = async (token: string) => {
  try {
    const response = await apiClient.post("/auth/2fa/verify", { token });
    return response.data;
  } catch (error) {
    console.error("Error verifying 2FA:", error);
    throw error;
  }
};

export const disable2FA = async (password: string) => {
  try {
    const response = await apiClient.post("/auth/2fa/disable", {
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error disabling 2FA:", error);
    throw error;
  }
};

export const check2FAStatus = async () => {
  try {
    const response = await apiClient.get("/auth/2fa/status");
    return response.data;
  } catch (error) {
    console.error("Error checking 2FA status:", error);
    throw error;
  }
};
