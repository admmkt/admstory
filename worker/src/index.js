// Servidor de pagamentos do ADM Story (Cloudflare Worker). Adaptado do Rota Segura.
//   POST /checkout  — usuário logado (token do Firebase) escolhe o plano e recebe o link de assinatura do Mercado Pago.
//   POST /verificar — usuário logado pede para conferir no MP (caso o aviso do webhook tenha se perdido).
//   POST /cancelar  — usuário logado cancela a renovação; o período já pago continua valendo.
//   POST /chave     — chave mestra de teste (segredo MASTER_KEY): libera 30 dias para a conta logada.
//   POST /webhook   — o Mercado Pago avisa; conferimos a assinatura HMAC, consultamos a API do MP
//                     (fonte da verdade, nunca o corpo do aviso) e gravamos users/{uid}.paidUntil.
// Não guardamos dado de cartão nem cadastro: só uid, id da assinatura, plano e validade.

const MP = "https://api.mercadopago.com";
const GRACE_MS = 3 * 864e5; // tolerância para a cobrança seguinte cair

export const PLANS = {
  mensal: { months: 1, label: "mensal", price: env => Number(env.PRICE_MENSAL) },
  anual: { months: 12, label: "anual", price: env => Number(env.PRICE_ANUAL) },
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const cors = {
      "Access-Control-Allow-Origin": env.SITE_ORIGIN,
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "POST",
    };
    try {
      if (req.method === "OPTIONS") return new Response(null, { headers: cors });
      if (req.method === "POST" && url.pathname === "/checkout") return withHeaders(await checkout(req, env), cors);
      if (req.method === "POST" && url.pathname === "/verificar") return withHeaders(await verify(req, env), cors);
      if (req.method === "POST" && url.pathname === "/cancelar") return withHeaders(await cancel(req, env), cors);
      if (req.method === "POST" && url.pathname === "/chave") return withHeaders(await masterKey(req, env), cors);
      if (req.method === "POST" && url.pathname === "/webhook") return await webhook(req, url, env);
      return new Response("not found", { status: 404 });
    } catch (e) {
      console.error(e.message); // sem corpo de resposta: pode conter e-mail
      return withHeaders(new Response("erro", { status: 500 }), cors); // 500 faz o MP reenviar o aviso
    }
  },
};

const currentUser = (req, env) => verifyFirebaseToken((req.headers.get("Authorization") || "").replace(/^Bearer /, ""), env.FIREBASE_PROJECT);

async function checkout(req, env) {
  const user = await currentUser(req, env);
  if (!user) return json({ error: "login" }, 401);
  const body = await req.json().catch(() => ({}));
  const plan = PLANS[body.plano];
  if (!plan) return json({ error: "plano" }, 400);
  // O MP exige que quem paga esteja logado no MP com este e-mail; pode ser diferente do e-mail da conta.
  const payerEmail = String(body.payerEmail || user.email || "").trim().toLowerCase();
  if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(payerEmail)) return json({ error: "email" }, 400);

  const sub = await mp(env, "POST", "/preapproval", {
    reason: `ADM Story — plano ${plan.label}`,
    external_reference: user.uid,
    payer_email: payerEmail,
    auto_recurring: { frequency: plan.months, frequency_type: "months", transaction_amount: plan.price(env), currency_id: "BRL" },
    back_url: env.SITE_URL + "?pago=1#conta",
    status: "pending",
  });
  return json({ url: sub.init_point });
}

// shortcut: chave única de teste, sem limite de usos; apagar o segredo MASTER_KEY no lançamento.
async function masterKey(req, env) {
  const user = await currentUser(req, env);
  if (!user) return json({ error: "login" }, 401);
  const { key } = await req.json().catch(() => ({}));
  if (!env.MASTER_KEY || !safeEqual(String(key || "").trim(), env.MASTER_KEY)) return json({ error: "chave" }, 403);
  const token = await googleToken(env);
  const until = Date.now() + 30 * 864e5;
  if (until > await getPaidUntil(env, token, user.uid)) await setPaidUntil(env, token, user.uid, until, "chave-mestra", "teste");
  return json({ ok: true });
}

async function webhook(req, url, env) {
  const dataId = url.searchParams.get("data.id") || "";
  const ok = await validSignature(req.headers.get("x-signature"), req.headers.get("x-request-id"), dataId, env.MP_WEBHOOK_SECRET);
  if (!ok) return new Response("assinatura inválida", { status: 401 });

  const type = url.searchParams.get("type");
  let preapprovalId;
  if (type === "subscription_preapproval") preapprovalId = dataId;
  else if (type === "subscription_authorized_payment") preapprovalId = (await mp(env, "GET", `/authorized_payments/${encodeURIComponent(dataId)}`)).preapproval_id;
  else return new Response("ignorado");

  const sub = await mp(env, "GET", `/preapproval/${encodeURIComponent(preapprovalId)}`);
  if (!/^[A-Za-z0-9]{1,128}$/.test(sub.external_reference || "")) return new Response("sem usuário");
  // Cancelamento ou assinatura recém-criada sem cobrança: nada a liberar. Só pede reenvio enquanto pode vir a 1ª cobrança.
  if (!await syncSubscription(env, sub.external_reference, [sub])) {
    return sub.status === "cancelled" ? new Response("cancelada") : new Response("sem pagamento aprovado", { status: 500 });
  }
  return new Response("ok");
}

const userSubs = async (env, uid) => {
  const { results = [] } = await mp(env, "GET", `/preapproval/search?external_reference=${encodeURIComponent(uid)}&limit=100`);
  return results.filter(s => s.external_reference === uid); // filtra de novo caso o MP ignore o parâmetro
};

// Rede de segurança: o site chama ao voltar do pagamento e no botão "Já paguei".
async function verify(req, env) {
  const user = await currentUser(req, env);
  if (!user) return json({ error: "login" }, 401);
  return json({ ok: await syncSubscription(env, user.uid, await userSubs(env, user.uid)) });
}

// Cancela a renovação automática. paidUntil não muda: o período pago vale até o fim.
// Reembolso dentro dos 7 dias (CDC art. 49) é feito pelo painel do Mercado Pago.
async function cancel(req, env) {
  const user = await currentUser(req, env);
  if (!user) return json({ error: "login" }, 401);
  const active = (await userSubs(env, user.uid)).filter(s => s.status === "authorized" || s.status === "paused");
  for (const s of active) await mp(env, "PUT", `/preapproval/${encodeURIComponent(s.id)}`, { status: "cancelled" });
  return json({ ok: true, canceladas: active.length });
}

/** Grava paidUntil a partir dos pagamentos aprovados das assinaturas. Devolve true se há validade. */
async function syncSubscription(env, uid, subs) {
  let until = 0, subId = "", plan = "";
  for (const sub of subs) {
    const { results = [] } = await mp(env, "GET", `/authorized_payments/search?preapproval_id=${encodeURIComponent(sub.id)}`);
    const months = planMonths(sub);
    const u = paidUntilFrom(results, months);
    if (u > until) { until = u; subId = String(sub.id); plan = months === 12 ? "anual" : "mensal"; }
  }
  if (!until) return false;
  // Reenvio do mesmo aviso é inofensivo: o estado vem sempre da API. Nunca encurta a validade
  // (ex.: assinatura antiga cancelada enquanto existe uma nova em dia).
  const token = await googleToken(env);
  if (until > await getPaidUntil(env, token, uid)) await setPaidUntil(env, token, uid, until, subId, plan);
  return true;
}

/** Meses cobertos por cada cobrança, lido da própria assinatura no MP (1 = mensal, 12 = anual). */
export function planMonths(sub) {
  const r = sub.auto_recurring || {};
  return r.frequency_type === "months" && Number(r.frequency) > 0 ? Number(r.frequency) : 1;
}

/** Validade = último pagamento aprovado + período do plano + tolerância. Cancelar não tira o período já pago. */
export function paidUntilFrom(authorizedPayments, months = 1) {
  const dates = authorizedPayments
    .filter(p => p.payment?.status === "approved")
    .map(p => Date.parse(p.debit_date || p.date_created))
    .filter(t => !isNaN(t));
  if (!dates.length) return 0;
  const d = new Date(Math.max(...dates));
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.getTime() + GRACE_MS;
}

/** Assinatura do aviso do MP: HMAC-SHA256 de "id:<data.id>;request-id:<x-request-id>;ts:<ts>;". */
export async function validSignature(xSignature, requestId, dataId, secret) {
  const parts = Object.fromEntries((xSignature || "").split(",").map(p => p.trim().split("=", 2)));
  if (!parts.ts || !parts.v1 || !secret || !requestId) return false;
  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
  const key = await crypto.subtle.importKey("raw", utf8(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return safeEqual(hex(await crypto.subtle.sign("HMAC", key, utf8(manifest))), parts.v1);
}

/** Comparação em tempo constante (não revela quantos caracteres batem). */
export function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ---- Firebase ---------------------------------------------------------------

/** Confere o token de login do Firebase (RS256, chaves públicas do Google). */
async function verifyFirebaseToken(token, project) {
  const [h, p, s] = token.split(".");
  if (!s) return null;
  const header = JSON.parse(new TextDecoder().decode(b64url(h)));
  const claims = JSON.parse(new TextDecoder().decode(b64url(p)));
  const res = await fetch("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com", { cf: { cacheTtl: 3600 } });
  const jwk = (await res.json()).keys.find(k => k.kid === header.kid);
  if (header.alg !== "RS256" || !jwk) return null;
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64url(s), utf8(h + "." + p));
  const now = Date.now() / 1000;
  if (!valid || claims.aud !== project || claims.iss !== `https://securetoken.google.com/${project}`
      || claims.exp < now || claims.iat > now + 60 || !claims.sub) return null;
  return { uid: claims.sub, email: claims.email };
}

/** Token OAuth da conta de serviço (ignora as regras do Firestore, por isso só fica aqui no servidor). */
async function googleToken(env) {
  const now = Math.floor(Date.now() / 1000);
  const enc = o => b64urlEncode(utf8(JSON.stringify(o)));
  const unsigned = enc({ alg: "RS256", typ: "JWT" }) + "." + enc({
    iss: env.GOOGLE_SA_EMAIL, scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600,
  });
  const der = Uint8Array.from(atob(env.GOOGLE_SA_KEY.replace(/-----[^-]+-----|\\n|\s/g, "")), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, utf8(unsigned));
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: unsigned + "." + b64urlEncode(new Uint8Array(sig)) }),
  });
  if (!res.ok) throw new Error(`google token ${res.status}`);
  return (await res.json()).access_token;
}

const userDoc = (env, uid) => `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT}/databases/(default)/documents/users/${uid}`;

async function getPaidUntil(env, token, uid) {
  const res = await fetch(userDoc(env, uid), { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 404) return 0;
  if (!res.ok) throw new Error(`firestore get ${res.status}`);
  return Date.parse((await res.json()).fields?.paidUntil?.timestampValue || "") || 0;
}

async function setPaidUntil(env, token, uid, until, subscriptionId, plan) {
  const res = await fetch(`${userDoc(env, uid)}?updateMask.fieldPaths=paidUntil&updateMask.fieldPaths=subscriptionId&updateMask.fieldPaths=plan`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: {
      paidUntil: { timestampValue: new Date(until).toISOString() },
      subscriptionId: { stringValue: subscriptionId },
      plan: { stringValue: plan },
    } }),
  });
  if (!res.ok) throw new Error(`firestore patch ${res.status}`);
}

// ---- utilitários ------------------------------------------------------------

async function mp(env, method, path, body) {
  const res = await fetch(MP + path, {
    method,
    headers: { Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`, "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`MP ${method} ${path.split("?")[0]} ${res.status}`);
  return res.json();
}

const utf8 = s => new TextEncoder().encode(s);
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
const b64url = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "=")), c => c.charCodeAt(0));
const b64urlEncode = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });
function withHeaders(res, headers) {
  for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
  return res;
}
