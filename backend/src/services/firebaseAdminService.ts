import { cert, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountRaw) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT não definida nas variáveis de ambiente");
}

const serviceAccount = JSON.parse(serviceAccountRaw) as ServiceAccount;

const app = initializeApp({
  credential: cert(serviceAccount),
});

export const auth = getAuth(app);