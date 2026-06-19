import { Button } from '@/components/ui/button';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuthStoreFirebase } from '@/stores/auth-store-firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';
import { translateErrorFirebase } from '../auth/auth';

const forgotPasswordFormSchema = z.object({
  email: z.email('Email inválido.'),
});

export function ForgotPasswordForm() {
  const resetPassword = useAuthStoreFirebase((s) => s.resetPassword);
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
      toast.error(translateErrorFirebase(err.code));
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
          <Button variant="neon" className="w-full text-sm" size={'lg'}>
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
                  autoComplete="email"
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
          <Button variant="link" className="text-secondary text-sm">
            Entrar
          </Button>
        </Link>
      </div>
    </div>
  );
}
