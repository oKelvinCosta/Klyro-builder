import { Button } from '@/components/ui/button';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuthStoreFirebase } from '@/stores/auth-store-firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';
import { translateErrorFirebase } from '../auth/auth';

const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório.')
      .min(3, 'Nome deve ter pelo menos 3 caracteres.')
      .max(50, 'Nome muito longo.'),

    email: z
      .string()
      .min(1, 'Email é obrigatório.')
      .email('Email inválido.')
      .max(100, 'Email muito longo.'),

    password: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres.')
      .max(50, 'Senha muito longa.')
      .refine((val) => /[A-Z]/.test(val), {
        message: 'A senha deve conter pelo menos 1 letra maiúscula.',
      })
      .refine((val) => /[a-z]/.test(val), {
        message: 'A senha deve conter pelo menos 1 letra minúscula.',
      })
      .refine((val) => /[0-9]/.test(val), {
        message: 'A senha deve conter pelo menos 1 número.',
      }),

    confirmPassword: z.string().min(6, 'Confirmação de senha é obrigatória.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export function RegisterForm() {
  const register = useAuthStoreFirebase((s) => s.register);
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
      navigate('/app');
    } catch (err: any) {
      toast.error(translateErrorFirebase(err.code));
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
                  autoComplete="name"
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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
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
          <Button variant="link" className="text-secondary text-sm">
            Entrar
          </Button>
        </Link>
      </div>
    </div>
  );
}
