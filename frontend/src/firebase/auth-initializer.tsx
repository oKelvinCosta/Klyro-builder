import { useAuthFirebaseStore } from '@/stores/auth-firebase-store';
import { useEffect } from 'react';

/**
 * Monte este componente uma única vez perto da raiz do App
 * (ex: dentro de <App />, antes das rotas).
 * Ele registra o listener do Firebase que mantém `user`/`loading`
 * atualizados na store.
 */
export default function AuthInitializer() {
  const init = useAuthFirebaseStore((s) => s._init);

  useEffect(() => {
    init();
  }, [init]);

  return null;
}
