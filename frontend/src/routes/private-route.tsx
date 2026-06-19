import { Spinner } from '@/components/ui/spinner';
import { useAuthUser } from '@/hooks/use-auth-user';
import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { loadingFirebase, loadingMongo, userMongo } = useAuthUser();

  if (loadingFirebase || loadingMongo) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Spinner className="size-8" />
        <span className="ml-2 font-medium text-gray-600">Entrando...</span>
      </div>
    );
  }

  if (!userMongo) {
    console.log('PrivateRoute: usuarioMongo não encontrado', userMongo);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
