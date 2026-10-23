// Tudo que fala com o Firebase e com o Worker de pagamentos fica aqui (usado pelo app e pelo site).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Endereço do Worker de pagamentos (worker/), preenchido depois do `wrangler deploy`.
export const WORKER_URL = "https://adm-story-pagamentos.dgarpiedits.workers.dev";

// Configuração pública do app web do Firebase (não é segredo; quem protege os dados são as regras).
const app = initializeApp({
  apiKey: "AIzaSyAuZ5vg8ZuAv06amoFKniYtTz6owsLPLYo",
  authDomain: "adm-story-app.firebaseapp.com",
  projectId: "adm-story-app",
  appId: "1:528885874578:web:59af3cf05737bbfd4d8b4b",
});
const auth = getAuth(app);
auth.languageCode = "pt-BR";
const db = getFirestore(app);

export const onUser = cb => onAuthStateChanged(auth, cb);
export const entrar = (email, senha) => signInWithEmailAndPassword(auth, email, senha);
export const criarConta = (email, senha) => createUserWithEmailAndPassword(auth, email, senha).then(c => sendEmailVerification(c.user));
export const esqueciSenha = email => sendPasswordResetEmail(auth, email);
export const sair = () => signOut(auth);

// users/{uid}: { paidUntil, plan, subscriptionId } — gravado só pelo Worker.
const plano = data => ({ until: data?.paidUntil?.toMillis?.() || 0, plan: data?.plan || "" });
export const lerPlano = uid => getDoc(doc(db, "users", uid)).then(s => plano(s.data()));
export const ouvirPlano = (uid, cb, err) => onSnapshot(doc(db, "users", uid), s => cb(plano(s.data())), err);

export async function chamarWorker(rota, body) {
  const res = await fetch(WORKER_URL + rota, {
    method: "POST",
    headers: { Authorization: `Bearer ${await auth.currentUser.getIdToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
}
