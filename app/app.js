/* ============================================================
   PALETAS E FONTES
   ============================================================ */
const PALETTES = [
  {id:"grafite",  name:"Grafite",   base:"#2a2a28", accent:"#ffef2c", text:"#ffffff"},
  {id:"noite",    name:"Noite",     base:"#1b1f3b", accent:"#ff6b5b", text:"#ffffff"},
  {id:"oceano",   name:"Oceano",    base:"#0b2e4a", accent:"#3ad6c5", text:"#ffffff"},
  {id:"floresta", name:"Floresta",  base:"#16302b", accent:"#9be15d", text:"#ffffff"},
  {id:"vinho",    name:"Vinho",     base:"#3b0d1c", accent:"#e7c26b", text:"#ffffff"},
  {id:"rosa",     name:"Rosa",      base:"#2b1330", accent:"#ff7ac6", text:"#ffffff"},
  {id:"claro",    name:"Claro",     base:"#ffffff", accent:"#2563eb", text:"#111827"},
  {id:"mono",     name:"P&B",       base:"#000000", accent:"#ffffff", text:"#ffffff"},
];
const FONTS = [
  {id:"moderna",  name:"Moderna",  title:"600 {s}px 'Poppins', sans-serif"},
  {id:"forte",    name:"Forte",    title:"800 {s}px 'Montserrat', sans-serif"},
  {id:"elegante", name:"Elegante", title:"700 {s}px 'Playfair Display', serif"},
  {id:"impacto",  name:"Impacto",  title:"400 {s}px 'Bebas Neue', sans-serif"},
  {id:"condensada", name:"Condensada", title:"700 {s}px 'Oswald', sans-serif"},
  {id:"classica", name:"Clássica", title:"400 {s}px 'DM Serif Display', serif"},
  {id:"manuscrita", name:"Manuscrita", title:"700 {s}px 'Caveat', cursive"},
  {id:"arredondada", name:"Arredondada", title:"800 {s}px 'Nunito', sans-serif"},
  {id:"bloco",    name:"Bloco",    title:"400 {s}px 'Archivo Black', sans-serif"},
  {id:"letreiro", name:"Letreiro", title:"400 {s}px 'Pacifico', cursive"},
];
const BODY_FONT = "400 {s}px 'Inter', sans-serif";
const HAND_FONT = "700 {s}px 'Caveat', cursive"; // anotações "à mão" dos templates

/* ============================================================
   CAMPOS EXTRAS DOS TEMPLATES
   Cada template lista em `fields` as chaves que usa; o painel mostra só essas.
   multiline: uma entrada por linha (ex.: "Margherita | R$ 49").
   ============================================================ */
const FIELDS = {
  selo:     {label:"Selo", def:"-30%", max:8},
  precoDe:  {label:"Preço antigo", def:"R$ 35,90", max:14},
  precoPor: {label:"Preço novo", def:"R$ 24,90", max:14},
  numero:   {label:"Número", def:"03", max:3},
  unidade:  {label:"Unidade (dias, horas…)", def:"dias", max:12},
  nome:     {label:"Nome do cliente", def:"Mariana S.", max:24},
  detalhe:  {label:"Detalhe do cliente", def:"cliente desde 2024", max:30},
  nota:     {label:"Nota (1 a 5 estrelas)", def:"5", max:1},
  opcao1:   {label:"Opção de cima", def:"PIZZA", max:14},
  opcao2:   {label:"Opção de baixo", def:"BURGER", max:14},
  legenda:  {label:"Etiqueta", def:"04h30 · primeira fornada", max:40},
  legendaPola: {label:"Legenda da foto", def:"aniversário da Júlia, 7 anos", max:40},
  edicao:   {label:"Edição", def:"Edição nº 12 · Outono", max:30},
  carimbo:  {label:"Carimbo", def:"NOVA COLEÇÃO", max:16},
  anotacao: {label:"Anotação à mão", def:"chegando sexta!", max:24},
  seloNovo: {label:"Selo", def:"NOVO", max:8},
  dicas:    {label:"Dicas (título | explicação)", def:"Lave com sabonete próprio | O de rosto resseca os fios.\nÓleo depois do banho | Com a pele ainda úmida.\nApare a cada 15 dias | Mantém o desenho do corte.", max:300, multiline:true},
  itens:    {label:"Itens (nome | preço)", def:"Margherita | R$ 49\nCalabresa | R$ 52\nQuatro queijos | R$ 58\nPortuguesa | R$ 55", max:240, multiline:true},
  dia:      {label:"Dia", def:"08", max:2},
  mes:      {label:"Mês", def:"NOV", max:4},
  semana:   {label:"Dia da semana", def:"SÁB", max:4},
  info1:    {label:"Informação 1 (destaque · resto)", def:"19h · Rua das Flores, 120", max:60},
  info2:    {label:"Informação 2 (destaque · resto)", def:"Vagas limitadas · reserve pelo direct", max:60},
  pergunta: {label:"Pergunta do cliente", def:"Vocês abrem domingo?", max:60},
  resposta: {label:"Sua resposta", def:"Abrimos sim! Das 8h às 14h.", max:60},
  desconto: {label:"Desconto", def:"10%", max:6},
  codigo:   {label:"Código do cupom", def:"BOLO10", max:12},
  validade: {label:"Validade", def:"válido até domingo", max:28},
  parte:    {label:"Parte atual", def:"1", max:1},
  partes:   {label:"Total de partes (até 6)", def:"3", max:1},
  chamada:  {label:"Chamada do botão", def:"Toque para continuar →", max:28},
};

/* categorias do filtro de templates */
const CATEGORIES = [
  {id:"todos", name:"Todos"},
  {id:"vender", name:"Vender"},
  {id:"interagir", name:"Interagir"},
  {id:"confianca", name:"Confiança"},
  {id:"conteudo", name:"Conteúdo"},
  {id:"moldura", name:"Molduras"},
];

/* área da mídia (vídeo ou foto principal / segunda foto) dentro do story.
   undefined = tela cheia; null = sem mídia; função (W,H) => {x,y,w,h,r?,rot?} */
function mediaRect(spec, W, H){
  if(spec === undefined) return {x:0, y:0, w:W, h:H, r:0, rot:0};
  if(spec === null) return null;
  return {r:0, rot:0, ...spec(W, H)};
}

function alpha(hex, a){
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n>>16 & 255},${n>>8 & 255},${n & 255},${a})`;
}

/* ============================================================
   TEXTO
   ============================================================ */
function wrapLines(ctx, text, maxWidth, maxLines){
  const words = (text || "").trim().split(/\s+/).filter(Boolean);
  if(words.length === 0) return [];
  const lines = [];
  let current = "";
  for(let i=0;i<words.length;i++){
    const test = current ? current + " " + words[i] : words[i];
    if(ctx.measureText(test).width > maxWidth && current){
      lines.push(current);
      current = words[i];
      if(lines.length === maxLines - 1){
        // última linha permitida: cabe o resto, com reticências se precisar
        const full = words.slice(i).join(" ");
        let rest = full;
        while(ctx.measureText(rest + "…").width > maxWidth && rest.length > 0) rest = rest.slice(0, -1);
        lines.push(rest.trim() + (rest.length < full.length ? "…" : ""));
        return lines;
      }
    } else {
      current = test;
    }
  }
  if(current) lines.push(current);
  return lines.slice(0, maxLines);
}

function drawParagraph(ctx, text, x, y, maxWidth, lineHeight, maxLines){
  const lines = wrapLines(ctx, text, maxWidth, maxLines);
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
  return lines.length;
}

function roundRectPath(ctx, x, y, w, h, r){
  ctx.beginPath();
  if(ctx.roundRect){ ctx.roundRect(x, y, w, h, r); return; }
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
}

/* desenha a logo numa caixa mantendo a proporção. anchor: 'center'|'left'|'right' */
function drawLogoInBox(ctx, img, boxX, boxW, boxTop, maxH, anchor){
  if(!img) return;
  const ratio = img.width / img.height;
  let h = maxH, w = h * ratio;
  if(w > boxW){ w = boxW; h = w / ratio; }
  let x = boxX;
  if(anchor === "center") x = boxX + (boxW - w)/2;
  else if(anchor === "right") x = boxX + boxW - w;
  ctx.drawImage(img, x, boxTop, w, h);
}

/* ============================================================
   TEMPLATES
   draw(ctx, W, H, t): fundo transparente; medidas derivadas de H.
   t = {title, subtitle, c:{base,accent,text}, tf(size), bf(size), logo}
   ============================================================ */
/* ============================================================
   AUXILIARES DOS TEMPLATES (u = 1% da largura do story)
   ============================================================ */
const WHITE = "#ffffff";
const lum = hex => { const n = parseInt(hex.slice(1), 16); return (0.299*(n>>16 & 255) + 0.587*(n>>8 & 255) + 0.114*(n & 255)) / 255; };
// cor escura da paleta para texto sobre fundo claro (papel); cai num neutro se nenhuma for escura
const inkOf = t => [t.c.base, t.c.accent, t.c.text].find(c => lum(c) < 0.5) || "#2a2a28";
const semi = f => f.replace(/^400 /, "600 "); // Inter seminegrito a partir de t.bf
const setLS = (ctx, px) => { if("letterSpacing" in ctx) ctx.letterSpacing = px + "px"; };
const initials = s => (s || "").trim().split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase();

/* reduz o corpo da fonte até o texto caber em maxW (uma linha) e devolve o tamanho */
function fitFont(ctx, text, mk, size, maxW){
  let s = size;
  ctx.font = mk(s);
  while(ctx.measureText(text).width > maxW && s > size*0.4){ s *= 0.94; ctx.font = mk(s); }
  return s;
}
/* escreve linhas já quebradas; top = topo da 1ª linha, lh = altura da linha */
function putLines(ctx, lines, x, top, size, lh){
  lines.forEach((l, i) => ctx.fillText(l, x, top + i*lh + (lh - size)/2 + size*0.8));
}
function shadeBottom(ctx, W, H, from){
  const y = H*(from == null ? 0.3 : from);
  const g = ctx.createLinearGradient(0, y, 0, H);
  g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.55, "rgba(0,0,0,.55)"); g.addColorStop(1, "rgba(0,0,0,.85)");
  ctx.fillStyle = g; ctx.fillRect(0, y, W, H - y);
}
function dimAll(ctx, W, H, a){ ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, H); }
/* véu da cor base: a0 no topo até a1 em `stop` (0–1) */
function veil(ctx, W, H, c, a0, a1, stop){
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, alpha(c, a0)); g.addColorStop(stop, alpha(c, a1)); g.addColorStop(1, alpha(c, a1));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function logoSafe(ctx, t, x, y, w, h, anchor){
  if(!t.logo) return;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = h*0.25;
  drawLogoInBox(ctx, t.logo, x, w, y, h, anchor);
  ctx.restore();
}
/* pontos seguros da logo: topo (a partir de 12,9% da altura) e base (até 85,5%) */
function logoTop(ctx, W, t, anchor){ const u = W/100; logoSafe(ctx, t, anchor === "left" ? 7*u : W - 37*u, 23*u, 30*u, 6.5*u, anchor); }
function logoBot(ctx, W, t, anchor){ const u = W/100; logoSafe(ctx, t, anchor === "center" ? W/2 - 20*u : anchor === "left" ? 7*u : W - 47*u, 144*u, 40*u, 8*u, anchor || "center"); }

function rr4(ctx, x, y, w, h, tl, tr, br, bl){
  ctx.beginPath();
  ctx.moveTo(x+tl, y); ctx.lineTo(x+w-tr, y); ctx.arcTo(x+w, y, x+w, y+tr, tr);
  ctx.lineTo(x+w, y+h-br); ctx.arcTo(x+w, y+h, x+w-br, y+h, br);
  ctx.lineTo(x+bl, y+h); ctx.arcTo(x, y+h, x, y+h-bl, bl);
  ctx.lineTo(x, y+tl); ctx.arcTo(x, y, x+tl, y, tl);
  ctx.closePath();
}
function starPath(ctx, cx, cy, R){
  ctx.beginPath();
  for(let i = 0; i < 10; i++){
    const a = -Math.PI/2 + i*Math.PI/5, r = i % 2 ? R*0.42 : R;
    if(i) ctx.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r); else ctx.moveTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
  }
  ctx.closePath();
}
/* rótulo com fundo; align "left" (x = borda esquerda) ou "right" (x = borda direita). devolve {w,h} */
function tagBox(ctx, font, txt, x, y, size, bg, fg, padX, padY, rad, align, ls){
  ctx.font = font; setLS(ctx, ls || 0);
  const w = ctx.measureText(txt).width + padX*2, h = size + padY*2;
  const x0 = align === "right" ? x - w : x;
  ctx.fillStyle = bg; roundRectPath(ctx, x0, y, w, h, rad); ctx.fill();
  ctx.fillStyle = fg; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.fillText(txt, x0 + padX, y + h/2 + size*0.04);
  ctx.textBaseline = "alphabetic"; setLS(ctx, 0);
  return {w, h};
}
const STAR_BURST = [[50,0],[61,12],[75,6],[79,21],[94,25],[88,39],[100,50],[88,61],[94,75],[79,79],[75,94],[61,88],[50,100],[39,88],[25,94],[21,79],[6,75],[12,61],[0,50],[12,39],[6,25],[21,21],[25,6],[39,12]];

/* moldura da polaroid: centro (50u, 94,5u), 76u x 89u, girada -4°; a foto fica na parte de cima */
const POLA_ROT = -4*Math.PI/180;
function polaPhoto(W){
  const u = W/100, dy = -6.5*u;
  return {x: 50*u - dy*Math.sin(POLA_ROT) - 34*u, y: 94.5*u + dy*Math.cos(POLA_ROT) - 34*u, w: 68*u, h: 68*u, rot: -4};
}
/* fotos tortas da colagem (caixa branca de 2,6u de borda; centro e giro iguais ao da foto) */
const COLAGEM = [
  {cx: 34, cy: 56, w: 56, h: 68, rot: -6},
  {cx: 69, cy: 93, w: 52, h: 62, rot: 5},
];
const colagemPhoto = i => W => { const u = W/100, p = COLAGEM[i]; return {x: (p.cx - p.w/2 + 2.6)*u, y: (p.cy - p.h/2 + 2.6)*u, w: (p.w - 5.2)*u, h: (p.h - 5.2)*u, rot: p.rot}; };

const PRESETS = [
  {
    id:"faixa-base", name:"Faixa base", cat:"moldura",
    draw(ctx, W, H, t){
      const pad = W*0.07, lineY = H*0.595, lineH = H*0.0042;
      const blockY = lineY + lineH, blockH = H*0.168;
      ctx.fillStyle = t.c.accent; ctx.fillRect(0, lineY, W, lineH);
      ctx.fillStyle = t.c.base;   ctx.fillRect(0, blockY, W, blockH);

      ctx.textAlign = "left";
      ctx.fillStyle = t.c.text;
      ctx.font = t.tf(H*0.038);
      const ty = blockY + H*0.052;
      const n = drawParagraph(ctx, t.title, pad, ty, W - pad*2, H*0.046, 2);
      ctx.font = t.bf(H*0.0225);
      ctx.fillStyle = alpha(t.c.text, .82);
      drawParagraph(ctx, t.subtitle, pad, ty + n*H*0.046 + H*0.018, W - pad*2, H*0.030, 2);

      if(t.logo){
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = H*0.01;
        drawLogoInBox(ctx, t.logo, 0, W, blockY + blockH + H*0.02, H*0.06, "center");
        ctx.restore();
      }
    }
  },
  {
    id:"degrade", name:"Degradê", cat:"moldura",
    draw(ctx, W, H, t){
      const pad = W*0.08, gradTop = H*0.46;
      const grad = ctx.createLinearGradient(0, gradTop, 0, H);
      grad.addColorStop(0, alpha(t.c.base, 0));
      grad.addColorStop(0.55, alpha(t.c.base, .75));
      grad.addColorStop(1, alpha(t.c.base, .94));
      ctx.fillStyle = grad; ctx.fillRect(0, gradTop, W, H - gradTop);

      const eyebrowY = H*0.56;
      ctx.fillStyle = t.c.accent; ctx.fillRect(pad, eyebrowY, H*0.05, H*0.0055);

      ctx.textAlign = "left";
      ctx.fillStyle = t.c.text;
      ctx.font = t.tf(H*0.041);
      const ty = eyebrowY + H*0.055;
      const n = drawParagraph(ctx, t.title, pad, ty, W - pad*2, H*0.048, 2);
      ctx.font = t.bf(H*0.0225);
      ctx.fillStyle = alpha(t.c.text, .82);
      drawParagraph(ctx, t.subtitle, pad, ty + n*H*0.048 + H*0.016, W - pad*2 - H*0.09, H*0.030, 2);

      if(t.logo) drawLogoInBox(ctx, t.logo, W - pad - H*0.09, H*0.09, H*0.80, H*0.055, "right");
    }
  },
  {
    id:"cartao", name:"Cartão", cat:"moldura",
    draw(ctx, W, H, t){
      const pad = W*0.065, cardX = pad, cardW = W - pad*2;
      const cardH = H*0.185, cardY = H*0.66, r = H*0.018;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = H*0.02; ctx.shadowOffsetY = H*0.006;
      ctx.fillStyle = alpha(t.c.base, .96);
      roundRectPath(ctx, cardX, cardY, cardW, cardH, r);
      ctx.fill();
      ctx.restore();

      const inner = cardW*0.075;
      ctx.textAlign = "left";
      ctx.fillStyle = t.c.text;
      ctx.font = t.tf(H*0.034);
      const ty = cardY + H*0.05;
      const n = drawParagraph(ctx, t.title, cardX+inner, ty, cardW - inner*2 - H*0.075, H*0.041, 2);
      ctx.font = t.bf(H*0.021);
      ctx.fillStyle = alpha(t.c.text, .8);
      drawParagraph(ctx, t.subtitle, cardX+inner, ty + n*H*0.041 + H*0.014, cardW - inner*2, H*0.028, 2);

      ctx.fillStyle = t.c.accent;
      ctx.fillRect(cardX + inner, cardY + cardH - H*0.016, H*0.04, H*0.004);

      if(t.logo) drawLogoInBox(ctx, t.logo, cardX + cardW - inner - H*0.06, H*0.06, cardY + H*0.035, H*0.042, "right");
    }
  },
  {
    id:"moldura", name:"Moldura", cat:"moldura",
    draw(ctx, W, H, t){
      // barra de cima desce até 18% (a logo fica na área segura); a de baixo termina em 86%
      const topH = H*0.182, bottomH = H*0.205, ruleH = H*0.0042, botEnd = H*0.86;
      ctx.fillStyle = t.c.base;   ctx.fillRect(0, 0, W, topH);
      ctx.fillStyle = t.c.accent; ctx.fillRect(0, topH, W, ruleH);
      ctx.fillStyle = t.c.accent; ctx.fillRect(0, botEnd-bottomH-ruleH, W, ruleH);
      ctx.fillStyle = t.c.base;   ctx.fillRect(0, botEnd-bottomH, W, bottomH);

      if(t.logo) drawLogoInBox(ctx, t.logo, W*0.3, W*0.4, H*0.125, H*0.045, "center");

      const pad = W*0.09;
      ctx.textAlign = "center";
      ctx.fillStyle = t.c.text;
      ctx.font = t.tf(H*0.036);
      const ty = botEnd - bottomH + H*0.052;
      const n = drawParagraph(ctx, t.title, W/2, ty, W - pad*2, H*0.044, 2);
      ctx.font = t.bf(H*0.0215);
      ctx.fillStyle = alpha(t.c.text, .8);
      drawParagraph(ctx, t.subtitle, W/2, ty + n*H*0.044 + H*0.016, W - pad*2, H*0.029, 2);
    }
  },
  {
    id:"minimal", name:"Minimalista", cat:"moldura",
    draw(ctx, W, H, t){
      const pad = W*0.08, lineY = H*0.64;
      ctx.fillStyle = t.c.accent; ctx.fillRect(pad, lineY, H*0.075, H*0.0058);

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = H*0.012; ctx.shadowOffsetY = H*0.003;
      ctx.textAlign = "left";
      ctx.fillStyle = t.c.text;
      ctx.font = t.tf(H*0.044);
      const ty = lineY + H*0.058;
      const n = drawParagraph(ctx, t.title, pad, ty, W - pad*2 - H*0.08, H*0.05, 2);
      ctx.font = t.bf(H*0.0235);
      ctx.fillStyle = alpha(t.c.text, .88);
      drawParagraph(ctx, t.subtitle, pad, ty + n*H*0.05 + H*0.014, W - pad*2 - H*0.08, H*0.031, 2);
      ctx.restore();

      if(t.logo){
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = H*0.012;
        drawLogoInBox(ctx, t.logo, W - pad - H*0.062, H*0.062, H*0.575, H*0.055, "right");
        ctx.restore();
      }
    }
  },
  {
    id:"etiqueta", name:"Etiqueta", cat:"moldura",
    draw(ctx, W, H, t){
      const pad = W*0.07, fs = H*0.036, padX = W*0.04;
      ctx.font = t.tf(fs);
      const lines = wrapLines(ctx, t.title, W - pad*2 - padX*2, 2);
      const lh = fs*1.45;
      let y = H*0.70 - lines.length*lh;
      // cada linha do título numa etiqueta de destaque
      lines.forEach(line => {
        const w = ctx.measureText(line).width + padX*2;
        ctx.fillStyle = t.c.accent;
        roundRectPath(ctx, pad, y, w, lh*0.92, H*0.008);
        ctx.fill();
        ctx.fillStyle = t.c.base;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(line, pad + padX, y + lh*0.48);
        y += lh;
      });
      ctx.textBaseline = "alphabetic";

      const subLines = (() => { ctx.font = t.bf(H*0.022); return wrapLines(ctx, t.subtitle, W - pad*2 - padX*2, 2); })();
      if(subLines.length){
        const sh = H*0.03*subLines.length + H*0.024;
        const sw = Math.max(...subLines.map(l => ctx.measureText(l).width)) + padX*2;
        ctx.fillStyle = alpha(t.c.base, .92);
        roundRectPath(ctx, pad, y + H*0.006, sw, sh, H*0.008);
        ctx.fill();
        ctx.fillStyle = t.c.text;
        subLines.forEach((l, i) => ctx.fillText(l, pad + padX, y + H*0.006 + H*0.034 + i*H*0.03));
      }

      if(t.logo){
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.45)"; ctx.shadowBlur = H*0.012;
        drawLogoInBox(ctx, t.logo, W - pad - W*0.3, W*0.3, H*0.13, H*0.05, "right");
        ctx.restore();
      }
    }
  },
  {
    id:"manchete", name:"Manchete", cat:"moldura",
    draw(ctx, W, H, t){
      const pad = W*0.07, blockY = H*0.46;
      ctx.fillStyle = t.c.base; ctx.fillRect(0, blockY, W, H - blockY);
      ctx.fillStyle = t.c.accent; ctx.fillRect(0, blockY, W*0.34, H*0.009);

      ctx.textAlign = "left";
      ctx.fillStyle = t.c.text;
      ctx.font = t.tf(H*0.058);
      const ty = blockY + H*0.11;
      const n = drawParagraph(ctx, (t.title || "").toUpperCase(), pad, ty, W - pad*2, H*0.064, 3);
      ctx.font = t.bf(H*0.024);
      ctx.fillStyle = alpha(t.c.text, .78);
      drawParagraph(ctx, t.subtitle, pad, ty + (n-1)*H*0.064 + H*0.055, W - pad*2, H*0.032, 3);

      if(t.logo) drawLogoInBox(ctx, t.logo, W - pad - W*0.4, W*0.4, blockY + H*0.022, H*0.038, "right");
    }
  },

  /* ------------------------------------------------------------
     NOVOS TEMPLATES (v1.2.0). Textos e logo entre 12% e 86% da altura.
     ------------------------------------------------------------ */
  {
    id:"oferta", name:"Oferta relâmpago", cat:"vender", fields:["selo","precoDe","precoPor"],
    draw(ctx, W, H, t){
      const u = W/100, pad = 7*u, maxW = W - pad*2, bottom = H - 36*u;
      shadeBottom(ctx, W, H);
      // selo girado
      ctx.save();
      ctx.translate(W - 21.5*u, 42.5*u); ctx.rotate(9*Math.PI/180);
      ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 5*u; ctx.shadowOffsetY = 2*u;
      ctx.fillStyle = t.c.accent; ctx.beginPath(); ctx.arc(0, 0, 15.5*u, 0, Math.PI*2); ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.fillStyle = t.c.base; ctx.textAlign = "center";
      const s = fitFont(ctx, t.v("selo"), t.tf, 11*u, 24*u);
      ctx.font = t.tf(s); ctx.fillText(t.v("selo"), 0, -1.5*u + s*0.35);
      ctx.font = semi(t.bf(3.6*u)); setLS(ctx, 0.36*u);
      ctx.fillText("SÓ HOJE", 0.18*u, s*0.5 + 2.6*u); setLS(ctx, 0);
      ctx.restore();
      // preço
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      const de = t.v("precoDe"), yB = bottom - 2.4*u;
      ctx.font = t.bf(4.6*u); const wDe = ctx.measureText(de).width;
      ctx.fillStyle = alpha(WHITE, .7); ctx.fillText(de, pad, yB); ctx.fillRect(pad, yB - 1.7*u, wDe, 0.4*u);
      const ps = fitFont(ctx, t.v("precoPor"), t.tf, 13*u, maxW - wDe - 3*u);
      ctx.fillStyle = t.c.accent; ctx.fillText(t.v("precoPor"), pad + wDe + 3*u, yB);
      // nome do produto
      ctx.font = t.tf(9.5*u); ctx.fillStyle = WHITE;
      const tl = wrapLines(ctx, (t.title || "").toUpperCase(), maxW, 2), lh = 9.7*u;
      const tTop = bottom - 15*u - tl.length*lh;
      putLines(ctx, tl, pad, tTop, 9.5*u, lh);
      // rótulo
      const lab = (t.subtitle || "").toUpperCase();
      if(lab){
        ctx.font = t.tf(3.4*u); setLS(ctx, 0.27*u);
        const l1 = wrapLines(ctx, lab, maxW - 6*u, 1)[0];
        tagBox(ctx, t.tf(3.4*u), l1, pad, tTop - 3*u - 7.3*u, 3.4*u, t.c.accent, t.c.base, 3*u, 1.95*u, 1.4*u, "left", 0.27*u);
      }
      logoTop(ctx, W, t, "left");
    }
  },
  {
    id:"contagem", name:"Contagem regressiva", cat:"vender", fields:["numero","unidade"],
    slots:W => { const u = W/100; return [{x:16*u, y:118*u, w:68*u, h:22*u, label:"Figurinha de contagem regressiva"}]; },
    draw(ctx, W, H, t){
      const u = W/100;
      dimAll(ctx, W, H, 0.5);
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.font = semi(t.bf(3.6*u)); setLS(ctx, 1.26*u); ctx.fillStyle = t.c.accent;
      putLines(ctx, wrapLines(ctx, (t.subtitle || "").toUpperCase(), 84*u, 1), W/2 + 0.6*u, 30*u, 3.6*u, 5*u); setLS(ctx, 0);
      const num = t.v("numero");
      const ns = fitFont(ctx, num, t.tf, 50*u, W - 12*u);
      ctx.fillStyle = WHITE; ctx.fillText(num, W/2, 39*u + ns*0.77);
      const yb = 39*u + ns*0.82 + 8.5*u;
      ctx.font = t.tf(6.4*u); setLS(ctx, 1.28*u);
      ctx.fillText(wrapLines(ctx, t.v("unidade").toUpperCase(), 80*u, 1)[0] || "", W/2 + 0.64*u, yb); setLS(ctx, 0);
      ctx.font = t.bf(4.4*u); ctx.fillStyle = alpha(WHITE, .88);
      putLines(ctx, wrapLines(ctx, t.title, 84*u, 2), W/2, yb + 5*u, 4.4*u, 6*u);
      logoBot(ctx, W, t, "center");
    }
  },
  {
    id:"depoimento", name:"Depoimento", cat:"confianca", fields:["nome","detalhe","nota"],
    draw(ctx, W, H, t){
      const u = W/100, x = 6*u, w = W - 12*u, pad = 7*u, bottom = H - 34*u;
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      ctx.font = semi(t.bf(5.4*u));
      const ph = wrapLines(ctx, t.subtitle, w - pad*2, 4), lh = 7.3*u;
      const h = pad + 7*u + 2.5*u + ph.length*lh + 4*u + 9*u + 6*u, y = bottom - h;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 8*u; ctx.shadowOffsetY = 3*u;
      ctx.fillStyle = WHITE; roundRectPath(ctx, x, y, w, h, 5*u); ctx.fill();
      ctx.restore();
      // aspas e estrelas
      ctx.font = `700 ${24*u}px 'Playfair Display', serif`; ctx.fillStyle = t.c.accent;
      ctx.fillText("“", x + 6*u, y + 10.2*u);
      const nota = Math.min(5, Math.max(1, parseInt(t.v("nota"), 10) || 5));
      for(let i = 0; i < 5; i++){
        starPath(ctx, x + pad + 2.9*u + i*6.6*u, y + pad + 3.6*u, 2.9*u);
        ctx.fillStyle = i < nota ? "#f5a400" : "rgba(0,0,0,.16)"; ctx.fill();
      }
      ctx.font = semi(t.bf(3.2*u)); ctx.fillStyle = "#6b7280"; ctx.textAlign = "right";
      ctx.fillText(wrapLines(ctx, (t.title || "").toUpperCase(), 30*u, 1)[0] || "", x + w - pad, y + pad + 4.7*u);
      // frase
      ctx.textAlign = "left"; ctx.font = semi(t.bf(5.4*u)); ctx.fillStyle = "#111827";
      putLines(ctx, ph, x + pad, y + pad + 9.5*u, 5.4*u, lh);
      // quem disse
      const by = y + pad + 9.5*u + ph.length*lh + 4*u;
      ctx.fillStyle = t.c.accent; ctx.beginPath(); ctx.arc(x + pad + 4.5*u, by + 4.5*u, 4.5*u, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = t.c.base; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = semi(t.bf(3.6*u));
      ctx.fillText(initials(t.v("nome")), x + pad + 4.5*u, by + 4.6*u);
      ctx.textAlign = "left";
      ctx.font = semi(t.bf(3.6*u)); ctx.fillStyle = "#111827";
      ctx.fillText(wrapLines(ctx, t.v("nome"), w - pad*2 - 12*u, 1)[0] || "", x + pad + 12*u, by + 2.5*u);
      ctx.font = t.bf(3.4*u); ctx.fillStyle = "#4b5563";
      ctx.fillText(wrapLines(ctx, t.v("detalhe"), w - pad*2 - 12*u, 1)[0] || "", x + pad + 12*u, by + 6.9*u);
      ctx.textBaseline = "alphabetic";
      logoTop(ctx, W, t, "left");
    }
  },
  {
    id:"antes-depois", name:"Antes e depois", cat:"confianca",
    media:(W, H) => ({x:0, y:H/2, w:W, h:H/2}),
    media2:(W, H) => ({x:0, y:0, w:W, h:H/2, filter:"grayscale(1)"}), media2Label:"Foto do antes (sai em preto e branco)",
    draw(ctx, W, H, t){
      const u = W/100;
      ctx.fillStyle = "rgba(12,14,18,.4)"; ctx.fillRect(0, 0, W, H/2);
      ctx.fillStyle = t.c.accent; ctx.fillRect(0, H/2 - 0.5*u, W, 1*u);
      // botão do meio
      ctx.fillStyle = t.c.accent; ctx.beginPath(); ctx.arc(W/2, H/2, 6*u, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = t.c.base;
      ctx.beginPath(); ctx.moveTo(W/2, H/2 - 3.8*u); ctx.lineTo(W/2 - 2.2*u, H/2 - 1*u); ctx.lineTo(W/2 + 2.2*u, H/2 - 1*u); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(W/2, H/2 + 3.8*u); ctx.lineTo(W/2 - 2.2*u, H/2 + 1*u); ctx.lineTo(W/2 + 2.2*u, H/2 + 1*u); ctx.closePath(); ctx.fill();
      // rótulos
      tagBox(ctx, t.tf(4*u), "ANTES", 6*u, 24*u, 4*u, "rgba(255,255,255,.92)", inkOf(t), 3.4*u, 1.8*u, 1.4*u, "left", 0.6*u);
      tagBox(ctx, t.tf(4*u), "DEPOIS", 6*u, 96*u, 4*u, t.c.accent, t.c.base, 3.4*u, 1.8*u, 1.4*u, "left", 0.6*u);
      // legenda
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = t.bf(3.8*u);
      const sub = wrapLines(ctx, t.subtitle, 78*u - 4*u, 2);
      const h = 4*u + 6.8*u + (sub.length ? sub.length*5.4*u + 0.5*u : 0) + 4*u, y = H - 38*u - h;
      ctx.fillStyle = alpha(t.c.base, .96); roundRectPath(ctx, 6*u, y, 88*u, h, 3*u); ctx.fill();
      ctx.fillStyle = t.c.text; ctx.font = t.tf(5.4*u);
      ctx.fillText(wrapLines(ctx, t.title, 78*u, 1)[0] || "", 11*u, y + 4*u + 5.4*u*0.95);
      ctx.font = t.bf(3.8*u); ctx.fillStyle = alpha(t.c.text, .8);
      putLines(ctx, sub, 11*u, y + 4*u + 7.3*u, 3.8*u, 5.4*u);
      logoTop(ctx, W, t, "right");
    }
  },
  {
    id:"isso-aquilo", name:"Isso ou aquilo", cat:"interagir", fields:["opcao1","opcao2"],
    media:(W, H) => ({x:0, y:0, w:W, h:H/2}),
    media2:(W, H) => ({x:0, y:H/2, w:W, h:H/2}), media2Label:"Foto da opção de baixo",
    slots:W => { const u = W/100; return [{x:14*u, y:120*u, w:72*u, h:20*u, label:"Figurinha de enquete"}]; },
    draw(ctx, W, H, t){
      const u = W/100;
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "center";
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,.7)"; ctx.shadowBlur = 3*u; ctx.shadowOffsetY = 0.6*u;
      ctx.fillStyle = WHITE; ctx.font = t.tf(7.6*u);
      const q = wrapLines(ctx, t.title, 88*u, 2);
      putLines(ctx, q, W/2, 22*u, 7.6*u, 9*u);
      if(t.subtitle){ ctx.font = t.bf(4*u); putLines(ctx, wrapLines(ctx, t.subtitle, 84*u, 1), W/2, 22*u + q.length*9*u + 1.5*u, 4*u, 5.5*u); }
      ctx.restore();
      tagBox(ctx, t.tf(5*u), t.v("opcao1").toUpperCase(), 6*u, 66*u, 5*u, t.c.base, t.c.text, 3.6*u, 1.8*u, 1.4*u, "left", 0.6*u);
      tagBox(ctx, t.tf(5*u), t.v("opcao2").toUpperCase(), W - 6*u, 104*u, 5*u, t.c.base, t.c.text, 3.6*u, 1.8*u, 1.4*u, "right", 0.6*u);
      // OU
      ctx.fillStyle = t.c.base; ctx.beginPath(); ctx.arc(W/2, H/2, 11.4*u, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = t.c.accent; ctx.beginPath(); ctx.arc(W/2, H/2, 10*u, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = t.c.base; ctx.font = t.tf(7*u); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("OU", W/2, H/2 + 0.4*u); ctx.textBaseline = "alphabetic";
      logoBot(ctx, W, t, "center");
    }
  },
  {
    id:"perguntas", name:"Caixa de perguntas", cat:"interagir",
    slots:W => { const u = W/100; return [{x:12*u, y:88*u, w:76*u, h:40*u, label:"Figurinha de perguntas"}]; },
    draw(ctx, W, H, t){
      const u = W/100;
      veil(ctx, W, H, t.c.base, 0.55, 0.92, 1);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = t.tf(11.5*u);
      const tl = wrapLines(ctx, t.title, 84*u, 2), lh = 12.1*u;
      tl.forEach((l, i) => { ctx.fillStyle = i === tl.length - 1 && tl.length > 1 || tl.length === 1 ? t.c.accent : t.c.text; putLines(ctx, [l], 8*u, 30*u + i*lh, 11.5*u, lh); });
      ctx.font = t.bf(4.4*u); ctx.fillStyle = alpha(t.c.text, .88);
      putLines(ctx, wrapLines(ctx, t.subtitle, 84*u, 3), 8*u, 30*u + tl.length*lh + 4*u, 4.4*u, 6.2*u);
      logoBot(ctx, W, t, "center");
    }
  },
  {
    id:"bastidores", name:"Bastidores", cat:"conteudo", fields:["legenda"],
    draw(ctx, W, H, t){
      const u = W/100;
      const tape = (cx, cy, deg) => {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(deg*Math.PI/180);
        ctx.shadowColor = "rgba(0,0,0,.15)"; ctx.shadowBlur = u; ctx.shadowOffsetY = 0.4*u;
        ctx.fillStyle = "rgba(255,236,170,.82)"; ctx.fillRect(-15*u, -3.5*u, 30*u, 7*u);
        ctx.restore();
      };
      tape(11*u, 27.5*u, -12); tape(90*u, 145.5*u, -8);
      // título manuscrito torto
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      ctx.font = t.hf(13*u);
      const tl = wrapLines(ctx, t.title, 84*u, 2), lh = 12.4*u, th = tl.length*lh;
      ctx.save();
      ctx.translate(W/2, 30*u + th/2); ctx.rotate(-4*Math.PI/180);
      ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 2.5*u; ctx.shadowOffsetY = 0.5*u;
      ctx.fillStyle = WHITE; ctx.font = t.hf(13*u);
      putLines(ctx, tl, -42*u, -th/2, 13*u, lh);
      ctx.restore();
      if(t.subtitle){
        ctx.save(); ctx.shadowColor = "rgba(0,0,0,.7)"; ctx.shadowBlur = 2*u;
        ctx.font = t.bf(4.4*u); ctx.fillStyle = WHITE;
        putLines(ctx, wrapLines(ctx, t.subtitle, 84*u, 2), 8*u, 30*u + th + 5*u, 4.4*u, 6*u);
        ctx.restore();
      }
      // etiqueta de máquina de escrever
      ctx.font = `400 ${3.8*u}px ui-monospace, Consolas, monospace`;
      const ll = wrapLines(ctx, t.v("legenda"), 70*u, 2), llh = 4.94*u;
      const bw = Math.max(1, ...ll.map(l => ctx.measureText(l).width)) + 6.8*u, bh = ll.length*llh + 4.8*u;
      ctx.save();
      ctx.translate(8*u + bw/2, H - 40*u - bh/2); ctx.rotate(2*Math.PI/180);
      ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 3*u; ctx.shadowOffsetY = 1*u;
      ctx.fillStyle = "#fffdf6"; ctx.fillRect(-bw/2, -bh/2, bw, bh);
      ctx.shadowColor = "transparent"; ctx.fillStyle = "#222";
      putLines(ctx, ll, -bw/2 + 3.4*u, -bh/2 + 2.4*u, 3.8*u, llh);
      ctx.restore();
      logoBot(ctx, W, t, "right");
    }
  },
  {
    id:"revista", name:"Capa de revista", cat:"conteudo", fields:["edicao"],
    draw(ctx, W, H, t){
      const u = W/100;
      shadeBottom(ctx, W, H);
      const gt = ctx.createLinearGradient(0, 0, 0, H*0.34);
      gt.addColorStop(0, "rgba(0,0,0,.7)"); gt.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gt; ctx.fillRect(0, 0, W, H*0.34);
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      // nome da marca no topo
      setLS(ctx, 10*u*0.06);
      const mast = (t.title || "").toUpperCase();
      const ms = fitFont(ctx, mast, t.tf, 10*u, 86*u);
      ctx.fillStyle = WHITE; ctx.fillText(mast, W/2 + 0.3*u, 21*u + ms*0.82); setLS(ctx, 0);
      const rule = 21*u + ms + 2.4*u;
      ctx.fillRect(6*u, rule, 88*u, 0.3*u);
      ctx.font = semi(t.bf(3*u)); setLS(ctx, 0.9*u);
      ctx.fillText(wrapLines(ctx, t.v("edicao").toUpperCase(), 84*u, 1)[0] || "", W/2 + 0.45*u, rule + 0.3*u + 1.4*u + 2.5*u); setLS(ctx, 0);
      ctx.fillRect(6*u, rule + 0.3*u + 1.4*u + 3.6*u + 1.4*u, 88*u, 0.3*u);
      // manchete
      ctx.textAlign = "left"; ctx.fillStyle = WHITE; ctx.font = t.tf(12*u);
      const hl = wrapLines(ctx, t.subtitle, 86*u, 3), lh = 12*u*1.0;
      putLines(ctx, hl, 7*u, H - 36*u - hl.length*lh, 12*u, lh);
      logoBot(ctx, W, t, "right");
    }
  },
  {
    id:"colagem", name:"Colagem", cat:"conteudo", fields:["carimbo","anotacao"],
    media:colagemPhoto(0), media2:colagemPhoto(1), media2Label:"Segunda foto da colagem",
    under(ctx, W, H, t){
      const u = W/100;
      ctx.fillStyle = "#e7dac3"; ctx.fillRect(0, 0, W, H);
      let g = ctx.createRadialGradient(W*0.2, H*0.3, 0, W*0.2, H*0.3, 520);
      g.addColorStop(0, "rgba(255,255,255,.35)"); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      g = ctx.createRadialGradient(W*0.8, H*0.8, 0, W*0.8, H*0.8, 560);
      g.addColorStop(0, "rgba(120,90,50,.18)"); g.addColorStop(1, "rgba(120,90,50,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(0,0,0,.025)";
      for(let y = 0; y < H; y += 1.2*u) ctx.fillRect(0, y, W, 0.3*u);
      COLAGEM.forEach(p => {
        ctx.save();
        ctx.translate(p.cx*u, p.cy*u); ctx.rotate(p.rot*Math.PI/180);
        ctx.shadowColor = "rgba(60,40,20,.35)"; ctx.shadowBlur = 4*u; ctx.shadowOffsetY = 2*u;
        ctx.fillStyle = WHITE; ctx.fillRect(-p.w/2*u, -p.h/2*u, p.w*u, p.h*u);
        ctx.restore();
      });
    },
    draw(ctx, W, H, t){
      const u = W/100, ink = inkOf(t);
      // fitas
      [[36*u, 22*u, 4], [72*u, 62*u, -10]].forEach(([cx, cy, deg]) => {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(deg*Math.PI/180);
        ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fillRect(-10*u, -3*u, 20*u, 6*u);
        ctx.strokeStyle = "rgba(0,0,0,.06)"; ctx.lineWidth = 0.2*u; ctx.strokeRect(-10*u, -3*u, 20*u, 6*u);
        ctx.restore();
      });
      // carimbo
      ctx.save();
      ctx.translate(W - 21*u, 43*u); ctx.rotate(14*Math.PI/180);
      ctx.strokeStyle = ink; ctx.lineWidth = 1*u; ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.arc(0, 0, 12.5*u, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.font = t.tf(4*u);
      const cl = wrapLines(ctx, t.v("carimbo").toUpperCase(), 21*u, 2);
      putLines(ctx, cl, 0, -cl.length*4.4*u/2, 4*u, 4.4*u);
      ctx.restore();
      // anotação à mão e seta
      ctx.textAlign = "left"; ctx.fillStyle = ink; ctx.font = t.hf(10*u);
      const nl = wrapLines(ctx, t.v("anotacao"), 36*u, 2);
      ctx.save(); ctx.translate(8*u, 128*u); ctx.rotate(-3*Math.PI/180);
      putLines(ctx, nl, 0, 0, 10*u, 9.5*u); ctx.restore();
      ctx.save();
      ctx.translate(45*u, 126*u); ctx.scale(0.4*u, 0.4*u);
      ctx.strokeStyle = ink; ctx.lineWidth = 2.2; ctx.lineCap = "round";
      ctx.stroke(new Path2D("M2 6c10 2 20 10 28 20M30 26l1-8M30 26l-8-1"));
      ctx.restore();
      // título
      ctx.fillStyle = ink; ctx.font = t.tf(6*u);
      putLines(ctx, wrapLines(ctx, t.title, 36*u, 3), 58*u, 128*u, 6*u, 7*u);
      logoTop(ctx, W, t, "right");
    }
  },
  {
    id:"tipografia", name:"Tipografia gigante", cat:"conteudo",
    draw(ctx, W, H, t){
      const u = W/100;
      dimAll(ctx, W, H, 0.25);
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      const word = (t.title || "").toUpperCase().replace(/\s+/g, " ");
      const s = fitFont(ctx, word, t.tf, 33*u, W*0.96);
      const b1 = 54*u + s*0.78, lh = s*0.86;
      ctx.fillStyle = WHITE; ctx.fillText(word, W/2, b1);
      ctx.strokeStyle = t.c.accent; ctx.lineWidth = 0.5*u; ctx.lineJoin = "round";
      ctx.strokeText(word, W/2, b1 + lh);
      ctx.globalAlpha = 0.45; ctx.strokeText(word, W/2, b1 + lh*2); ctx.globalAlpha = 1;
      const sub = (t.subtitle || "").toUpperCase();
      setLS(ctx, 1.26*u); ctx.fillStyle = WHITE;
      fitFont(ctx, sub, x => semi(t.bf(x)), 4.2*u, 88*u);
      ctx.fillText(sub, W/2 + 0.63*u, b1 + lh*2 + 22*u); setLS(ctx, 0);
      logoBot(ctx, W, t, "center");
    }
  },
  {
    id:"polaroid", name:"Polaroid", cat:"vender", fields:["legendaPola"],
    media:polaPhoto,
    under(ctx, W, H, t){
      const u = W/100;
      ctx.fillStyle = t.c.accent; ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.translate(50*u, 94.5*u); ctx.rotate(POLA_ROT);
      ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 6*u; ctx.shadowOffsetY = 3*u;
      ctx.fillStyle = WHITE; ctx.fillRect(-38*u, -44.5*u, 76*u, 89*u);
      ctx.restore();
    },
    draw(ctx, W, H, t){
      const u = W/100;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = t.c.base; ctx.font = t.tf(7.6*u);
      const tl = wrapLines(ctx, t.title, 84*u, 2);
      putLines(ctx, tl, 8*u, 22*u, 7.6*u, 8*u);
      ctx.font = t.bf(4*u); ctx.fillStyle = alpha(t.c.base, .85);
      putLines(ctx, wrapLines(ctx, t.subtitle, 84*u, 1), 8*u, 22*u + tl.length*8*u + 2*u, 4*u, 5.4*u);
      // legenda na borda branca
      ctx.save();
      ctx.translate(50*u, 94.5*u); ctx.rotate(POLA_ROT);
      ctx.fillStyle = "#333"; ctx.textAlign = "center";
      // uma linha só: encolhe a letra até caber na borda branca
      const ls = fitFont(ctx, t.v("legendaPola"), t.hf, 7.2*u, 66*u);
      putLines(ctx, [t.v("legendaPola")], 0, 36*u - 3.5*u, ls, 7*u);
      ctx.restore();
      logoBot(ctx, W, t, "right");
    }
  },
  {
    id:"novidade", name:"Chegou novidade", cat:"vender", fields:["seloNovo"],
    draw(ctx, W, H, t){
      const u = W/100, pad = 7*u, maxW = W - pad*2;
      shadeBottom(ctx, W, H);
      // selo estourado
      ctx.save();
      ctx.translate(23*u, 42*u); ctx.rotate(-12*Math.PI/180);
      ctx.fillStyle = t.c.accent; ctx.beginPath();
      STAR_BURST.forEach(([px, py], i) => { const X = (px - 50)*0.32*u, Y = (py - 50)*0.32*u; if(i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = t.c.base; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      const s = fitFont(ctx, t.v("seloNovo"), t.tf, 7*u, 21*u);
      ctx.fillText(t.v("seloNovo"), 0, s*0.35); ctx.restore();
      // texto
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = t.bf(4.4*u);
      const sl = wrapLines(ctx, t.subtitle, maxW, 3), slh = 6.2*u;
      ctx.font = t.tf(11*u);
      const tl = wrapLines(ctx, t.title, maxW, 2), tlh = 11.2*u;
      const bottom = H - 37*u;
      const subTop = bottom - sl.length*slh, titleTop = subTop - (sl.length ? 3*u : 0) - tl.length*tlh;
      ctx.fillStyle = WHITE; putLines(ctx, tl, pad, titleTop, 11*u, tlh);
      ctx.font = t.bf(4.4*u); ctx.fillStyle = alpha(WHITE, .9); putLines(ctx, sl, pad, subTop, 4.4*u, slh);
      ctx.fillStyle = t.c.accent; ctx.fillRect(pad, titleTop - 5.2*u, 16*u, 1.2*u);
      logoTop(ctx, W, t, "right");
    }
  },
  {
    id:"dicas", name:"Lista de dicas", cat:"conteudo", fields:["dicas"],
    draw(ctx, W, H, t){
      const u = W/100;
      veil(ctx, W, H, t.c.base, 0.6, 0.94, 0.55);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = t.tf(9*u);
      const tl = wrapLines(ctx, t.title, 84*u, 2);
      ctx.fillStyle = t.c.text; putLines(ctx, tl, 8*u, 28*u, 9*u, 9.4*u);
      let y = 28*u + tl.length*9.4*u + 7*u;
      t.lines("dicas").slice(0, 3).forEach((raw, i) => {
        const [head, ...rest] = raw.split("|").map(s => s.trim());
        const body = rest.join(" | ");
        ctx.fillStyle = t.c.accent; ctx.beginPath(); ctx.arc(13.5*u, y + 5.5*u, 5.5*u, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = t.c.base; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = t.tf(5.4*u);
        ctx.fillText(String(i + 1), 13.5*u, y + 5.7*u); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        const x = 23*u, w = 69*u;
        ctx.font = semi(t.bf(5*u)); ctx.fillStyle = t.c.text;
        const hl = wrapLines(ctx, head, w, 1);
        putLines(ctx, hl, x, y, 5*u, 6.4*u);
        ctx.font = t.bf(4.3*u); ctx.fillStyle = alpha(t.c.text, .85);
        const bl = body ? wrapLines(ctx, body, w, 2) : [];
        putLines(ctx, bl, x, y + 6.6*u, 4.3*u, 5.8*u);
        y += Math.max(11*u, 6.6*u + bl.length*5.8*u) + 5.4*u;
      });
      logoBot(ctx, W, t, "center");
    }
  },
  {
    id:"cardapio", name:"Cardápio do dia", cat:"vender", fields:["itens"],
    media:(W, H) => ({x:0, y:0, w:W, h:H*0.48}),
    draw(ctx, W, H, t){
      const u = W/100, top = H*0.46;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 4*u; ctx.shadowOffsetY = -1*u;
      ctx.fillStyle = t.c.base; rr4(ctx, 0, top, W, H - top, 6*u, 6*u, 0, 0); ctx.fill();
      ctx.restore();
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = semi(t.bf(3.2*u)); setLS(ctx, 0.64*u); ctx.fillStyle = t.c.accent;
      ctx.fillText(wrapLines(ctx, (t.subtitle || "").toUpperCase(), 84*u, 1)[0] || "", 8*u, top + 8*u + 3.2*u); setLS(ctx, 0);
      ctx.font = t.tf(8.6*u); ctx.fillStyle = t.c.text;
      const tl = wrapLines(ctx, t.title, 84*u, 1);
      putLines(ctx, tl, 8*u, top + 8*u + 5.5*u, 8.6*u, 9*u);
      const rows = t.lines("itens").slice(0, 5);
      const listTop = top + 8*u + 5.5*u + 9*u + 5*u;
      const step = Math.min(9.6*u, (152*u - listTop) / Math.max(1, rows.length));
      rows.forEach((raw, i) => {
        const [name, ...p] = raw.split("|").map(s => s.trim()), price = p.join(" | ");
        const base = listTop + i*step + 5.2*u;
        ctx.font = semi(t.bf(4.6*u)); ctx.fillStyle = t.c.text; ctx.textAlign = "left";
        ctx.font = semi(t.bf(fitFont(ctx, name, x => semi(t.bf(x)), 4.6*u, 56*u)));
        ctx.fillText(name, 8*u, base); const w1 = ctx.measureText(name).width;
        ctx.font = semi(t.bf(4.6*u)); ctx.fillStyle = t.c.accent; ctx.textAlign = "right";
        ctx.fillText(price, W - 8*u, base); const w2 = ctx.measureText(price).width;
        ctx.save(); ctx.strokeStyle = alpha(t.c.text, .4); ctx.lineWidth = 0.5*u; ctx.lineCap = "round"; ctx.setLineDash([0.1*u, 1.2*u]);
        ctx.beginPath(); ctx.moveTo(8*u + w1 + 2*u, base - 1*u); ctx.lineTo(W - 8*u - w2 - 2*u, base - 1*u); ctx.stroke();
        ctx.restore();
      });
      ctx.textAlign = "left";
      logoTop(ctx, W, t, "right");
    }
  },
  {
    id:"evento", name:"Evento", cat:"vender", fields:["dia","mes","semana","info1","info2"],
    draw(ctx, W, H, t){
      const u = W/100, pad = 7*u, maxW = W - pad*2;
      veil(ctx, W, H, t.c.base, 0.35, 0.92, 0.6);
      // bloco de calendário
      ctx.fillStyle = t.c.accent; roundRectPath(ctx, pad, 26*u, 30*u, 32.6*u, 3*u); ctx.fill();
      ctx.fillStyle = t.c.base; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.font = t.tf(4.4*u); setLS(ctx, 0.44*u);
      ctx.fillText(t.v("semana").toUpperCase(), pad + 15*u + 0.22*u, 26*u + 3*u + 3.7*u);
      ctx.fillText(t.v("mes").toUpperCase(), pad + 15*u + 0.22*u, 26*u + 25.2*u + 3.7*u); setLS(ctx, 0);
      const ds = fitFont(ctx, t.v("dia"), t.tf, 15*u, 26*u);
      ctx.fillText(t.v("dia"), pad + 15*u, 26*u + 8.8*u + ds*0.82);
      // frase ao lado do calendário
      ctx.textAlign = "left"; ctx.font = t.bf(4.4*u); ctx.fillStyle = alpha(t.c.text, .9);
      putLines(ctx, wrapLines(ctx, t.subtitle, W - pad - 41*u, 4), 41*u, 27*u, 4.4*u, 6.2*u);
      // título e informações (de baixo para cima)
      const bottom = H - 36*u;
      const infos = [t.v("info1"), t.v("info2")].filter(Boolean);
      const il = 6.2*u;
      const infoTop = bottom - infos.length*il - (infos.length - 1)*1.8*u;
      ctx.font = t.tf(9.6*u);
      const tl = wrapLines(ctx, t.title, maxW, 3), tlh = 9.8*u;
      ctx.fillStyle = t.c.text; putLines(ctx, tl, pad, infoTop - 4*u - tl.length*tlh, 9.6*u, tlh);
      infos.forEach((raw, i) => {
        const [b, ...r] = raw.split(" · "), rest = r.length ? " · " + r.join(" · ") : "";
        const full = rest ? b + rest : b;
        ctx.font = t.bf(4.4*u);
        const s = fitFont(ctx, full, x => semi(t.bf(x)), 4.4*u, maxW);
        const y = infoTop + i*(il + 1.8*u) + (il - s)/2 + s*0.8;
        ctx.font = semi(t.bf(s)); ctx.fillStyle = t.c.accent; ctx.fillText(b, pad, y);
        const wb = ctx.measureText(b).width;
        ctx.font = t.bf(s); ctx.fillStyle = t.c.text; ctx.fillText(rest, pad + wb, y);
      });
      logoBot(ctx, W, t, "right");
    }
  },
  {
    id:"link", name:"Chamada para o link", cat:"vender",
    slots:W => { const u = W/100; return [{x:20*u, y:137.8*u, w:60*u, h:10*u, label:"Figurinha de link"}]; },
    draw(ctx, W, H, t){
      const u = W/100, pad = 7*u, maxW = W - pad*2;
      shadeBottom(ctx, W, H);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = t.bf(4.4*u);
      const sl = wrapLines(ctx, t.subtitle, maxW, 2), slh = 6.2*u;
      ctx.font = t.tf(10*u);
      const tl = wrapLines(ctx, t.title, maxW, 3), tlh = 10.4*u;
      const bottom = H - 56*u;
      const subTop = bottom - sl.length*slh, titleTop = subTop - (sl.length ? 3*u : 0) - tl.length*tlh;
      tl.forEach((l, i) => { ctx.font = t.tf(10*u); ctx.fillStyle = i === tl.length - 1 ? t.c.accent : WHITE; putLines(ctx, [l], pad, titleTop + i*tlh, 10*u, tlh); });
      ctx.font = t.bf(4.4*u); ctx.fillStyle = alpha(WHITE, .9); putLines(ctx, sl, pad, subTop, 4.4*u, slh);
      // seta
      ctx.save();
      ctx.translate(44*u, H - 54*u); ctx.scale(0.5*u, 0.5*u);
      ctx.strokeStyle = t.c.accent; ctx.lineWidth = 2.6; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.stroke(new Path2D("M12 2v22M4 16l8 8 8-8"));
      ctx.restore();
      logoTop(ctx, W, t, "left");
    }
  },
  {
    id:"frase", name:"Frase da marca", cat:"conteudo", media:null,
    under(ctx, W, H, t){ ctx.fillStyle = t.c.base; ctx.fillRect(0, 0, W, H); },
    draw(ctx, W, H, t){
      const u = W/100;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = `700 ${40*u}px 'Playfair Display', serif`; ctx.fillStyle = t.c.accent;
      ctx.fillText("“", 7*u, 20*u + 40*u*0.85);
      ctx.font = t.tf(10*u); ctx.fillStyle = t.c.text;
      const tl = wrapLines(ctx, t.title, 82*u, 5), tlh = 11.2*u;
      putLines(ctx, tl, 9*u, 56*u, 10*u, tlh);
      ctx.font = semi(t.bf(4*u)); setLS(ctx, 0.6*u); ctx.fillStyle = t.c.accent;
      ctx.fillText(wrapLines(ctx, (t.subtitle || "").toUpperCase(), 82*u, 1)[0] || "", 9*u, 56*u + tl.length*tlh + 7*u + 4*u*0.85); setLS(ctx, 0);
      logoSafe(ctx, t, 9*u, 128*u, 36*u, 10*u, "left");
    }
  },
  {
    id:"conversa", name:"Notificação e conversa", cat:"interagir", fields:["pergunta","resposta"],
    draw(ctx, W, H, t){
      const u = W/100;
      dimAll(ctx, W, H, 0.45);
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      // notificação
      const nx = 5*u, nw = W - 10*u, ny = 25*u;
      ctx.font = t.bf(3.9*u);
      const nl = wrapLines(ctx, t.subtitle, nw - 8*u - 13*u, 2);
      const nh = 3.6*u*2 + 5.2*u + nl.length*5.1*u + 0.6*u;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 4*u; ctx.shadowOffsetY = 1*u;
      ctx.fillStyle = "rgba(245,245,247,.92)"; roundRectPath(ctx, nx, ny, nw, nh, 5*u); ctx.fill();
      ctx.restore();
      ctx.fillStyle = t.c.base; roundRectPath(ctx, nx + 4*u, ny + 3.6*u, 10*u, 10*u, 2.4*u); ctx.fill();
      ctx.fillStyle = t.c.accent; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = t.tf(4.2*u);
      ctx.fillText(initials(t.title), nx + 9*u, ny + 8.7*u); ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left"; ctx.font = semi(t.bf(3.8*u)); ctx.fillStyle = "#111";
      ctx.fillText(wrapLines(ctx, t.title, nw - 36*u, 1)[0] || "", nx + 17*u, ny + 3.6*u + 3.6*u);
      ctx.textAlign = "right"; ctx.font = t.bf(3.4*u); ctx.fillStyle = "#666"; ctx.fillText("agora", nx + nw - 4*u, ny + 3.6*u + 3.6*u);
      ctx.textAlign = "left"; ctx.font = t.bf(3.9*u); ctx.fillStyle = "#111";
      putLines(ctx, nl, nx + 17*u, ny + 3.6*u + 5.2*u + 0.6*u, 3.9*u, 5.1*u);
      // conversa
      ctx.textAlign = "center"; ctx.font = t.bf(3.2*u); ctx.fillStyle = alpha(WHITE, .75);
      ctx.fillText("Mensagem de ontem", W/2, 72*u + 3.2*u);
      let y = 72*u + 5*u + 3*u;
      const bub = (txt, out) => {
        ctx.font = out ? semi(t.bf(4.4*u)) : t.bf(4.4*u);
        const ls = wrapLines(ctx, txt, 72*(W - 12*u)/100 - 8.8*u, 4), lh = 5.72*u;
        const w = Math.max(1, ...ls.map(l => ctx.measureText(l).width)) + 8.8*u, h = ls.length*lh + 6.4*u;
        const x = out ? W - 6*u - w : 6*u;
        ctx.fillStyle = out ? t.c.accent : "rgba(255,255,255,.94)";
        out ? rr4(ctx, x, y, w, h, 5*u, 5*u, 1.4*u, 5*u) : rr4(ctx, x, y, w, h, 5*u, 5*u, 5*u, 1.4*u);
        ctx.fill();
        ctx.fillStyle = out ? t.c.base : "#111"; ctx.textAlign = "left";
        putLines(ctx, ls, x + 4.4*u, y + 3.2*u, 4.4*u, lh);
        y += h + 3*u;
      };
      bub(t.v("pergunta"), false);
      bub(t.v("resposta"), true);
      logoBot(ctx, W, t, "center");
    }
  },
  {
    id:"cupom", name:"Cupom", cat:"vender", fields:["desconto","codigo","validade"],
    media:(W, H) => { const u = W/100; return {x:7*u, y:22*u, w:86*u, h:62*u, r:4*u}; },
    under(ctx, W, H, t){ ctx.fillStyle = t.c.base; ctx.fillRect(0, 0, W, H); },
    draw(ctx, W, H, t){
      const u = W/100, x = 7*u, y = 90*u, w = 86*u, h = 44*u, r = 5*u, ink = t.c.base;
      // ingresso com recortes
      roundRectPath(ctx, x, y, w, h, 3*u);
      ctx.moveTo(x + w/2 + r, y); ctx.arc(x + w/2, y, r, 0, Math.PI*2);
      ctx.moveTo(x + w/2 + r, y + h); ctx.arc(x + w/2, y + h, r, 0, Math.PI*2);
      ctx.fillStyle = t.c.accent; ctx.fill("evenodd");
      ctx.save(); ctx.strokeStyle = alpha(ink, .45); ctx.lineWidth = 0.6*u; ctx.setLineDash([1.6*u, 1.2*u]);
      ctx.beginPath(); ctx.moveTo(x + w/2, y + r + 1.5*u); ctx.lineTo(x + w/2, y + h - r - 1.5*u); ctx.stroke(); ctx.restore();
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = ink;
      const cx1 = x + w/4, cx2 = x + w*3/4;
      ctx.font = semi(t.bf(3.2*u)); setLS(ctx, 0.8*u);
      ctx.fillText("CUPOM", cx1 + 0.4*u, 102.5*u); ctx.fillText("USE O CÓDIGO", cx2 + 0.4*u, 103*u); setLS(ctx, 0);
      const ds = fitFont(ctx, t.v("desconto"), t.tf, 12*u, w/2 - 6*u);
      ctx.fillStyle = ink; ctx.fillText(t.v("desconto"), cx1, 102.5*u + 3*u + ds*0.82);
      ctx.font = t.bf(3.2*u); ctx.fillText(wrapLines(ctx, t.title, w/2 - 6*u, 1)[0] || "", cx1, 123*u);
      // código
      ctx.font = `700 ${6*u}px ui-monospace, Consolas, monospace`; setLS(ctx, 0.6*u);
      const cod = t.v("codigo").toUpperCase(), cw = Math.min(w/2 - 6*u, ctx.measureText(cod).width + 4.6*u);
      ctx.strokeStyle = ink; ctx.lineWidth = 0.5*u; roundRectPath(ctx, cx2 - cw/2, 107*u, cw, 10*u, 1.6*u); ctx.stroke();
      ctx.fillText(cod, cx2 + 0.3*u, 107*u + 7.4*u, cw - 2*u); setLS(ctx, 0);
      ctx.font = t.bf(3.2*u); ctx.fillText(wrapLines(ctx, t.v("validade"), w/2 - 6*u, 1)[0] || "", cx2, 123*u);
      // frase
      ctx.font = t.bf(4*u); ctx.fillStyle = alpha(t.c.text, .9);
      putLines(ctx, wrapLines(ctx, t.subtitle, 84*u, 2), W/2, 140*u, 4*u, 5.6*u);
      logoSafe(ctx, t, 10*u, 24.5*u, 30*u, 6*u, "left");
    }
  },
  {
    id:"serie", name:"Série em partes", cat:"conteudo", fields:["parte","partes","chamada"],
    draw(ctx, W, H, t){
      const u = W/100, pad = 7*u, maxW = W - pad*2;
      shadeBottom(ctx, W, H);
      const total = Math.min(6, Math.max(1, parseInt(t.v("partes"), 10) || 3));
      const parte = Math.min(total, Math.max(1, parseInt(t.v("parte"), 10) || 1));
      // marcador no topo
      const label = `PARTE ${parte} DE ${total}`;
      ctx.font = t.tf(3.6*u); setLS(ctx, 0.43*u);
      const segW = total*5*u + (total - 1)*1*u, tw = ctx.measureText(label).width;
      const cw = 3*u + segW + 3*u + tw + 4*u, ch = 8.3*u;
      ctx.fillStyle = alpha(t.c.base, .88); roundRectPath(ctx, pad, 25*u, cw, ch, ch/2); ctx.fill();
      for(let i = 0; i < total; i++){
        ctx.fillStyle = i < parte ? t.c.accent : "rgba(255,255,255,.35)";
        roundRectPath(ctx, pad + 3*u + i*6*u, 25*u + ch/2 - 0.8*u, 5*u, 1.6*u, 0.8*u); ctx.fill();
      }
      ctx.fillStyle = t.c.text; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(label, pad + 3*u + segW + 3*u, 25*u + ch/2 + 0.2*u); ctx.textBaseline = "alphabetic"; setLS(ctx, 0);
      // texto e botão (de baixo para cima)
      const bottom = H - 36*u, bh = 9.8*u;
      const chamada = t.v("chamada");
      ctx.font = t.tf(3.8*u);
      const bw = Math.min(maxW, ctx.measureText(chamada).width + 8.8*u);
      ctx.fillStyle = t.c.accent; roundRectPath(ctx, pad, bottom - bh, bw, bh, bh/2); ctx.fill();
      ctx.fillStyle = t.c.base; ctx.textBaseline = "middle";
      ctx.fillText(wrapLines(ctx, chamada, maxW - 8.8*u, 1)[0] || "", pad + 4.4*u, bottom - bh/2 + 0.2*u); ctx.textBaseline = "alphabetic";
      ctx.font = t.bf(4.4*u);
      const sl = wrapLines(ctx, t.subtitle, maxW, 2), slh = 6.2*u;
      const subTop = bottom - bh - 5*u - sl.length*slh;
      ctx.fillStyle = alpha(WHITE, .9); putLines(ctx, sl, pad, subTop, 4.4*u, slh);
      ctx.font = t.tf(10*u);
      const tl = wrapLines(ctx, t.title, maxW, 2), tlh = 10.2*u;
      ctx.fillStyle = WHITE; putLines(ctx, tl, pad, subTop - (sl.length ? 3*u : 0) - tl.length*tlh, 10*u, tlh);
      logoTop(ctx, W, t, "right");
    }
  },
];

/* ============================================================
   ESTADO (salvo no navegador)
   ============================================================ */
const STORAGE_KEY = "stories.state.v1";
const DEFAULTS = {
  presetId: PRESETS[0].id,
  title: "Título aqui",
  subtitle: "Escreva algo aqui",
  paletteId: PALETTES[0].id,
  colors: {base:PALETTES[0].base, accent:PALETTES[0].accent, text:PALETTES[0].text},
  fontId: FONTS[0].id,
  logo: null, // dataURL da logo do cliente
  fields: {}, // campos extras dos templates (FIELDS)
};
const clone = o => JSON.parse(JSON.stringify(o));

function loadState(){
  let saved = null;
  try{ saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); }catch(e){ /* sem storage: usa padrão */ }
  const s = Object.assign(clone(DEFAULTS), saved || {});
  if(!PRESETS.some(p => p.id === s.presetId)) s.presetId = DEFAULTS.presetId;
  if(!FONTS.some(f => f.id === s.fontId)) s.fontId = DEFAULTS.fontId;
  const hex = /^#[0-9a-f]{6}$/i;
  if(!s.colors || !["base","accent","text"].every(k => hex.test(s.colors[k]))) s.colors = clone(DEFAULTS.colors);
  if(!s.fields || typeof s.fields !== "object") s.fields = {};
  for(const k in s.fields) if(!FIELDS[k] || typeof s.fields[k] !== "string") delete s.fields[k];
  return s;
}

const saveStatus = document.getElementById("saveStatus");
function saveState(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    saveStatus.textContent = "Salvo automaticamente";
  }catch(e){
    saveStatus.textContent = "Não foi possível salvar neste navegador";
  }
}

let state = loadState();
let logoImg = null;

function theme(s){
  const f = FONTS.find(x => x.id === s.fontId);
  return {
    title: s.title, subtitle: s.subtitle, c: s.colors, logo: logoImg,
    tf: size => f.title.replace("{s}", size),
    bf: size => BODY_FONT.replace("{s}", size),
    hf: size => HAND_FONT.replace("{s}", size),
    // campo extra: o padrão aparece enquanto a pessoa não escreve nada
    v: key => (s.fields && s.fields[key] != null ? s.fields[key] : FIELDS[key].def),
    lines(key){ return this.v(key).split("\n").map(l => l.trim()).filter(Boolean); },
  };
}
const currentPreset = () => PRESETS.find(p => p.id === state.presetId);

/* ============================================================
   COMPOSIÇÃO DO STORY
   camadas: under (fundo) -> mídia 1 -> mídia 2 -> draw (moldura) -> guias / marca d'água
   ============================================================ */
const mainCanvas = document.getElementById("mainCanvas");
const mainCtx = mainCanvas.getContext("2d");
const layers = {under: document.createElement("canvas"), over: document.createElement("canvas")};
let mainMedia = null;   // <video> ou <img> da mídia principal
let photo2Img = null;   // segunda foto (só nos templates com media2)

const mediaSize = src => src.videoWidth ? [src.videoWidth, src.videoHeight]
  : [src.naturalWidth || src.width, src.naturalHeight || src.height];

/* desenha a fonte cobrindo o retângulo (corta o excesso), com cantos e rotação */
function drawCover(ctx, src, rect, size){
  const [sw, sh] = size || mediaSize(src);
  if(!sw || !sh) return;
  const s = Math.max(rect.w / sw, rect.h / sh);
  const dw = sw * s, dh = sh * s;
  ctx.save();
  ctx.translate(rect.x + rect.w/2, rect.y + rect.h/2);
  if(rect.rot) ctx.rotate(rect.rot * Math.PI / 180);
  roundRectPath(ctx, -rect.w/2, -rect.h/2, rect.w, rect.h, rect.r);
  ctx.clip();
  if(rect.filter) ctx.filter = rect.filter; // navegador sem ctx.filter só ignora
  ctx.drawImage(src, -dw/2, -dh/2, dw, dh);
  ctx.restore();
}

/* espaço vazio de uma mídia (prévia e miniaturas) */
function drawPlaceholder(ctx, rect, label){
  ctx.save();
  ctx.translate(rect.x + rect.w/2, rect.y + rect.h/2);
  if(rect.rot) ctx.rotate(rect.rot * Math.PI / 180);
  roundRectPath(ctx, -rect.w/2, -rect.h/2, rect.w, rect.h, rect.r);
  const g = ctx.createLinearGradient(-rect.w/2, -rect.h/2, rect.w*0.2, rect.h/2);
  g.addColorStop(0, "#6a7d8c"); g.addColorStop(1, "#1f2630");
  ctx.fillStyle = g; ctx.fill();
  if(label){
    ctx.fillStyle = "rgba(255,255,255,.75)";
    ctx.font = BODY_FONT.replace("{s}", Math.max(9, rect.w * 0.05));
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(label, 0, 0);
  }
  ctx.restore();
}

/* fundo e moldura do template, renderizados uma vez por alteração */
function renderLayers(W, H, s){
  const preset = PRESETS.find(p => p.id === s.presetId), t = theme(s);
  const out = {under: document.createElement("canvas"), over: document.createElement("canvas")};
  for(const k in out){
    out[k].width = W; out[k].height = H;
    const ctx = out[k].getContext("2d");
    if(k === "under" && preset.under) preset.under(ctx, W, H, t);
    if(k === "over") preset.draw(ctx, W, H, t);
  }
  return out;
}

/* monta o story completo. o: {preset, layers, src, size, preview, watermark} */
function compose(ctx, W, H, o){
  const preset = o.preset;
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(o.layers.under, 0, 0, W, H);
  const r1 = mediaRect(preset.media, W, H);
  if(r1){
    if(o.src) drawCover(ctx, o.src, r1, o.size);
    else if(o.preview) drawPlaceholder(ctx, r1, preset.media2 ? "Vídeo ou foto" : "");
  }
  const r2 = preset.media2 ? mediaRect(preset.media2, W, H) : null;
  if(r2){
    if(photo2Img && !o.thumb) drawCover(ctx, photo2Img, r2);
    else if(o.preview) drawPlaceholder(ctx, r2, "Segunda foto");
  }
  ctx.drawImage(o.layers.over, 0, 0, W, H);
  if(o.preview && preset.slots) drawSlots(ctx, preset.slots(W, H));
  if(o.watermark) drawWatermark(ctx, W, H);
}

/* guia tracejada da figurinha do Instagram (só na prévia; não sai na exportação) */
function drawSlots(ctx, slots){
  slots.forEach(s => {
    ctx.save();
    ctx.setLineDash([s.w*0.03, s.w*0.022]);
    ctx.lineWidth = Math.max(1.5, s.w*0.008);
    ctx.strokeStyle = "rgba(255,255,255,.9)";
    ctx.fillStyle = "rgba(255,255,255,.14)";
    roundRectPath(ctx, s.x, s.y, s.w, s.h, Math.min(s.h/2, s.w*0.06));
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "600 " + Math.round(s.w*0.05) + "px 'Inter', sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(s.label || "Figurinha do Instagram aqui", s.x + s.w/2, s.y + s.h/2);
    ctx.restore();
  });
}

/* marca d'água do teste grátis */
function drawWatermark(ctx, W, H){
  const text = "Feito com DGA Stories";
  ctx.save();
  ctx.font = "600 " + Math.round(H*0.022) + "px 'Inter', sans-serif";
  const w = ctx.measureText(text).width + H*0.04, h = H*0.042;
  const x = (W - w)/2, y = H*0.80;
  ctx.fillStyle = "rgba(0,0,0,.55)";
  roundRectPath(ctx, x, y, w, h, h/2); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, W/2, y + h/2);
  ctx.globalAlpha = 0.18;
  ctx.font = "800 " + Math.round(H*0.06) + "px 'Montserrat', sans-serif";
  ctx.translate(W/2, H*0.45); ctx.rotate(-Math.PI/7);
  ctx.fillText("DGA STORIES", 0, 0);
  ctx.restore();
}

const isVideo = el => !!el && el.tagName === "VIDEO";
const mediaReady = () => isVideo(mainMedia) ? (mainMedia.readyState >= 2 ? mainMedia : null) : mainMedia;
let mainLayers = null;
function drawPreview(){
  compose(mainCtx, mainCanvas.width, mainCanvas.height, {preset: currentPreset(), layers: mainLayers, src: mediaReady(), preview: true});
}
// enquanto o vídeo toca, redesenha a prévia a cada quadro
(function loop(){
  if(isVideo(mainMedia) && !mainMedia.paused && mainLayers) drawPreview();
  requestAnimationFrame(loop);
})();

function update(){
  mainLayers = renderLayers(mainCanvas.width, mainCanvas.height, state);
  drawPreview();
  renderThumbs();
  saveState();
}

/* ============================================================
   ABAS
   ============================================================ */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => {
      const on = t === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on);
      document.getElementById("tab-" + t.dataset.tab).classList.toggle("hidden", !on);
    });
  });
});

/* marca o botão ativo de uma grade */
function setActive(grid, id){
  grid.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.id === id));
}

/* ============================================================
   TEMPLATES (miniaturas)
   ============================================================ */
const presetGrid = document.getElementById("presetGrid");
const presetFilter = document.getElementById("presetFilter");
const thumbCanvases = {};
let presetCat = "todos";
CATEGORIES.filter(c => c.id === "todos" || PRESETS.some(p => p.cat === c.id)).forEach(c => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip" + (c.id === presetCat ? " active" : "");
  b.dataset.id = c.id;
  b.textContent = c.name;
  b.addEventListener("click", () => {
    presetCat = c.id;
    setActive(presetFilter, c.id);
    presetGrid.querySelectorAll(".preset-btn").forEach(el => {
      el.hidden = c.id !== "todos" && el.dataset.cat !== c.id;
    });
  });
  presetFilter.appendChild(b);
});
PRESETS.forEach(preset => {
  const btn = document.createElement("button");
  btn.className = "preset-btn";
  btn.dataset.id = preset.id;
  btn.dataset.cat = preset.cat;
  const canvas = document.createElement("canvas");
  canvas.width = 270; canvas.height = 480;
  thumbCanvases[preset.id] = canvas;
  const nameEl = document.createElement("div");
  nameEl.className = "p-name";
  nameEl.textContent = preset.name;
  btn.append(canvas, nameEl);
  btn.addEventListener("click", () => {
    state.presetId = preset.id;
    setActive(presetGrid, preset.id);
    syncPresetUI();
    update();
  });
  presetGrid.appendChild(btn);
});

// shortcut: redesenha as ~27 miniaturas a cada alteração; se pesar no celular, adiar com requestIdleCallback.
function renderThumbs(){
  PRESETS.forEach(preset => {
    const c = thumbCanvases[preset.id];
    const s = {...state, presetId: preset.id, title: "Título aqui", subtitle: "Descrição de exemplo do texto", fields: {}};
    compose(c.getContext("2d"), c.width, c.height, {preset, layers: renderLayers(c.width, c.height, s), preview: true, thumb: true});
  });
}

/* ============================================================
   CAMPOS EXTRAS E SEGUNDA FOTO (aparecem conforme o template)
   ============================================================ */
const fieldsBox = document.getElementById("fieldsBox");
const fieldsGroup = document.getElementById("fieldsGroup");
const photo2Group = document.getElementById("photo2Group");
function syncPresetUI(){
  const preset = currentPreset();
  const keys = preset.fields || [];
  fieldsGroup.hidden = !keys.length;
  fieldsBox.innerHTML = "";
  keys.forEach(k => {
    const f = FIELDS[k];
    const id = "field-" + k;
    const label = document.createElement("label");
    label.className = "field-label";
    label.htmlFor = id;
    label.textContent = f.label + (f.multiline ? " (um por linha)" : "");
    const input = document.createElement(f.multiline ? "textarea" : "input");
    if(!f.multiline) input.type = "text";
    input.id = id;
    if(f.max) input.maxLength = f.max;
    input.value = state.fields[k] != null ? state.fields[k] : f.def;
    input.addEventListener("input", () => { state.fields[k] = input.value; update(); });
    fieldsBox.append(label, input);
  });
  photo2Group.hidden = !preset.media2;
  document.getElementById("photo2Hint").textContent = preset.media2Label || "Aparece na segunda área do template.";
}

/* ============================================================
   PALETA, CORES E FONTE
   ============================================================ */
const paletteGrid = document.getElementById("paletteGrid");
PALETTES.forEach(p => {
  const btn = document.createElement("button");
  btn.className = "palette-btn";
  btn.dataset.id = p.id;
  btn.innerHTML = `<div class="swatch"><i style="background:${p.base}"></i><i style="background:${p.accent}"></i><i style="background:${p.text}"></i></div><span>${p.name}</span>`;
  btn.addEventListener("click", () => {
    state.paletteId = p.id;
    state.colors = {base:p.base, accent:p.accent, text:p.text};
    syncColorInputs();
    setActive(paletteGrid, p.id);
    update();
  });
  paletteGrid.appendChild(btn);
});

const colorInputs = {
  base: document.getElementById("colorBase"),
  accent: document.getElementById("colorAccent"),
  text: document.getElementById("colorText"),
};
function syncColorInputs(){
  for(const k in colorInputs) colorInputs[k].value = state.colors[k];
}
for(const k in colorInputs){
  colorInputs[k].addEventListener("input", e => {
    state.colors[k] = e.target.value;
    state.paletteId = null; // cores próprias
    setActive(paletteGrid, null);
    update();
  });
}

const fontGrid = document.getElementById("fontGrid");
FONTS.forEach(f => {
  const btn = document.createElement("button");
  btn.className = "font-btn";
  btn.dataset.id = f.id;
  btn.innerHTML = `<b style="font:${f.title.replace("{s}", 20)}">Aa</b><span>${f.name}</span>`;
  btn.addEventListener("click", () => {
    state.fontId = f.id;
    setActive(fontGrid, f.id);
    update();
  });
  fontGrid.appendChild(btn);
});

/* ============================================================
   LOGO DO CLIENTE
   ============================================================ */
const logoInput = document.getElementById("logoInput");
const logoLib = document.getElementById("logoLib");
const logoAdd = logoLib.querySelector(".logo-add");

// Biblioteca de logos: lista de dataURLs, só neste navegador.
// shortcut: localStorage (~5 MB, umas 20–40 logos); se faltar espaço, migrar para IndexedDB.
const LOGOS_KEY = "stories.logos.v1";
let logos = [];
try{ logos = (JSON.parse(localStorage.getItem(LOGOS_KEY)) || []).filter(d => typeof d === "string" && d.startsWith("data:image/")); }catch(e){}
function saveLogos(){
  try{ localStorage.setItem(LOGOS_KEY, JSON.stringify(logos)); return true; }catch(e){ return false; }
}

function loadImage(src){
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

async function applyLogo(dataUrl){
  logoImg = dataUrl ? await loadImage(dataUrl).catch(() => null) : null;
  renderLogos();
}

async function useLogo(dataUrl){
  state.logo = dataUrl;
  await applyLogo(dataUrl);
  update();
}

function renderLogos(){
  logoLib.querySelectorAll(".logo-tile:not(.logo-add)").forEach(el => el.remove());
  const none = document.createElement("button");
  none.type = "button";
  none.className = "logo-tile logo-none" + (state.logo ? "" : " active");
  none.innerHTML = "<span>Sem logo</span>";
  none.onclick = () => useLogo(null);
  logoLib.insertBefore(none, logoAdd);
  logos.forEach(d => {
    const tile = document.createElement("div");
    tile.className = "logo-tile" + (d === state.logo ? " active" : "");
    const pick = document.createElement("button");
    pick.type = "button";
    pick.className = "logo-pick";
    pick.setAttribute("aria-label", "Usar esta logo");
    pick.innerHTML = `<img src="${d}" alt="">`;
    pick.onclick = () => useLogo(d);
    const del = document.createElement("button");
    del.type = "button";
    del.className = "logo-del";
    del.setAttribute("aria-label", "Apagar logo");
    del.textContent = "×";
    del.onclick = async () => {
      if(!confirm("Apagar esta logo da biblioteca?")) return;
      logos = logos.filter(x => x !== d);
      saveLogos();
      if(state.logo === d) await useLogo(null); else renderLogos();
    };
    tile.append(pick, del);
    logoLib.insertBefore(tile, logoAdd);
  });
}

logoInput.addEventListener("change", async e => {
  const file = e.target.files[0];
  e.target.value = "";
  if(!file) return;
  const url = URL.createObjectURL(file);
  try{
    const img = await loadImage(url);
    // reduz para no máximo 800px para caber no armazenamento do navegador
    const s = Math.min(1, 800 / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * s) || 800;
    c.height = Math.round(img.height * s) || 800;
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    const d = c.toDataURL("image/png");
    if(!logos.includes(d)){
      logos.push(d);
      if(!saveLogos()){
        logos.pop();
        alert("A biblioteca está cheia neste aparelho. Apague alguma logo e tente de novo.");
        return;
      }
    }
    await useLogo(d);
  }catch(err){
    alert("Não foi possível abrir essa imagem. Tente um PNG ou JPG.");
  }finally{
    URL.revokeObjectURL(url);
  }
});

/* ============================================================
   TEXTOS
   ============================================================ */
const titleInput = document.getElementById("titleInput");
const subtitleInput = document.getElementById("subtitleInput");
const titleCount = document.getElementById("titleCount");
const subCount = document.getElementById("subCount");

function syncCounts(){
  titleCount.textContent = titleInput.value.length;
  subCount.textContent = subtitleInput.value.length;
}
titleInput.addEventListener("input", () => { state.title = titleInput.value; syncCounts(); update(); });
subtitleInput.addEventListener("input", () => { state.subtitle = subtitleInput.value; syncCounts(); update(); });

/* ============================================================
   VÍDEO (só no aparelho; não é salvo)
   ============================================================ */
const videoInput = document.getElementById("videoInput");
const bgVideo = document.getElementById("bgVideo");
const emptyHint = document.getElementById("emptyHint");
const videoNameEl = document.getElementById("videoName");
const downloadVideoBtn = document.getElementById("downloadVideoBtn");
let videoFile = null;
let mainImgUrl = null;

// vídeo ou foto principal (só no aparelho; não é salvo)
async function setVideo(file){
  videoFile = file && file.type.startsWith("video/") ? file : null;
  if(bgVideo.src) URL.revokeObjectURL(bgVideo.src);
  if(mainImgUrl){ URL.revokeObjectURL(mainImgUrl); mainImgUrl = null; }
  mainMedia = null;
  if(videoFile){
    bgVideo.src = URL.createObjectURL(file);
    bgVideo.play().catch(() => {});
    mainMedia = bgVideo;
  }else{
    bgVideo.removeAttribute("src");
    bgVideo.load();
    if(file){
      mainImgUrl = URL.createObjectURL(file);
      mainMedia = await loadImage(mainImgUrl).catch(() => { alert("Não foi possível abrir essa imagem. Tente um JPG ou PNG."); return null; });
    }
  }
  emptyHint.hidden = !!mainMedia;
  videoNameEl.textContent = mainMedia ? file.name : "Escolher vídeo ou foto";
  downloadVideoBtn.disabled = !videoFile;
  drawPreview();
}
videoInput.addEventListener("change", e => {
  if(e.target.files[0]) setVideo(e.target.files[0]);
});
// o primeiro quadro chega depois do play; desenha assim que existir
bgVideo.addEventListener("loadeddata", drawPreview);

const photo2Input = document.getElementById("photo2Input");
const photo2Name = document.getElementById("photo2Name");
async function setPhoto2(file){
  if(photo2Img) URL.revokeObjectURL(photo2Img.src);
  photo2Img = null;
  if(file){
    photo2Img = await loadImage(URL.createObjectURL(file)).catch(() => { alert("Não foi possível abrir essa imagem. Tente um JPG ou PNG."); return null; });
  }
  photo2Name.textContent = photo2Img ? file.name : "Escolher segunda foto";
  drawPreview();
}
photo2Input.addEventListener("change", e => {
  if(e.target.files[0]) setPhoto2(e.target.files[0]);
});

/* ============================================================
   LIMPAR
   ============================================================ */
document.getElementById("resetBtn").addEventListener("click", async () => {
  if(!confirm("Apagar textos, cores e template e começar do zero? Sua biblioteca de logos continua salva.")) return;
  try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
  state = clone(DEFAULTS);
  videoInput.value = "";
  photo2Input.value = "";
  setVideo(null);
  setPhoto2(null);
  await applyLogo(null);
  syncUI();
  update();
});

/* ============================================================
   EXPORTAR
   ============================================================ */
function safeName(){
  return (state.title || "story").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "story";
}

function downloadBlob(blob, name){
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* teste grátis: marca d'água e até 3 exportações. conta.js preenche window.admPlano = {uid, plan} */
// shortcut: o contador fica no navegador (limpar os dados do site zera); aceito pelo dono, que também aceita contas novas.
const TRIAL_LIMIT = 3;
const isTrial = () => window.admPlano?.plan === "gratis";
const trialKey = () => "admstory.trialExports." + (window.admPlano?.uid || "");
function trialUsed(){
  try{ return Number(localStorage.getItem(trialKey())) || 0; }catch(e){ return 0; }
}
function canExport(){
  if(!isTrial() || trialUsed() < TRIAL_LIMIT) return true;
  if(confirm(`Você já usou as ${TRIAL_LIMIT} exportações do teste grátis. Assine para exportar sem limite e sem marca d'água. Ver os planos?`)) location.href = "../#planos";
  return false;
}
function countExport(){
  if(!isTrial()) return;
  try{ localStorage.setItem(trialKey(), String(trialUsed() + 1)); }catch(e){}
  syncTrialUI();
}
const trialNote = document.getElementById("trialNote");
function syncTrialUI(){
  trialNote.hidden = !isTrial();
  if(isTrial()) trialNote.textContent = `Teste grátis: ${Math.max(0, TRIAL_LIMIT - trialUsed())} de ${TRIAL_LIMIT} exportações restantes, com marca d'água.`;
}
window.addEventListener("admplano", syncTrialUI);

// imagem do story pronto: quadro atual do vídeo (ou a foto) + template
document.getElementById("downloadBtn").addEventListener("click", () => {
  if(!canExport()) return;
  const c = document.createElement("canvas");
  c.width = mainCanvas.width; c.height = mainCanvas.height;
  compose(c.getContext("2d"), c.width, c.height, {preset: currentPreset(), layers: mainLayers, src: mediaReady(), watermark: isTrial()});
  c.toBlob(blob => { downloadBlob(blob, `story-${state.presetId}-${safeName()}.png`); countExport(); }, "image/png");
});

const exportBar = document.getElementById("exportBar");
const exportLabel = document.getElementById("exportLabel");
let conversion = null;
let exporting = false;

function setExportUI(pct){
  if(pct == null){
    exportBar.style.width = "0";
    exportLabel.textContent = "Exportar vídeo MP4";
  }else{
    exportBar.style.width = pct + "%";
    exportLabel.textContent = pct < 1 ? "Preparando…" : `Exportando ${pct}% — toque para cancelar`;
  }
}

/* decodifica o vídeo quadro a quadro, aplica a moldura e gera MP4 (WebCodecs, mais rápido que tempo real) */
async function exportVideo(){
  if(typeof VideoEncoder === "undefined"){
    alert("Seu navegador não suporta exportação de vídeo. Use o Chrome, Edge ou Safari atualizados.");
    return;
  }
  const MB = await import("./vendor/mediabunny.min.mjs");
  const W = mainCanvas.width, H = mainCanvas.height;
  const preset = currentPreset(), lay = mainLayers, watermark = isTrial();
  const frame = document.createElement("canvas");
  frame.width = W; frame.height = H;
  const fctx = frame.getContext("2d");

  const input = new MB.Input({source: new MB.BlobSource(videoFile), formats: MB.ALL_FORMATS});
  const output = new MB.Output({format: new MB.Mp4OutputFormat({fastStart: "in-memory"}), target: new MB.BufferTarget()});

  conversion = await MB.Conversion.init({
    input, output, showWarnings: false,
    video: {
      width: W, height: H, fit: "cover",
      allowTransformationMetadata: false,
      forceTranscode: true,
      codec: await MB.canEncodeVideo("avc") ? "avc" : undefined,
      quality: MB.QUALITY_HIGH,
      process(sample){
        compose(fctx, W, H, {preset, layers: lay, src: sample.toCanvasImageSource(), size: [sample.displayWidth, sample.displayHeight], watermark});
        return frame;
      },
    },
  });
  // sem a trilha de vídeo não há o que exportar (áudio descartado é aceitável)
  if(!conversion.isValid || conversion.discardedTracks.some(d => d.track.type === "video")){
    throw new Error("formato: " + conversion.discardedTracks.map(d => d.reason).join(", "));
  }
  conversion.onProgress = p => setExportUI(Math.max(1, Math.round(p * 100)));
  setExportUI(0);
  await conversion.execute();
  downloadBlob(new Blob([output.target.buffer], {type: "video/mp4"}), `story-${state.presetId}-${safeName()}.mp4`);
  countExport();
}

downloadVideoBtn.addEventListener("click", async () => {
  if(exporting){ conversion?.cancel(); return; }
  if(!canExport()) return;
  exporting = true;
  try{
    await exportVideo();
  }catch(err){
    if(err?.name !== "ConversionCanceledError"){
      console.error(err);
      alert("Não foi possível exportar este vídeo. Tente um arquivo MP4 (H.264).");
    }
  }finally{
    exporting = false;
    conversion = null;
    setExportUI(null);
  }
});

/* ============================================================
   ATUALIZAÇÃO AUTOMÁTICA (service worker)
   ============================================================ */
document.getElementById("appVersion").textContent = self.APP_VERSION;

if("serviceWorker" in navigator && location.protocol !== "file:"){
  const toast = document.getElementById("updateToast");
  let waiting = null;
  const offer = sw => { waiting = sw; toast.hidden = false; };

  navigator.serviceWorker.register("sw.js", {updateViaCache: "none"}).then(reg => {
    if(reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener("updatefound", () => {
      const sw = reg.installing;
      sw.addEventListener("statechange", () => {
        // só oferece se já havia uma versão rodando (não na primeira instalação)
        if(sw.state === "installed" && navigator.serviceWorker.controller) offer(sw);
      });
    });
    const check = () => reg.update().catch(() => {});
    setInterval(check, 30 * 60 * 1000);
    document.addEventListener("visibilitychange", () => { if(!document.hidden) check(); });
  });

  document.getElementById("updateBtn").addEventListener("click", () => {
    if(!waiting) return;
    // não recarrega no meio de uma exportação
    if(exporting && !confirm("Uma exportação está em andamento. Atualizar agora vai cancelá-la.")) return;
    updating = true;
    waiting.postMessage("skipWaiting");
  });
  // só recarrega quando a pessoa pediu (a 1ª instalação também troca o controller, via clients.claim)
  let updating = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if(!updating) return;
    updating = false;
    location.reload();
  });
}

/* ============================================================
   INÍCIO
   ============================================================ */
function syncUI(){
  titleInput.value = state.title;
  subtitleInput.value = state.subtitle;
  syncCounts();
  syncColorInputs();
  setActive(presetGrid, state.presetId);
  setActive(paletteGrid, state.paletteId);
  setActive(fontGrid, state.fontId);
  syncPresetUI();
  syncTrialUI();
}

async function init(){
  syncUI();
  // quem já tinha uma logo antes da biblioteca: ela entra como a primeira
  if(state.logo && !logos.includes(state.logo)){ logos.unshift(state.logo); saveLogos(); }
  await applyLogo(state.logo);
  try{
    await Promise.all([
      document.fonts.load("600 60px 'Poppins'"),
      document.fonts.load("800 60px 'Montserrat'"),
      document.fonts.load("700 60px 'Playfair Display'"),
      document.fonts.load("400 40px 'Inter'"),
      document.fonts.load(HAND_FONT.replace("{s}", 60)),
      ...FONTS.map(f => document.fonts.load(f.title.replace("{s}", 60))),
    ]);
  }catch(e){ /* fontes: melhor esforço */ }
  update();
}
init();
