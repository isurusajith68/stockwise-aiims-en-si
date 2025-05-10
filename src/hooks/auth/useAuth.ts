import authService from "@/services/auth/authService";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authService.logout,
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: authService.refreshToken,
  });
};
