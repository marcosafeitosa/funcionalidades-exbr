function exibirErroVisual(mensagem) {
  const containerId = "erro-extensao-visual";

  // Evita múltiplas criações
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.position = "fixed";
    container.style.top = "10px";
    container.style.right = "10px";
    container.style.zIndex = "9999";
    container.style.maxWidth = "300px";
    document.body.appendChild(container);
  }

  const erroBox = document.createElement("div");
  erroBox.textContent = mensagem;
  erroBox.style.background = "#ff4d4f";
  erroBox.style.color = "#fff";
  erroBox.style.padding = "10px 15px";
  erroBox.style.marginBottom = "10px";
  erroBox.style.borderRadius = "6px";
  erroBox.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  erroBox.style.fontFamily = "Arial, sans-serif";
  erroBox.style.fontSize = "14px";

  container.appendChild(erroBox);

  // Remove após 6 segundos
  setTimeout(() => {
    erroBox.remove();
    if (container.childElementCount === 0) container.remove();
  }, 6000);
}

// Captura erros globais da extensão
window.addEventListener("error", (event) => {
  exibirErroVisual(`Erro: ${event.message}`);
});

// Captura erros de promises não tratadas
window.addEventListener("unhandledrejection", (event) => {
  exibirErroVisual(`Erro não tratado: ${event.reason}`);
});

// Importa o módulo principal
import("./modules/botaoAcionador.js")
  .then((module) => module.verificarERodarModulo())
  .catch((err) => {
    console.error("Falha ao carregar módulo:", err);
    exibirErroVisual("Falha ao carregar módulo: " + err.message);
  });
