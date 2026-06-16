import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/firebase/auth-store';
import React from 'react';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthStore((s) => ({
    user: s.user,
    loading: s.loading,
  }));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/?signup=false" replace />;
  }

  return <>{children}</>;
}
