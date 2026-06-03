import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { authClient } from '../lib/auth-client';

export const useGetProfile = (userId) => {
    return useQuery({
        queryKey: ['userProfile', userId],
        queryFn: async () => {
            const { data } = await api.get('/user/profile');
            return data;
        },
        enabled: !!userId,
    });
};

export const useUpdateProfile = (userId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (profileData) => {
            // Kita juga update nama via better-auth agar sinkron dengan session
            if (profileData.name) {
                await authClient.updateUser({ name: profileData.name });
            }
            const { data } = await api.put('/user/profile', profileData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
        }
    });
};

export const useGetSessions = (userId) => {
    return useQuery({
        queryKey: ['userSessions', userId],
        queryFn: async () => {
            const { data } = await api.get('/user/sessions');
            return data;
        },
        enabled: !!userId,
    });
};

export const useRevokeSession = (userId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (token) => {
            const { data } = await api.delete(`/user/sessions/${token}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userSessions', userId] });
        }
    });
};
