import { onUser, entrar, criarConta, esqueciSenha, sair, ouvirPlano, chamarWorker } from "./app/firebase.js";

const $ = id => document.getElementById(id);
const say = text => { $("msg").textContent = text; };

const quando = ms => new Date(ms).toLocaleString("pt-BR", {dateStyle: "short", timeStyle: "short"});

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
  testePendente = true; // o teste grátis começa assim que a conta é criada (onUser chama iniciarTeste)
  criarConta($("email").value.trim(), $("senha").value)
    .then(() => say("Conta criada! Enviamos um link de confirmação para o seu e-mail."))
    .catch(e => { testePendente = false; erro(e); });
};
$("esqueci").onclick = () => {
  say("");
  esqueciSenha($("email").value.trim())
    .then(() => say("Se houver conta com este e-mail, enviamos um link para criar uma nova senha."))
    .catch(erro);
};
$("sair").onclick = () => sair();

let stopPlan = null, logado = false, testePendente = false;
onUser(user => {
  stopPlan?.(); stopPlan = null;
  logado = !!user;
  if(user && testePendente){ testePendente = false; iniciarTeste(); }
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
    const valido = until > Date.now();
    const teste = plan === "gratis";
    const ativo = valido && !teste;
    const nome = plan === "anual" ? "Plano anual" : plan === "mensal" ? "Plano mensal" : "Assinatura";
    $("status").textContent = teste && valido
      ? `Teste grátis até ${quando(until)}. Assine para exportar sem marca d'água e sem limite.`
      : teste ? "Seu teste grátis terminou. Assine para continuar exportando."
      : ativo ? `${nome} ativo até ${new Date(until).toLocaleDateString("pt-BR")}.`
      : "Você ainda não tem assinatura ativa.";
    $("status").classList.toggle("ok", valido);
    $("ativoBox").hidden = !ativo;
    $("assinarBox").hidden = ativo;
    $("abrirTeste").hidden = !(teste && valido);
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

// Teste grátis de 24 h: Worker /teste. Resultado num diálogo.
const dlg = $("testeDlg");
function mostrar(titulo, texto, botoes = []){
  $("testeTitulo").textContent = titulo;
  $("testeTexto").textContent = texto;
  $("testeAcoes").replaceChildren(...botoes.map(([rotulo, href, ghost, fn]) => {
    const a = document.createElement("a");
    a.className = "btn" + (ghost ? " ghost" : "");
    a.href = href; a.textContent = rotulo;
    a.onclick = () => { dlg.close(); fn?.(); };
    return a;
  }));
  if(!dlg.open) dlg.showModal();
}
$("testeFechar").onclick = () => dlg.close();
const planos = ["Ver planos", "#planos", true];

async function iniciarTeste(){
  if(!logado){
    testePendente = true;
    mostrar("Crie sua conta para testar", "O teste grátis de 24 horas fica ligado à sua conta e não pede cartão. Ao criar a conta, o teste começa na hora.",
      [["Criar conta ou entrar", "#conta", false, () => setTimeout(() => $("email").focus(), 400)]]);
    return;
  }
  mostrar("Ativando o teste…", "Só um instante.");
  try{
    const {ok, status, data} = await chamarWorker("/teste");
    if(ok && data.ok) mostrar("Teste grátis ativado!", `Você pode usar o app até ${quando(data.until)}: até 3 exportações, com a marca d'água "ADM Story". Depois, assine para exportar sem marca e sem limite.`, [["Começar a usar", "app/"]]);
    else if(status === 409 && data.error === "usado") mostrar("Você já usou o teste grátis nesta conta", "O teste é uma vez por conta. Assine para exportar sem marca d'água e sem limite.", [planos]);
    else if(status === 401) mostrar("Entre na sua conta", "Sua sessão expirou. Entre de novo para ativar o teste.", [["Entrar", "#conta"]]);
    else mostrar("Não foi possível ativar o teste", "Confira a internet e tente de novo.");
  }catch{
    mostrar("Não foi possível ativar o teste", "Confira a internet e tente de novo.");
  }
}
document.querySelectorAll("[data-teste]").forEach(b => b.addEventListener("click", iniciarTeste));

// Vitrine "Três gestos": a imagem do palco troca conforme o passo visível.
const stageImg = $("stageImg");
if("IntersectionObserver" in window){
  const passos = [...document.querySelectorAll(".step")];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if(!e.isIntersecting) return;
    passos.forEach(p => p.classList.toggle("active", p === e.target));
    stageImg.src = e.target.dataset.img;
  }), {rootMargin: "-45% 0px -45% 0px"});
  passos.forEach(p => io.observe(p));
}
