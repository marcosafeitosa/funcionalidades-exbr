// const API_URL =
//   "https://supabase.exbrhabbo.com/rest/v1/enrollments?select=*%2Crole%3Aroles%28id%2Cname%2Ctype%29%2Cinitials%3Ainitials%28id%2Cname%29%2Ccompany%3Acompanies%28id%2Cname%29%2Cstatus%3Astatus%28id%2Cname%29%2Cbranch%3Abranches%28id%2Cname%29%2Cpromoted_by%28*%29%2Clecture%3Alectures%28id%2Cname%29&nickname=ilike.%25";
// const REPORTS_URL =
//   "https://supabase.exbrhabbo.com/rest/v1/clusters_reports?select=*,member:enrollments!clusters_reports_member_fkey(id,nickname),report_model:cluster_report_models(*),accepted_by:enrollments!clusters_reports_accepted_by_fkey(id,nickname)&order=created_at.desc&accepted=is.true&cluster=eq.e34ee431-8e67-456d-8216-fce1b8a9a60b&member=eq.";

// const API_KEY =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E";
// const AUTH_TOKEN =
//   "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E";

const relAceitosPromise = import("./relatoriosAceitosMonitores.js");
const relTreinadores = import("./relatorioTreinadores.js");

export async function centralDeAcoes() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest(
      "body > div > section > main > section > main > div > div.p-6.pt-0 > section > section > div.space-y-4 > div > div > button"
    );

    if (!target) return;

    const buttonX = document.querySelector("#radix-\\:r6\\: > button > svg");
    buttonX.style.position = "fixed";
    buttonX.style.right = "328px";

    // Pega o nick relativo ao botão clicado
    NickMonitor(target);

    const container = document.querySelector("#radix-\\:r6\\:");
    if (!container) {
      console.warn("Elemento '#radix-\\:r6\\:' não encontrado.");
      return;
    }

    // Evita duplicação
    if (container.dataset.modificado === "true") return;
    container.dataset.modificado = "true";

    // Garante que container tenha position relative para o absolute funcionar
    const style = window.getComputedStyle(container);
    if (style.position === "static" || !style.position) {
      container.style.position = "relative";
    }

    // --- informacoes-relatorios como filho normal ---
    let informacoesRelatorios = document.querySelector(
      "#informacoes-relatorios"
    );
    if (!informacoesRelatorios) {
      informacoesRelatorios = document.createElement("div");
      informacoesRelatorios.id = "informacoes-relatorios";
      informacoesRelatorios.style.width = "62%";
      informacoesRelatorios.style.overflowY = "scroll"; // ou "auto"
      informacoesRelatorios.style.scrollbarWidth = "none"; // Firefox
      informacoesRelatorios.style.msOverflowStyle = "none"; // IE 10+
      informacoesRelatorios.style.height = "232px";
      container.appendChild(informacoesRelatorios);
    }
    informacoesRelatorios.innerHTML = ""; // limpa conteúdo anterior

    // Cria nova div dentro de informacoes-relatorios
    const novaDiv = document.createElement("div");
    const textArea = document.querySelector("#radix-\\:r6\\: > textarea");
    textArea.style.width = "unset";
    novaDiv.style.width = "100%";
    novaDiv.style.height = "200px";
    informacoesRelatorios.appendChild(novaDiv);

    // --- relatoriosAceitos flutuando no canto direito ---
    let relatoriosAceitos = document.querySelector("#relatoriosAceitos");
    if (!relatoriosAceitos) {
      relatoriosAceitos = document.createElement("div");
      relatoriosAceitos.id = "relatoriosAceitos";
      // relatoriosAceitos.style.backgroundColor = "#2222";
      relatoriosAceitos.style.width = "35%";
      relatoriosAceitos.style.height = "438.9px";
      relatoriosAceitos.style.position = "absolute";
      relatoriosAceitos.style.top = "0";
      relatoriosAceitos.style.right = "0";
      relatoriosAceitos.style.overflowY = "auto";
      relatoriosAceitos.style.overflowY = "scroll"; // ou "auto"
      relatoriosAceitos.style.scrollbarWidth = "none"; // Firefox
      relatoriosAceitos.style.msOverflowStyle = "none"; // IE 10+

      // Para o ::-webkit-scrollbar, precisa adicionar via CSS, pois não tem suporte via style JS.
      // Então adiciona uma regra CSS no seu arquivo ou via JS assim:
      const style = document.createElement("style");
      style.textContent = `
  #relatoriosAceitos::-webkit-scrollbar {
    display: none;
  }
`;
      document.head.appendChild(style);

      relatoriosAceitos.style.textContent = `
  #relatoriosAceitos::-webkit-scrollbar {
    display: none;
  }
`;
      relatoriosAceitos.style.padding = "10px";
      relatoriosAceitos.style.boxSizing = "border-box";
      relatoriosAceitos.style.zIndex = "9999";
      relatoriosAceitos.innerHTML = `<p style="font-size: 14px; font-weight: 400; text-align: center;">Ações aceitas</p>`;
    } else if (!relatoriosAceitos.isConnected) {
      container.appendChild(relatoriosAceitos);
    }
    // Se ainda não estiver no container, anexa
    if (relatoriosAceitos.parentElement !== container) {
      container.appendChild(relatoriosAceitos);
    }

    // Ajusta margem direita dos irmãos (exceto informacoes-relatorios e relatoriosAceitos)
    const filhosOriginais = Array.from(container.children).filter(
      (el) => el !== informacoesRelatorios && el !== relatoriosAceitos
    );
    filhosOriginais.forEach((el) => {
      el.style.marginRight = "38%"; // espaço para o relatoriosAceitos flutuante
    });

    // Estilização container
    container.style.setProperty("width", "95vw", "important");
    container.style.setProperty("max-width", "none", "important");
    container.style.setProperty("outline", "none", "important");

    const p = container.querySelector("p");
    if (p) p.style.setProperty("font-size", "15px");
  });
}

function NickMonitor(botaoClicado) {
  const containerPai = botaoClicado.closest("div.space-y-4 > div");
  if (!containerPai) return;

  const pCriadoPor = Array.from(containerPai.querySelectorAll("p")).find((p) =>
    p.textContent.includes("Criado por")
  );

  if (!pCriadoPor) return;

  const texto = pCriadoPor.textContent.trim();
  const prefixo = "Criado por ";
  let nick = texto.includes(prefixo)
    ? texto.substring(texto.indexOf(prefixo) + prefixo.length).trim()
    : null;

  console.log("Nick encontrado:", nick);
  relAceitosPromise
    .then((module) => module.relatoriosAceitosMonitores(nick))
    .catch(console.error);
  relTreinadores
    .then((module) => module.relatoriosTreinadores(nick))
    .catch(console.error);
}
