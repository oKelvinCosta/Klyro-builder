// hooks/useUserMongo.ts
import { auth } from '@/firebase/firebase';
import { api } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

/**
 * React Query hook to fetch the current authenticated user's data from MongoDB
 * @param firebaseUid - Optional Firebase UID of the user. The query will only execute if this value is provided
 * @returns TanStack Query object containing the user's MongoDB data, loading state, and error state
 * @throws Will throw an error if no authentication token is available or the API request fails
 */
export function useUserMongo(firebaseUid?: string) {
  return useQuery({
    queryKey: ['user-mongo', firebaseUid],
    queryFn: async () => {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('No token');

      const { data } = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      return data.user;
    },
    enabled: !!firebaseUid, // 🔴 só roda quando firebase pronto
  });
}
