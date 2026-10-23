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
    bloquear("Entre na sua conta", "Use o e-mail e a senha da sua assinatura do ADM Story.", "Entrar ou assinar");
    return;
  }
  const key = "admstory.paidUntil." + user.uid;
  let until;
  try{
    until = (await lerPlano(user.uid)).until;
    try{ localStorage.setItem(key, String(until)); }catch(e){}
  }catch(e){
    // sem internet: vale a última validade conhecida, para o app funcionar offline
    try{ until = Number(localStorage.getItem(key)) || 0; }catch(e2){ until = 0; }
  }
  if(until > Date.now()){
    gate.hidden = true;
  }else{
    bloquear("Assinatura inativa", `A conta ${user.email} não tem assinatura ativa. Assine ou renove para continuar.`, "Ver planos");
  }
});
