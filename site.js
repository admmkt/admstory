import { onUser, entrar, criarConta, esqueciSenha, sair, ouvirPlano, chamarWorker } from "./app/firebase.js";

const $ = id => document.getElementById(id);
const say = text => { $("msg").textContent = text; };

const ERROS = {
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/email-already-in-use": "Já existe conta com este e-mail. Use Entrar.",
  "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
  "auth/invalid-email": "E-mail inválido.",
  "auth/missing-email": "Digite seu e-mail.",
  "auth/too-many-requests": "Muitas tentativas. Espere alguns minutos.",
};
const erro = e => say(ERROS[e.code] || "Não deu certo. Confira a internet e tente de novo.");

// Botões "Assinar mensal/anual" dos cards já deixam o plano escolhido.
document.querySelectorAll("[data-plano]").forEach(a => a.addEventListener("click", () => {
  document.querySelector(`input[name=plano][value=${a.dataset.plano}]`).checked = true;
}));

$("login").onsubmit = e => {
  e.preventDefault();
  say("");
  entrar($("email").value.trim(), $("senha").value).catch(erro);
};
$("criar").onclick = () => {
  if(!$("login").reportValidity()) return;
  say("");
  criarConta($("email").value.trim(), $("senha").value)
    .then(() => say("Conta criada! Enviamos um link de confirmação para o seu e-mail. Agora escolha o plano."))
    .catch(erro);
};
$("esqueci").onclick = () => {
  say("");
  esqueciSenha($("email").value.trim())
    .then(() => say("Se houver conta com este e-mail, enviamos um link para criar uma nova senha."))
    .catch(erro);
};
$("sair").onclick = () => sair();

let stopPlan = null;
onUser(user => {
  stopPlan?.(); stopPlan = null;
  $("login").hidden = !!user;
  $("painel").hidden = !user;
  if(!user) return;
  $("contaEmail").textContent = user.email;
  $("mpEmail").value ||= user.email;
  if(new URLSearchParams(location.search).has("pago")){
    say("Pagamento enviado! A assinatura é liberada assim que o Mercado Pago confirmar, normalmente em segundos.");
    verificar(false);
  }
  // Atualiza sozinho quando o servidor confirma o pagamento.
  stopPlan = ouvirPlano(user.uid, ({until, plan}) => {
    const ativo = until > Date.now();
    const nome = plan === "anual" ? "Plano anual" : plan === "mensal" ? "Plano mensal" : "Assinatura";
    $("status").textContent = ativo
      ? `${nome} ativo até ${new Date(until).toLocaleDateString("pt-BR")}.`
      : "Você ainda não tem assinatura ativa.";
    $("status").classList.toggle("ok", ativo);
    $("ativoBox").hidden = !ativo;
    $("assinarBox").hidden = ativo;
    if(ativo && new URLSearchParams(location.search).has("pago")) say("Tudo certo! Sua assinatura está ativa.");
  }, () => say("Não foi possível ler sua assinatura agora."));
});

$("assinarBtn").onclick = async () => {
  const btn = $("assinarBtn");
  btn.disabled = true;
  say("");
  try{
    const plano = document.querySelector("input[name=plano]:checked").value;
    const {ok, data} = await chamarWorker("/checkout", {plano, payerEmail: $("mpEmail").value.trim()});
    if(!ok || !data.url?.startsWith("https://")) throw new Error(data.error);
    location.href = data.url;
  }catch(e){
    say(e.message === "email" ? "Confira o e-mail do Mercado Pago." : "Não foi possível abrir o pagamento. Tente de novo.");
    btn.disabled = false;
  }
};

// Confere direto no Mercado Pago (caso o aviso automático tenha se perdido); o ouvirPlano mostra o resultado.
async function verificar(avisar){
  const btn = $("verificarBtn");
  btn.disabled = true;
  try{
    const {ok, data} = await chamarWorker("/verificar");
    if(avisar && !data.ok) say(ok
      ? "Ainda não achamos pagamento aprovado nesta conta. Se acabou de pagar, espere alguns minutos e tente de novo."
      : "Não foi possível verificar agora. Tente de novo.");
  }catch{
    if(avisar) say("Não foi possível verificar agora. Tente de novo.");
  }
  btn.disabled = false;
}
$("verificarBtn").onclick = () => { say(""); verificar(true); };

$("cancelarBtn").onclick = async () => {
  if(!confirm("Cancelar a renovação automática? Você continua usando até o fim do período já pago.")) return;
  const btn = $("cancelarBtn");
  btn.disabled = true;
  say("");
  try{
    const {ok} = await chamarWorker("/cancelar");
    say(ok ? "Renovação cancelada. Você não será cobrado de novo." : "Não foi possível cancelar agora. Tente de novo.");
  }catch{
    say("Não foi possível cancelar agora. Tente de novo.");
  }
  btn.disabled = false;
};

// Chave de teste: o Worker confere com o segredo MASTER_KEY e libera 3 dias, uma vez por conta.
$("chaveBtn").onclick = async () => {
  const btn = $("chaveBtn");
  btn.disabled = true;
  say("");
  try{
    const {ok, data} = await chamarWorker("/chave", {key: $("chave").value.trim()});
    say(ok ? "Chave aceita! Acesso liberado por 3 dias." : data.error === "usada" ? "Esta conta já usou a chave de teste." : "Chave inválida.");
    if(ok) $("chave").value = "";
  }catch{
    say("Não foi possível conferir a chave agora. Tente de novo.");
  }
  btn.disabled = false;
};

// Abas do tutorial de instalação; abre na aba do aparelho de quem visita.
const abas = [...document.querySelectorAll(".tabs [role=tab]")];
function abrirAba(tab){
  for(const t of abas){
    const on = t === tab;
    t.setAttribute("aria-selected", on);
    $(t.getAttribute("aria-controls")).hidden = !on;
  }
}
abas.forEach(t => t.onclick = () => abrirAba(t));
if(/android/i.test(navigator.userAgent)) abrirAba($("tab-android"));
