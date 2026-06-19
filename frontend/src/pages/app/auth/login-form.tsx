import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuthFirebaseStore } from '@/stores/auth-firebase-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { translateErrorFirebase } from './page-auth';

const loginFormSchema = z.object({
  email: z.email('Email inválido.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

export function LoginForm() {
  const login = useAuthFirebaseStore((s) => s.login);
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
      navigate('/app');
    } catch (err: any) {
      toast.error(translateErrorFirebase(err.code));
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
                  autoComplete="email"
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
                  autoComplete="current-password"
                  type="password"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="text-right">
            <Link to="?forgot-password=true">
              <Button variant="link" className="text-secondary text-xs">
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
          <Button variant="link" className="text-secondary text-sm">
            Criar uma conta
          </Button>
        </Link>
      </div>
    </div>
  );
}
