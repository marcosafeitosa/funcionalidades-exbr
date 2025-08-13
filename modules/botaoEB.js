const configBotao = {
  texto: "▶️ Reproduzir",
  posicao: "fixed",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  corFundo: "#006341",
  dropdownStyles: {
    position: "relative",
    backgroundColor: "#2c3e50",
    color: "white",
    minWidth: "220px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
    borderRadius: "6px",
    padding: "10px",
    display: "none",
    marginTop: "10px",
    fontFamily: "sans-serif",
  },
  itemStyles: {
    padding: "8px 10px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

let dropdown = null;
let botao = null;

// Inicia o botão na página
export function iniciarBotaoEB() {
  botao = criarBotao();
  dropdown = criarDropdown();

  // Container para botão + dropdown
  const container = document.createElement("div");
  container.id = "container-eb";
  container.style.position = "fixed";
  container.style.bottom = configBotao.bottom;
  container.style.left = configBotao.left;
  container.style.transform = configBotao.transform;
  container.style.zIndex = "10000";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";

  container.appendChild(botao);
  container.appendChild(dropdown);
  document.body.appendChild(container);

  configurarEventos();

  return botao;
}

function criarBotao() {
  const btn = document.createElement("button");
  Object.assign(btn.style, {
    backgroundColor: configBotao.corFundo,
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    userSelect: "none",
  });
  btn.textContent = configBotao.texto;
  btn.id = "botao-eb";
  return btn;
}

function criarDropdown() {
  const dd = document.createElement("div");
  dd.id = "dropdown-eb";
  Object.assign(dd.style, configBotao.dropdownStyles);

  // Label e input para dia
  const labelDia = document.createElement("label");
  labelDia.textContent = "Dia início:";
  labelDia.style.marginRight = "10px";

  // Input dia (type number)
  const inputDia = document.createElement("input");
  inputDia.type = "number";
  inputDia.min = "1";
  inputDia.max = new Date().getDate().toString();
  inputDia.value = "1";
  inputDia.style.width = "50px";
  inputDia.style.padding = "3px 6px";
  inputDia.style.borderRadius = "4px";
  inputDia.style.border = "none";
  inputDia.style.marginRight = "10px";

  const divInput = document.createElement("div");
  divInput.style.display = "flex";
  divInput.style.alignItems = "center";
  divInput.style.marginBottom = "10px";

  divInput.appendChild(labelDia);
  divInput.appendChild(inputDia);
  dd.appendChild(divInput);

  // Botão Buscar
  const botaoBuscar = document.createElement("button");
  botaoBuscar.textContent = "Buscar";
  Object.assign(botaoBuscar.style, {
    backgroundColor: "#3498db",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  });

  dd.appendChild(botaoBuscar);

  // Evento click botão buscar
  botaoBuscar.addEventListener("click", async () => {
    const diaSelecionado = parseInt(inputDia.value, 10);
    const diaHoje = new Date().getDate();

    if (
      isNaN(diaSelecionado) ||
      diaSelecionado < 1 ||
      diaSelecionado > diaHoje
    ) {
      alert(`Digite um dia válido entre 1 e ${diaHoje}`);
      return;
    }

    // Importa e chama função do monitores.js passando o dia selecionado
    try {
      const moduloMonitores = await import("./monitores.js");
      // Aqui passamos o dia inicial selecionado
      moduloMonitores.exibirMenuMonitores(diaSelecionado);
      esconderDropdown();
    } catch (err) {
      console.error("Erro ao carregar módulo monitores:", err);
      alert("Erro ao buscar os dados.");
    }
  });

  return dd;
}

function configurarEventos() {
  botao.addEventListener("click", (e) => {
    e.stopPropagation();
    if (dropdown.style.display === "block") {
      esconderDropdown();
    } else {
      mostrarDropdown();
    }
  });

  // Fecha dropdown ao clicar fora
  document.addEventListener("click", esconderDropdown);

  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

function mostrarDropdown() {
  dropdown.style.display = "block";
}

function esconderDropdown() {
  if (dropdown) dropdown.style.display = "none";
}
