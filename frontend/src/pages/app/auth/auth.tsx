import { Link, useSearchParams } from 'react-router-dom';
import { ForgotPasswordForm } from './forgotPasswordForm';
import { LoginForm } from './loginForm';
import { RegisterForm } from './registerForm';

export function translateErrorFirebase(code: string) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este email já está em uso.';
    case 'auth/invalid-email':
      return 'Email inválido.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/weak-password':
      return 'A senha é muito fraca.';
    case 'auth/invalid-credential':
      return 'Credenciais inválidas.';
    default:
      return 'Ocorreu um erro inesperado. Tente novamente.';
  }
}

export default function Auth() {
  const [searchParams] = useSearchParams();

  const isSignUp = searchParams.get('signup') === 'true';
  const isForgotPassword = searchParams.get('forgot-password') === 'true';

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="bg-neon-400 text-space-500 order-2 flex flex-col justify-between p-6 lg:order-1 lg:col-span-6 xl:col-span-4">
        <div></div>
        <div className="text-center">
          <h1 className="text-5xl">
            <Link to="/">Klyro</Link>
          </h1>
          <h2 className="text-lg">Construa experiências de aprendizagem</h2>
        </div>
        <div>
          <small>© 2026 Klyro • Todos os direitos reservados</small>
        </div>
      </div>
      <div className="dark:bg-background order-1 flex items-center justify-center lg:order-2 lg:col-span-6 xl:col-span-8">
        {isForgotPassword ? <ForgotPasswordForm /> : isSignUp ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
}
