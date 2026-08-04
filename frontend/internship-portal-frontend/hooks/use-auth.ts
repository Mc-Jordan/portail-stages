import { useAuthStore } from '@/store/auth-store';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();

  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return '/student/offers';
      case 'COMPANY':
        return '/company/dashboard';
      case 'TEACHER':
        return '/teacher/agreements';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
    getRedirectPath,
  };
};
