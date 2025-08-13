const API_URL =
  "https://supabase.exbrhabbo.com/rest/v1/enrollments?select=*%2Crole%3Aroles%28id%2Cname%2Ctype%29%2Cinitials%3Ainitials%28id%2Cname%29%2Ccompany%3Acompanies%28id%2Cname%29%2Cstatus%3Astatus%28id%2Cname%29%2Cbranch%3Abranches%28id%2Cname%29%2Cpromoted_by%28*%29%2Clecture%3Alectures%28id%2Cname%29&nickname=ilike.%25";

const REPORTS_URL =
  "https://supabase.exbrhabbo.com/rest/v1/clusters_reports?select=*,member:enrollments!clusters_reports_member_fkey(id,nickname),report_model:cluster_report_models(*),accepted_by:enrollments!clusters_reports_accepted_by_fkey(id,nickname)&order=created_at.desc&or=(accepted.eq.true,accepted.eq.false,accepted.is.null)&cluster=eq.e34ee431-8e67-456d-8216-fce1b8a9a60b&member=eq.";

const API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E";

const AUTH_TOKEN =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E";

export async function relatoriosAceitosMonitores(nickMonitor) {
  if (!nickMonitor) {
    console.warn("NickMonitor não informado.");
    return null;
  }

  const filtroNick = encodeURIComponent(`%${nickMonitor}%`);
  const url = API_URL.replace("%25", filtroNick);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: API_KEY,
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.length) {
      console.log("Nenhum resultado encontrado para:", nickMonitor);
      return null;
    }

    console.log("ID do primeiro resultado:", data[0].id);

    // Chama a função para mostrar os relatórios aceitos
    await mostrarRelatoriosAceitos(data[0].id);

    return data[0].id; // retorna o memberId (opcional)
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
}

export async function mostrarRelatoriosAceitos(memberId) {
  if (!memberId) {
    console.warn("memberId não informado.");
    return;
  }

  const container = document.querySelector("#relatoriosAceitos");
  if (!container) {
    console.warn("Div #relatoriosAceitos não encontrada.");
    return;
  }

  // Limpa conteúdo anterior
  container.innerHTML = "";

  const url = REPORTS_URL + memberId;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: API_KEY,
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.length) {
      container.innerHTML = "<p>Nenhum relatório encontrado.</p>";
      return;
    }

    // Filtra os relatórios para os últimos 2 dias e remove pendentes
    const hoje = new Date();
    const doisDiasAtras = new Date();
    doisDiasAtras.setDate(hoje.getDate() - 2);

    const dataFiltrada = data.filter((relatorio) => {
      if (!relatorio.created_at) return false;
      if (relatorio.accepted !== true && relatorio.accepted !== false)
        return false; // só aprovado ou reprovado
      const dataRelatorio = new Date(relatorio.created_at);
      return dataRelatorio >= doisDiasAtras && dataRelatorio <= hoje;
    });

    if (!dataFiltrada.length) {
      container.innerHTML = "<p>Nenhum relatório recente encontrado.</p>";
      return;
    }

    dataFiltrada.forEach((relatorio) => {
      const divRelatorio = document.createElement("div");
      divRelatorio.style.border = "1px solid #282828";
      divRelatorio.style.padding = "8px";
      divRelatorio.style.marginBottom = "10px";
      divRelatorio.style.borderRadius = "5px";

      // accepted (true -> aprovado, false -> reprovado)
      const acceptedText = relatorio.accepted ? "Aprovado" : "Reprovado";
      const acceptedColor = relatorio.accepted ? " #34d399" : " #ef4444";

      // Formatando data para formato Brasil
      let dataFormatada = "Sem data";
      if (relatorio.created_at) {
        const dataObj = new Date(relatorio.created_at);
        dataFormatada = dataObj.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }

      // Cabeçalho do relatório
      let html = `
        <p style="display: flex; justify-content: space-between">
          <span>${
            relatorio.report_model?.name ?? "N/A"
          } - ${dataFormatada}</span>
          <span style="color:${acceptedColor};">${acceptedText}</span>
        </p>

        <p style="color: #a1a1aa; display: flex; justify-content: space-between">
          <span>${relatorio.member?.nickname ?? "N/A"}</span>
          <span>Aceito por ${relatorio.accepted_by?.nickname ?? "N/A"}</span>
        </p>
      `;

      // Motivo — só aparece se houver texto
      if (relatorio.reason && relatorio.reason.trim() !== "") {
        html += `<p style="color: #a1a1aa;">Motivo: ${relatorio.reason}</p>`;
      }

      // Report
      html += `<p style="margin-top: 3px;">${relatorio.report ?? "N/A"}</p>`;

      divRelatorio.innerHTML = html;
      container.appendChild(divRelatorio);
    });
  } catch (error) {
    console.error("Erro ao buscar relatórios aceitos:", error);
    container.innerHTML = `<p style="color:red;">Erro ao carregar os relatórios.</p>`;
  }
}
