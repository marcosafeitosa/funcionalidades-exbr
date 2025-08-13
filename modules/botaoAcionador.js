const rotas = [
  // Rota mais específica primeiro
  {
    url: "https://ofc.exbrhabbo.com/externos/e34ee431-8e67-456d-8216-fce1b8a9a60b/central",
    modulo: () => import("./central.js").then((m) => m.centralDeAcoes()),
    aviso: "Extensão inicializada na Central de Ações.",
  },
  {
    url: "https://ofc.exbrhabbo.com/externos/e34ee431-8e67-456d-8216-fce1b8a9a60b",
    modulo: () => import("./monitores.js").then((m) => m.exibirMenuMonitores()),
    aviso: "Extensão inicializada na Lista de Monitores.",
  },
];

export function verificarERodarModulo() {
  const urlAtual = window.location.href;

  // Escolhe sempre a rota mais específica
  const rota = rotas
    .filter((r) => urlAtual.startsWith(r.url))
    .sort((a, b) => b.url.length - a.url.length)[0];

  if (rota) {
    rota.modulo();
    console.log("✅ Rota encontrada:", rota.url);
    if (rota.aviso) {
      mostrarAvisoSuspenso(rota.aviso);
    }
  } else {
    console.log("⚠ Nenhum módulo configurado para esta URL:", urlAtual);
  }
}

function mostrarAvisoSuspenso(texto) {
  let container = document.querySelector("#aviso-suspenso-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "aviso-suspenso-container";
    Object.assign(container.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      fontFamily: "Arial, sans-serif",
    });
    document.body.appendChild(container);
  }

  // Limpa avisos antigos para mostrar só 1
  container.innerHTML = "";

  const aviso = document.createElement("div");
  aviso.textContent = texto;
  Object.assign(aviso.style, {
    backgroundColor: "#215e35",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "5px",
    fontSize: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    opacity: "0",
    transition: "opacity 0.3s ease",
  });

  container.appendChild(aviso);

  requestAnimationFrame(() => {
    aviso.style.opacity = "1";
  });

  setTimeout(() => {
    aviso.style.opacity = "0";
    aviso.addEventListener(
      "transitionend",
      () => {
        aviso.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      },
      { once: true }
    );
  }, 4000);
}

function observarMudancasDeUrl(callback) {
  let oldHref = document.location.href;

  ["pushState", "replaceState"].forEach((method) => {
    const original = history[method];
    history[method] = function () {
      const result = original.apply(this, arguments);
      if (oldHref !== document.location.href) {
        oldHref = document.location.href;
        callback();
      }
      return result;
    };
  });

  window.addEventListener("popstate", () => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      callback();
    }
  });
}

// Começa a observar
observarMudancasDeUrl(verificarERodarModulo);
