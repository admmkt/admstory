// Trava de assinatura: o editor só abre para conta logada com assinatura em dia.
// shortcut: a checagem roda no navegador (como em qualquer app web estático); quem souber editar o JS
// consegue burlar. Se virar problema, mover algo essencial (ex.: exportação) para trás do Worker.
import { onUser, lerPlano, sair } from "./firebase.js";

const gate = document.getElementById("gate");
const gateTitle = document.getElementById("gateTitle");
const gateText = document.getElementById("gateText");
const gateBtn = document.getElementById("gateBtn");
const gateOut = document.getElementById("gateOut");

function bloquear(titulo, texto, botao){
  gateTitle.textContent = titulo;
  gateText.textContent = texto;
  gateBtn.textContent = botao;
  gateBtn.hidden = false;
  gate.hidden = false;
}

gateOut.addEventListener("click", () => sair());

onUser(async user => {
  gateOut.hidden = !user;
  if(!user){
    bloquear("Entre na sua conta", "Use o e-mail e a senha da sua assinatura do DGA Stories.", "Entrar ou assinar");
    return;
  }
  const key = "admstory.paidUntil." + user.uid;
  let until, plan = "";
  try{
    ({until, plan} = await lerPlano(user.uid));
    try{ localStorage.setItem(key, String(until)); }catch(e){}
  }catch(e){
    // sem internet: vale a última validade conhecida, para o app funcionar offline
    try{ until = Number(localStorage.getItem(key)) || 0; }catch(e2){ until = 0; }
  }
  // app.js usa para a marca d'água e o limite do teste grátis
  try{
    if(plan) localStorage.setItem(key + ".plan", plan);
    else plan = localStorage.getItem(key + ".plan") || ""; // offline: último plano conhecido
  }catch(e){}
  window.admPlano = {uid: user.uid, plan};
  window.dispatchEvent(new Event("admplano"));
  if(until > Date.now()){
    gate.hidden = true;
  }else{
    bloquear(plan === "gratis" ? "Seu teste grátis terminou" : "Assinatura inativa", plan === "gratis" ? "Gostou? Assine para continuar criando stories sem marca d'água e sem limite." : `A conta ${user.email} não tem assinatura ativa. Assine ou renove para continuar.`, "Ver planos");
  }
});
