const FONTS = [
  { value: "'Anton', sans-serif",           label: "Anton (condensada)" },
  { value: "'Bebas Neue', sans-serif",       label: "Bebas Neue" },
  { value: "'Archivo Black', sans-serif",    label: "Archivo Black" },
  { value: "'Bangers', cursive",             label: "Bangers (quadrinhos)" },
  { value: "'Comic Neue', cursive",          label: "Comic Neue (zoeira)" },
  { value: "'Permanent Marker', cursive",    label: "Permanent Marker (à mão)" },
  { value: "'Rock Salt', cursive",           label: "Rock Salt (rabisco)" },
  { value: "'Rubik Mono One', sans-serif",   label: "Rubik Mono (pesada)" },
  { value: "'Press Start 2P', cursive",      label: "Press Start (arcade)" },
  { value: "'Manrope', sans-serif",          label: "Manrope (limpa)" },
];

const DEFAULT_TEXT = ["SUA FRASE", "AQUI", "NA FAIXA"];

const PRESETS = [
  {
    id: "guarda-popular",
    name: "Guarda Popular",
    format: "quadrada",
    styles: [
      { bg: "#c8102e", color: "#f5f5f0", font: "'Anton', sans-serif", size: 38 },
      { bg: "#f5f5f0", color: "#c8102e", font: "'Bebas Neue', sans-serif", size: 36 },
      { bg: "#c8102e", color: "#f5f5f0", font: "'Anton', sans-serif", size: 38 },
    ],
  },
  {
    id: "decada-70",
    name: "Década de 70",
    format: "quadrada",
    styles: [
      { bg: "#f5f5f0", color: "#c8102e", font: "'Rock Salt', cursive", size: 30 },
      { bg: "#c8102e", color: "#f5f5f0", font: "'Rock Salt', cursive", size: 30 },
      { bg: "#f5f5f0", color: "#c8102e", font: "'Rock Salt', cursive", size: 30 },
    ],
  },
];

// cada linha: { text, bg, color, font }
let lines = [0, 1, 2].map((i) => ({
  text: DEFAULT_TEXT[i],
  bg: i % 2 === 0 ? "#c8102e" : "#f5f5f0",
  color: i % 2 === 0 ? "#f5f5f0" : "#c8102e",
  font: FONTS[0].value,
  size: 34,
}));

let format = "quadrada";

const formatSelect = document.getElementById("format");
const lineCountSelect = document.getElementById("lineCount");
const lineControls = document.getElementById("lineControls");
const presetControls = document.getElementById("presetControls");
const banner = document.getElementById("banner");
const downloadBtn = document.getElementById("downloadBtn");

function setLineCount(count) {
  if (lines.length < count) {
    while (lines.length < count) {
      const i = lines.length;
      lines.push({
        text: DEFAULT_TEXT[i] || "TEXTO",
        bg: i % 2 === 0 ? "#c8102e" : "#f5f5f0",
        color: i % 2 === 0 ? "#f5f5f0" : "#c8102e",
        font: FONTS[0].value,
        size: 34,
      });
    }
  } else {
    lines = lines.slice(0, count);
  }
}

function setActivePreset(id) {
  presetControls.querySelectorAll("[data-preset]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === id);
  });
}

function applyPreset(preset) {
  format = preset.format;
  formatSelect.value = format;
  setLineCount(preset.styles.length);
  lines = lines.map((line, i) => ({ ...line, ...preset.styles[i] }));
  lineCountSelect.value = String(lines.length);
  setActivePreset(preset.id);
  renderControls();
  renderPreview();
}

function renderPresets() {
  presetControls.innerHTML = PRESETS.map((preset) => `
    <button class="preset-card" type="button" data-preset="${preset.id}">
      <span class="preset-card__swatches" aria-hidden="true">
        ${preset.styles.map((style) => `<i style="background:${style.bg}"></i>`).join("")}
      </span>
      <span class="preset-card__name">${preset.name}</span>
    </button>
  `).join("");

  presetControls.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = PRESETS.find((item) => item.id === button.dataset.preset);
      applyPreset(preset);
    });
  });
}

function renderControls() {
  lineControls.innerHTML = "";
  lines.forEach((line, i) => {
    const block = document.createElement("div");
    block.className = "line-block";

    block.innerHTML = `
      <div class="line-block__header">
        <div class="line-block__title">Linha ${i + 1}</div>
        <div class="line-actions" aria-label="Reordenar linha ${i + 1}">
          <button type="button" data-move="up" data-idx="${i}" aria-label="Mover linha ${i + 1} para cima" ${i === 0 ? "disabled" : ""}>↑</button>
          <button type="button" data-move="down" data-idx="${i}" aria-label="Mover linha ${i + 1} para baixo" ${i === lines.length - 1 ? "disabled" : ""}>↓</button>
        </div>
      </div>
      <div class="field">
        <label>Texto</label>
        <input type="text" data-idx="${i}" data-field="text" value="${line.text}">
      </div>
      <div class="field">
        <label>Fonte</label>
        <select data-idx="${i}" data-field="font">
          ${FONTS.map(
            (f) =>
              `<option value="${f.value}" ${f.value === line.font ? "selected" : ""}>${f.label}</option>`
          ).join("")}
        </select>
      </div>
      <div class="field size-field">
        <div class="size-field__header">
          <label for="font-size-${i}">Tamanho</label>
          <output id="font-size-${i}">${line.size}px</output>
        </div>
        <input id="font-size-${i}" type="range" min="14" max="76" step="1" data-idx="${i}" data-field="size" value="${line.size}">
      </div>
      <div class="color-row">
        <div class="field">
          <label>Cor de fundo</label>
          <input type="color" data-idx="${i}" data-field="bg" value="${line.bg}">
        </div>
        <div class="field">
          <label>Cor do texto</label>
          <input type="color" data-idx="${i}" data-field="color" value="${line.color}">
        </div>
      </div>
    `;

    lineControls.appendChild(block);
  });

  lineControls.querySelectorAll("[data-field]").forEach((el) => {
    el.addEventListener("input", (e) => {
      const idx = Number(e.target.dataset.idx);
      const field = e.target.dataset.field;
      lines[idx][field] = e.target.value;
      setActivePreset("");
      if (field === "size") {
        document.getElementById(`font-size-${idx}`).value = `${e.target.value}px`;
      }
      renderPreview();
    });
  });

  lineControls.querySelectorAll("[data-move]").forEach((button) => {
    button.addEventListener("click", () => {
      const idx = Number(button.dataset.idx);
      const nextIdx = button.dataset.move === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= lines.length) return;
      [lines[idx], lines[nextIdx]] = [lines[nextIdx], lines[idx]];
      setActivePreset("");
      renderControls();
      renderPreview();
    });
  });
}

function renderPreview() {
  banner.className = `banner formato-${format}`;
  banner.innerHTML = "";
  lines.forEach((line) => {
    const div = document.createElement("div");
    div.className = "banner__line";
    div.textContent = line.text;
    div.style.background = line.bg;
    div.style.color = line.color;
    div.style.fontFamily = line.font;
    div.style.fontSize = `${line.size}px`;
    div.style.fontWeight = line.font.includes("Manrope") ? "800" : "400";
    banner.appendChild(div);
  });
}

formatSelect.addEventListener("change", (e) => {
  format = e.target.value;
  renderPreview();
});

lineCountSelect.addEventListener("change", (e) => {
  setLineCount(Number(e.target.value));
  renderControls();
  renderPreview();
});

downloadBtn.addEventListener("click", async () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const safariWindow = isIOS ? window.open("", "_blank") : null;

  try {
    const canvas = await html2canvas(banner, { scale: 2, backgroundColor: null });
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

    if (!blob) {
      safariWindow?.close();
      return;
    }

    const imageUrl = URL.createObjectURL(blob);

    if (isIOS) {
      if (safariWindow) {
        safariWindow.location.href = imageUrl;
      } else {
        window.location.href = imageUrl;
      }
      return;
    }

    const link = document.createElement("a");
    link.download = "faixa.png";
    link.href = imageUrl;
    link.click();
    setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
  } catch (error) {
    safariWindow?.close();
    console.error("Não foi possível gerar o PNG.", error);
  }
});

renderPresets();
renderControls();
renderPreview();
