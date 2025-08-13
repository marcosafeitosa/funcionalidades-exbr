const API_URL =
  "https://supabase.exbrhabbo.com/rest/v1/enrollments?select=*%2Crole%3Aroles%28id%2Cname%2Ctype%29%2Cinitials%3Ainitials%28id%2Cname%29%2Ccompany%3Acompanies%28id%2Cname%29%2Cstatus%3Astatus%28id%2Cname%29%2Cbranch%3Abranches%28id%2Cname%29%2Cpromoted_by%28*%29%2Clecture%3Alectures%28id%2Cname%29&nickname=ilike.%25";

const REPORTS =
  "https://supabase.exbrhabbo.com/rest/v1/reports?select=*%2Chandler%28id%2Cnickname%2Crole%3Aroles%28id%2Cname%29%29%2Csecondary%28id%2Cnickname%2Crole%3Aroles%28id%2Cname%29%29%2Cresponsible%28id%2Cnickname%2Crole%3Aroles%28id%2Cname%29%29%2Cbranch%3Abranches%28*%29%2Ctype%3Areport_types%28*%29%2Caccepted_by%28id%2Cnickname%2Crole%3Aroles%28id%2Cname%29%29&order=created_at.desc&offset=0&limit=25&branch=eq.895039c4-2473-494c-b293-5506e1d8152c&secondary=eq.";

const API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E";

const AUTH_TOKEN =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E";

// Busca relatórios usando o ID no parâmetro secondary=eq.
async function buscarRelatoriosPorTreinadorId(treinadorId) {
  const urlReports = REPORTS + treinadorId;

  try {
    const response = await fetch(urlReports, {
      method: "GET",
      headers: {
        apikey: API_KEY,
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao buscar relatórios: ${response.status} ${response.statusText}`
      );
    }

    const dadosReports = await response.json();
    console.log("Relatórios encontrados:", dadosReports);

    const containerPai = document.querySelector(
      "#informacoes-relatorios > div"
    );

    let divRelatorios = document.querySelector("#relatorios");
    if (divRelatorios) divRelatorios.remove();

    divRelatorios = document.createElement("div");
    divRelatorios.id = "relatorios";
    divRelatorios.style.display = "flex";
    divRelatorios.style.flexDirection = "column";
    divRelatorios.style.flexWrap = "nowrap";
    divRelatorios.style.gap = "5px";
    containerPai.appendChild(divRelatorios);

    dadosReports.forEach((relatorio, index) => {
      let statusExtras = "";
      if (relatorio.error)
        statusExtras += ` <span style="color:#ef4444;">(Erro)</span>`;
      if (relatorio.trainee_report)
        statusExtras += ` <span style="color:#fbbf24;">(Teste)</span>`;

      // Bolinha e texto de aceitação
      const aceito = relatorio.accepted_by !== null;
      const textoAceito = aceito
        ? `aceito por ${relatorio.accepted_by.nickname}${statusExtras}`
        : "Pendente";

      const elemento = document.createElement("div");
      elemento.className = "border px-2";
      elemento.setAttribute("data-state", "closed");
      elemento.setAttribute("data-orientation", "vertical");

      elemento.innerHTML = `
        <h3 data-orientation="vertical" data-state="closed" class="flex">
          <button type="button" aria-controls="radix-${index}" aria-expanded="false" data-state="closed" data-orientation="vertical"
            class="flex flex-1 items-center justify-between text-sm font-medium transition-all hover:underline py-2" data-radix-collection-item="">
            <span>
              ${relatorio.type?.name || "Tipo inválido"}
              <span class="ml-2 text-muted-foreground">${textoAceito}</span>
            </span>
            <span class="ml-auto mr-2 block size-2 rounded-full" id="bolinha-${index}"></span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="size-4 shrink-0 text-muted-foreground transition-transform duration-200">
              <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
          </button>
        </h3>
        <div id="radix-${index}" class="pb-4 pt-0 relative space-y-2" hidden>
          <div>
            <p style="display: flex; justify-content: space-between;">
              <span class="text-sm text-muted-foreground">Responsável: ${
                relatorio.responsible?.nickname || "Desconhecido"
              }</span>
              <span class="text-sm text-muted-foreground">Treinador: ${
                relatorio.secondary?.nickname || "Desconhecido"
              }</span>
            </p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Data de criação: ${
              relatorio.created_at || "N/A"
            }</p>
          </div>
          <p class="text-sm text-muted-foreground">Treinados: ${
            relatorio.students?.join(", ") || "N/A"
          }</p>

          <section class="space-y-3 rounded border px-1 py-2">
            <h3 class="font-semibold leading-none tracking-tight">Reprovados</h3>
            ${(relatorio.failed && relatorio.failed.length > 0
              ? relatorio.failed
              : [{}]
            )
              .map(
                (f) => `
                <div>
                  <p class="text-sm text-muted-foreground">Nickname: ${
                    f.student || ""
                  }</p>
                  <p class="text-sm text-muted-foreground">Motivo: ${
                    f.reason || ""
                  }</p>
                </div>
              `
              )
              .join("")}
          </section>

          <p class="text-sm text-muted-foreground">Aprovados: ${
            relatorio.approveds?.join(", ") || "N/A"
          }</p>
        </div>
      `;

      divRelatorios.appendChild(elemento);

      // Aplica cor da bolinha via JS
      const bolinha = document.getElementById(`bolinha-${index}`);
      bolinha.style.width = "6pxpx";
      bolinha.style.height = "6pxpx";
      bolinha.style.borderRadius = "50%";
      bolinha.style.backgroundColor = aceito ? " #34d399" : " #fbbf24";

      const btn = elemento.querySelector("button");
      const content = elemento.querySelector(`#radix-${index}`);

      btn.addEventListener("click", () => {
        // Fecha todos os outros relatórios
        divRelatorios.querySelectorAll("div[data-state]").forEach((el) => {
          if (el !== elemento) {
            el.setAttribute("data-state", "closed");
            el.querySelector(
              `#radix-${Array.from(divRelatorios.children).indexOf(el)}`
            ).hidden = true;
          }
        });

        // Toggle do atual
        const aberto = content.hidden;
        content.hidden = !aberto;
        elemento.setAttribute("data-state", aberto ? "open" : "closed");
      });
    });

    return dadosReports;
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error);
  }
}

// Busca o ID do treinador e já chama a função de relatórios
export async function relatoriosTreinadores(nickTreinador) {
  if (!nickTreinador) {
    console.warn("Nick do treinador não encontrado.");
    return null;
  }

  const filtroNick = encodeURIComponent(`%${nickTreinador}%`);
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
      console.log("Nenhum resultado encontrado para:", nickTreinador);
      return null;
    }

    const treinadorId = data[0].id;
    console.log("ID do treinador:", treinadorId);

    await buscarRelatoriosPorTreinadorId(treinadorId);

    return treinadorId;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
}
