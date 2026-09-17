const FONTS = [
  { value: "'Anton', sans-serif",           label: "Anton (condensada)" },
  { value: "'Bebas Neue', sans-serif",       label: "Bebas Neue" },
  { value: "'Archivo Black', sans-serif",    label: "Archivo Black" },
  { value: "'Permanent Marker', cursive",    label: "Permanent Marker (à mão)" },
  { value: "'Manrope', sans-serif",          label: "Manrope (limpa)" },
];

const DEFAULT_TEXT = ["SUA FRASE", "AQUI", "NA FAIXA"];

// cada linha: { text, bg, color, font }
let lines = [0, 1, 2].map((i) => ({
  text: DEFAULT_TEXT[i],
  bg: i % 2 === 0 ? "#c8102e" : "#f5f5f0",
  color: i % 2 === 0 ? "#f5f5f0" : "#c8102e",
  font: FONTS[0].value,
}));

let format = "quadrada";

const formatSelect = document.getElementById("format");
const lineCountSelect = document.getElementById("lineCount");
const lineControls = document.getElementById("lineControls");
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
      });
    }
  } else {
    lines = lines.slice(0, count);
  }
}

function renderControls() {
  lineControls.innerHTML = "";
  lines.forEach((line, i) => {
    const block = document.createElement("div");
    block.className = "line-block";

    block.innerHTML = `
      <div class="line-block__title">Linha ${i + 1}</div>
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
    div.style.fontSize = line.font.includes("Permanent Marker") ? "26px" : "34px";
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

downloadBtn.addEventListener("click", () => {
  html2canvas(banner, { scale: 2, backgroundColor: null }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "faixa.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

renderControls();
renderPreview();
