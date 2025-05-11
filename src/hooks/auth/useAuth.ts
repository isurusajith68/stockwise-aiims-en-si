import authService from "@/services/auth/authService";
import { User } from "@/store/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useAuthMe = (user: User | null) => {
  return useQuery({
    queryKey: ["authMe"],
    queryFn: authService.me,
    retry: false,
    enabled: !user,
  });
};
