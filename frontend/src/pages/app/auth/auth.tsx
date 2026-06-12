import { Button } from '@/components/ui/button';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';

export default function Auth() {
  const [searchParams] = useSearchParams();

  const isSignUp = searchParams.get('signup') === 'true';

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
        {isSignUp ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
}
const loginFormSchema = z.object({
  email: z.string().email('Email inválido.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

const registerFormSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório.'),
    email: z.string().email('Email inválido.'),
    password: z.string().min(1, 'Senha é obrigatória.'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof loginFormSchema>) {
    toast('You submitted the following values:', {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: 'bottom-right',
      classNames: {
        content: 'flex flex-col gap-2',
      },
      style: {
        '--border-radius': 'calc(var(--radius)  + 4px)',
      } as React.CSSProperties,
    });
  }

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
            >
              Entrar
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
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: z.infer<typeof registerFormSchema>) {
    toast('You submitted the following values:', {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: 'bottom-right',
      classNames: {
        content: 'flex flex-col gap-2',
      },
      style: {
        '--border-radius': 'calc(var(--radius)  + 4px)',
      } as React.CSSProperties,
    });
  }

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
            >
              Criar
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
