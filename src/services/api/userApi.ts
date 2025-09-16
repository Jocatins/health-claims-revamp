import axiosInstance from './axiosInstance';

// Types for responses (simplified)
export interface UserProfileResponse {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    roles: string[];
    isProvider: boolean;
  };
  message: string;
  isSuccess: boolean;
}

export const updateUserProfile = async (payload: {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}) => {
  const res = await axiosInstance.put<UserProfileResponse>(`/users/${payload.id}`, payload);
  return res.data;
};

export const changePassword = async (payload: { currentPassword: string; newPassword: string }) => {
  const res = await axiosInstance.put<UserProfileResponse>(`/users/change-password`, payload);
  return res.data;
};

export const passwordStrength = (pwd: string): { score: number; label: string } => {
  if (!pwd) return { score: 0, label: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ['Very Weak','Weak','Fair','Good','Strong','Very Strong'];
  return { score, label: labels[score] || '' };
};
