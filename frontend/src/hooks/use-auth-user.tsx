// hooks/useAuthUser.ts
import { useUserMongo } from '@/hooks/use-user-mongo';
import { useAuthStoreFirebase } from '@/stores/auth-store-firebase';

/**
 * Custom hook that aggregates authentication state from both Firebase (authentication) and MongoDB (user database).
 * Provides access to Firebase auth user, MongoDB user profile, and their respective loading/error states.
 * @returns Combined auth state containing Firebase user, MongoDB user, and all loading/error flags
 */
export function useAuthUser() {
  // User from Firebase
  const {
    user: userFirebase,
    loading: loadingFirebase,
    error: errorFirebase,
  } = useAuthStoreFirebase();

  // User from MongoDB
  const {
    data: userMongo,
    isLoading: loadingMongo,
    error: errorMongo,
  } = useUserMongo(userFirebase?.uid);

  return {
    userFirebase,
    loadingFirebase,
    errorFirebase,

    userMongo,
    loadingMongo,
    errorMongo,
  };
}
