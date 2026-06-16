import { Button } from '@/components/ui/button';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/firebase/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';

function traduzErroFirebase(code: string) {
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
          <h1 className="text-5xl">Klyro</h1>
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
const loginFormSchema = z.object({
  email: z.email('Email inválido.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

const registerFormSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório.'),
    email: z.email('Email inválido.'),
    password: z.string().min(1, 'Senha é obrigatória.'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof loginFormSchema>) {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err: any) {
      toast.error(traduzErroFirebase(err.code));
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="w-full max-w-[350px]">
      <h3 className="m-0">Bem vindo</h3>
      <span>Acesse seu espaço de trabalho</span>
      {/* Form */}
      <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)} className="pt-10">
        <FieldGroup className="gap-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="form-rhf-input-email" className="text-muted-foreground">
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-input-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="your@email.com"
                  type="email"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="form-rhf-input-password" className="text-muted-foreground">
                  Senha
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-input-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  type="password"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="text-right">
            <Link to="?forgot-password=true">
              <Button variant="link" className="text-xs">
                Esqueci minha senha
              </Button>
            </Link>
          </div>
          <Field orientation="horizontal" className="mt-4">
            <Button
              type="submit"
              form="form-rhf-input"
              variant="neon"
              size={'lg'}
              className="w-full text-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <Separator className="bg-muted my-6 mb-2" />
      {/* Create account */}
      <div className="flex items-center text-sm font-bold">
        Novo no Klyro?{' '}
        <Link to="?signup=true">
          <Button variant="link" className="text-sm">
            Criar uma conta
          </Button>
        </Link>
      </div>
    </div>
  );
}

function RegisterForm() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: z.infer<typeof registerFormSchema>) {
    try {
      await register(data.email, data.password, data.name);
      navigate('/');
    } catch (err: any) {
      toast.error(traduzErroFirebase(err.code));
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="w-full max-w-[350px]">
      <h3 className="m-0">Criar conta</h3>
      <span>Crie sua conta para começar</span>

      <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)} className="pt-10">
        <FieldGroup className="gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="form-rhf-input-name" className="text-muted-foreground">
                  Nome
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-input-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Primeiro nome"
                  type="text"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="form-rhf-input-email" className="text-muted-foreground">
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-input-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="your@email.com"
                  type="email"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="form-rhf-input-password" className="text-muted-foreground">
                  Senha
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-input-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  type="password"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel
                  htmlFor="form-rhf-input-confirm-password"
                  className="text-muted-foreground"
                >
                  Confirmar Senha
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-input-confirm-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  type="password"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Field orientation="horizontal" className="mt-4">
            <Button
              type="submit"
              form="form-rhf-input"
              variant="neon"
              size={'lg'}
              className="w-full text-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Criando...' : 'Criar'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <Separator className="bg-muted my-6 mb-2" />
      {/* Create account */}
      <div className="flex items-center text-sm font-bold">
        Já tem uma conta?{' '}
        <Link to="?signup=false">
          <Button variant="link" className="text-sm">
            Entrar
          </Button>
        </Link>
      </div>
    </div>
  );
}

const forgotPasswordFormSchema = z.object({
  email: z.email('Email inválido.'),
});

function ForgotPasswordForm() {
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: '' },
  });
  const [sent, setSent] = useState(false);

  async function onSubmit(data: z.infer<typeof forgotPasswordFormSchema>) {
    try {
      await resetPassword(data.email);
      setSent(true);
      toast.success('Email de recuperação enviado!');
    } catch (err: any) {
      toast.error(traduzErroFirebase(err.code));
    }
  }

  const isLoading = form.formState.isSubmitting;

  if (sent) {
    return (
      <div className="w-full max-w-[350px] text-center">
        <h3 className="m-0 mb-2">Email enviado!</h3>
        <p className="text-muted-foreground mb-6 text-sm">
          Verifique sua caixa de entrada para redefinir sua senha.
        </p>
        <Link to="?">
          <Button variant="neon" className="w-full">
            Voltar para o login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[350px]">
      <h3 className="m-0">Recuperar senha</h3>
      <span>Enviaremos um link para o seu email</span>

      <form id="form-rhf-forgot" onSubmit={form.handleSubmit(onSubmit)} className="pt-10">
        <FieldGroup className="gap-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor="form-rhf-input-forgot-email" className="text-muted-foreground">
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-input-forgot-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="your@email.com"
                  type="email"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Field orientation="horizontal" className="mt-4">
            <Button
              type="submit"
              form="form-rhf-forgot"
              variant="neon"
              size={'lg'}
              className="w-full text-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Recuperar senha'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <Separator className="bg-muted my-6 mb-2" />
      <div className="flex items-center text-sm font-bold">
        Lembrou a senha?{' '}
        <Link to="?">
          <Button variant="link" className="text-sm">
            Entrar
          </Button>
        </Link>
      </div>
    </div>
  );
}
