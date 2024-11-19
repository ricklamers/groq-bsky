import { useSession } from 'next-auth/react'; // Or your auth provider

export function useAuth() {
  const { data: session } = useSession();
  return {
    isAuthenticated: !!session,
  };
} 