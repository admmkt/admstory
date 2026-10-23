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
];
const BODY_FONT = "400 {s}px 'Inter', sans-serif";

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
const PRESETS = [
  {
    id:"faixa-base", name:"Faixa base",
    draw(ctx, W, H, t){
      const pad = W*0.07, lineY = H*0.680, lineH = H*0.0042;
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
        drawLogoInBox(ctx, t.logo, 0, W, blockY + blockH + H*0.032, H*0.072, "center");
        ctx.restore();
      }
    }
  },
  {
    id:"degrade", name:"Degradê",
    draw(ctx, W, H, t){
      const pad = W*0.08, gradTop = H*0.52;
      const grad = ctx.createLinearGradient(0, gradTop, 0, H);
      grad.addColorStop(0, alpha(t.c.base, 0));
      grad.addColorStop(0.55, alpha(t.c.base, .75));
      grad.addColorStop(1, alpha(t.c.base, .94));
      ctx.fillStyle = grad; ctx.fillRect(0, gradTop, W, H - gradTop);

      const eyebrowY = H*0.735;
      ctx.fillStyle = t.c.accent; ctx.fillRect(pad, eyebrowY, H*0.05, H*0.0055);

      ctx.textAlign = "left";
      ctx.fillStyle = t.c.text;
      ctx.font = t.tf(H*0.041);
      const ty = eyebrowY + H*0.055;
      const n = drawParagraph(ctx, t.title, pad, ty, W - pad*2, H*0.048, 2);
      ctx.font = t.bf(H*0.0225);
      ctx.fillStyle = alpha(t.c.text, .82);
      drawParagraph(ctx, t.subtitle, pad, ty + n*H*0.048 + H*0.016, W - pad*2 - H*0.09, H*0.030, 2);

      if(t.logo) drawLogoInBox(ctx, t.logo, W - pad - H*0.09, H*0.09, H*0.90, H*0.055, "right");
    }
  },
  {
    id:"cartao", name:"Cartão",
    draw(ctx, W, H, t){
      const pad = W*0.065, cardX = pad, cardW = W - pad*2;
      const cardH = H*0.185, cardY = H*0.775, r = H*0.018;
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
    id:"moldura", name:"Moldura",
    draw(ctx, W, H, t){
      const topH = H*0.062, bottomH = H*0.205, ruleH = H*0.0042;
      ctx.fillStyle = t.c.base;   ctx.fillRect(0, 0, W, topH);
      ctx.fillStyle = t.c.accent; ctx.fillRect(0, topH, W, ruleH);
      ctx.fillStyle = t.c.accent; ctx.fillRect(0, H-bottomH-ruleH, W, ruleH);
      ctx.fillStyle = t.c.base;   ctx.fillRect(0, H-bottomH, W, bottomH);

      if(t.logo) drawLogoInBox(ctx, t.logo, W*0.3, W*0.4, topH*0.22, topH*0.56, "center");

      const pad = W*0.09;
      ctx.textAlign = "center";
      ctx.fillStyle = t.c.text;
      ctx.font = t.tf(H*0.036);
      const ty = H - bottomH + H*0.052;
      const n = drawParagraph(ctx, t.title, W/2, ty, W - pad*2, H*0.044, 2);
      ctx.font = t.bf(H*0.0215);
      ctx.fillStyle = alpha(t.c.text, .8);
      drawParagraph(ctx, t.subtitle, W/2, ty + n*H*0.044 + H*0.016, W - pad*2, H*0.029, 2);
    }
  },
  {
    id:"minimal", name:"Minimalista",
    draw(ctx, W, H, t){
      const pad = W*0.08, lineY = H*0.815;
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
        drawLogoInBox(ctx, t.logo, W - pad - H*0.062, H*0.062, H*0.90, H*0.055, "right");
        ctx.restore();
      }
    }
  },
  {
    id:"etiqueta", name:"Etiqueta",
    draw(ctx, W, H, t){
      const pad = W*0.07, fs = H*0.036, padX = W*0.04;
      ctx.font = t.tf(fs);
      const lines = wrapLines(ctx, t.title, W - pad*2 - padX*2, 2);
      const lh = fs*1.45;
      let y = H*0.80 - lines.length*lh;
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
        drawLogoInBox(ctx, t.logo, W - pad - W*0.3, W*0.3, H*0.045, H*0.05, "right");
        ctx.restore();
      }
    }
  },
  {
    id:"manchete", name:"Manchete",
    draw(ctx, W, H, t){
      const pad = W*0.07, blockY = H*0.62;
      ctx.fillStyle = t.c.base; ctx.fillRect(0, blockY, W, H - blockY);
      ctx.fillStyle = t.c.accent; ctx.fillRect(0, blockY, W*0.34, H*0.009);

      ctx.textAlign = "left";
      ctx.fillStyle = t.c.text;
      ctx.font = t.tf(H*0.058);
      const ty = blockY + H*0.09;
      const n = drawParagraph(ctx, (t.title || "").toUpperCase(), pad, ty, W - pad*2, H*0.064, 3);
      ctx.font = t.bf(H*0.024);
      ctx.fillStyle = alpha(t.c.text, .78);
      drawParagraph(ctx, t.subtitle, pad, ty + (n-1)*H*0.064 + H*0.055, W - pad*2, H*0.032, 3);

      if(t.logo) drawLogoInBox(ctx, t.logo, pad, W*0.4, H*0.915, H*0.045, "left");
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
  };
}
const currentPreset = () => PRESETS.find(p => p.id === state.presetId);

function renderTo(canvas){
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  currentPreset().draw(ctx, canvas.width, canvas.height, theme(state));
}

const mainCanvas = document.getElementById("mainCanvas");
function update(){
  renderTo(mainCanvas);
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
const thumbCanvases = {};
PRESETS.forEach(preset => {
  const btn = document.createElement("button");
  btn.className = "preset-btn";
  btn.dataset.id = preset.id;
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
    update();
  });
  presetGrid.appendChild(btn);
});

function renderThumbs(){
  const t = theme({...state, title:"Título aqui", subtitle:"Descrição de exemplo do texto"});
  PRESETS.forEach(preset => {
    const c = thumbCanvases[preset.id];
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, c.width*0.4, c.height);
    g.addColorStop(0, "#6a7d8c"); g.addColorStop(1, "#1f2630");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);
    preset.draw(ctx, c.width, c.height, t);
  });
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

function setVideo(file){
  videoFile = file;
  if(bgVideo.src) URL.revokeObjectURL(bgVideo.src);
  if(file){
    bgVideo.src = URL.createObjectURL(file);
    bgVideo.play().catch(() => {});
  }else{
    bgVideo.removeAttribute("src");
    bgVideo.load();
  }
  emptyHint.hidden = !!file;
  videoNameEl.textContent = file ? file.name : "Escolher vídeo";
  downloadVideoBtn.disabled = !file;
}
videoInput.addEventListener("change", e => {
  if(e.target.files[0]) setVideo(e.target.files[0]);
});

/* ============================================================
   LIMPAR
   ============================================================ */
document.getElementById("resetBtn").addEventListener("click", async () => {
  if(!confirm("Apagar textos, cores e template e começar do zero? Sua biblioteca de logos continua salva.")) return;
  try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
  state = clone(DEFAULTS);
  videoInput.value = "";
  setVideo(null);
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

document.getElementById("downloadBtn").addEventListener("click", () => {
  renderTo(mainCanvas);
  mainCanvas.toBlob(blob => downloadBlob(blob, `moldura-${state.presetId}-${safeName()}.png`), "image/png");
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

  const overlay = document.createElement("canvas");
  overlay.width = W; overlay.height = H;
  renderTo(overlay);
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
        sample.draw(fctx, 0, 0, W, H);
        fctx.drawImage(overlay, 0, 0);
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
}

downloadVideoBtn.addEventListener("click", async () => {
  if(exporting){ conversion?.cancel(); return; }
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
    ]);
  }catch(e){ /* fontes: melhor esforço */ }
  update();
}
init();
