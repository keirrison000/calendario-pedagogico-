/**
 * Calendário Pedagógico — Antonieta Borges Alves
 * Sistema Oficial de Planejamento Escolar e Prazos da Coordenação
 */

const CP = {
  /* =========================================================
     CONFIGURAÇÃO & CATEGORIAS (LIMPAS E DIRETAS)
  ========================================================= */
  config: {
    categories: {
      feriado: {
        label: "Feriado nacional ou ponto facultativo",
        color: "#dc2626",
        important: true
      },
      emenda: {
        label: "Emenda de feriado",
        color: "#7c3aed",
        important: false
      },
      ferias: {
        label: "Férias Docente",
        color: "#ec4899",
        important: false
      },
      recesso: {
        label: "Recesso escolar",
        color: "#16a34a",
        important: false
      },
      letivo: {
        label: "Dia letivo",
        color: "#5c93c4",
        important: false
      },
      planejamento: {
        label: "Planejamento/Replanejamento (Não letivo)",
        color: "#eab308",
        important: true
      },
      fim_bimestre: {
        label: "Fim do bimestre",
        color: "#6b7280",
        important: true
      },
      reuniao_pedagogica: {
        label: "Não letivo - (Reunião pedagógica após às 12h)",
        color: "#ea580c",
        important: true
      }
    },

    weekdaysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],

    monthsFull: [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],

    monthsShort: [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ],

    monthMeta: [
      { daysLetivos: 0, notes: "01 - Confraternização universal" },
      { daysLetivos: 15, notes: "16 - Emenda de Carnaval | 17 - Carnaval | 18 - Quarta-Feira de cinzas (Reunião após 12h) | 19 e 20 - Planejamento" },
      { daysLetivos: 22, notes: "22 dias letivos (Sem feriados)" },
      { daysLetivos: 19, notes: "03 - Paixão de Cristo | 20 - Emenda de Tiradentes | 21 - Tiradentes | 22 - Fim do 1º Bimestre" },
      { daysLetivos: 20, notes: "01 - Dia do trabalhador" },
      { daysLetivos: 20, notes: "04 - Corpus Christi | 05 - Emenda de Corpus Christi" },
      { daysLetivos: 10, notes: "06 - Fim do 2º Bimestre | 07 a 21 - Férias Docente | 09 - Revolução Constitucionalista | 10 - Emenda | 22 e 23 - Replanejamento" },
      { daysLetivos: 21, notes: "21 dias letivos (Sem feriados)" },
      { daysLetivos: 21, notes: "07 - Independência do Brasil" },
      { daysLetivos: 19, notes: "02 - Fim do 3º Bimestre | 12 - Nossa Senhora Aparecida | 15 - Dia do professor | 28 - Dia do servidor público" },
      { daysLetivos: 19, notes: "02 - Finados | 15 - Proclamação da República | 20 - Consciência Negra" },
      { daysLetivos: 14, notes: "18 - Fim do 4º Bimestre (Término Letivo) | 25 - Natal | 19 a 31 - Recesso Escolar" }
    ],

    getBimesters(year) {
      return [
        {
          n: 1,
          label: "1º Bimestre",
          start: new Date(year, 1, 4),  // 04/02/2026
          end: new Date(year, 3, 22)    // 22/04/2026
        },
        {
          n: 2,
          label: "2º Bimestre",
          start: new Date(year, 3, 23), // 23/04/2026
          end: new Date(year, 6, 6)     // 06/07/2026
        },
        {
          n: 3,
          label: "3º Bimestre",
          start: new Date(year, 6, 24), // 24/07/2026
          end: new Date(year, 9, 2)     // 02/10/2026
        },
        {
          n: 4,
          label: "4º Bimestre",
          start: new Date(year, 9, 5),  // 05/10/2026
          end: new Date(year, 11, 18)   // 18/12/2026
        }
      ];
    }
  },

  /* =========================================================
     UTILITÁRIOS
  ========================================================= */
  utils: {
    pad(num) {
      return String(num).padStart(2, "0");
    },

    toISO(date) {
      const d = new Date(date);
      return (
        d.getFullYear() +
        "-" +
        this.pad(d.getMonth() + 1) +
        "-" +
        this.pad(d.getDate())
      );
    },

    parseISO(value) {
      if (!value) return new Date();
      const parts = value.split("-").map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2]);
    },

    formatDate(date) {
      return date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    },

    formatDateShort(date) {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit"
      });
    },

    getStartOfWeek(date) {
      const d = new Date(date);
      const day = d.getDay(); // 0 = Dom, 1 = Seg, ..., 6 = Sab
      d.setDate(d.getDate() - day);
      d.setHours(0, 0, 0, 0);
      return d;
    },

    addDays(date, days) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },

    isSameDay(a, b) {
      const d1 = new Date(a);
      const d2 = new Date(b);
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    },

    generateUID() {
      return "ev_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    },

    escapeHTML(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },

    getBimesterForDate(date) {
      const year = date.getFullYear();
      const bimesters = CP.config.getBimesters(year);
      const time = date.getTime();
      return bimesters.find(b => time >= b.start.getTime() && time <= b.end.getTime()) || null;
    },

    formatDeadlineDate(ev) {
      const start = this.parseISO(ev.dateStart);
      const end = this.parseISO(ev.dateEnd || ev.dateStart);
      let text = start.toLocaleDateString("pt-BR");

      if (!this.isSameDay(start, end)) {
        text += " até " + end.toLocaleDateString("pt-BR");
      }

      return text;
    },

    formatEventDate(ev) {
      const start = this.parseISO(ev.dateStart);
      const end = this.parseISO(ev.dateEnd || ev.dateStart);
      let text = start.toLocaleDateString("pt-BR");

      if (!this.isSameDay(start, end)) {
        text += " até " + end.toLocaleDateString("pt-BR");
      }

      if (!ev.allDay && ev.timeStart) {
        text += " • " + ev.timeStart;
        if (ev.timeEnd) {
          text += "–" + ev.timeEnd;
        }
      } else {
        text += " • Dia todo";
      }

      return text;
    }
  },

  /* =========================================================
     ARMAZENAMENTO E DADOS INICIAIS
  ========================================================= */
  storage: {
    STORAGE_KEY: "cp_pedagogico_events_v5",
    THEME_KEY: "cp_pedagogico_theme",

    async loadEvents() {
      // 1. Dados embutidos diretamente no código (independente de servidor / Node.js)
      if (typeof CALENDAR_EVENTS_DATA !== "undefined" && Array.isArray(CALENDAR_EVENTS_DATA) && CALENDAR_EVENTS_DATA.length) {
        return CALENDAR_EVENTS_DATA.map(ev => ({
          ...ev,
          title: (ev.title || "").replace(/^Prazo:\s*/i, "")
        }));
      }

      // 2. Tenta carregar do servidor (events.json) se estiver rodando com server
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length) {
            return data.map(ev => ({
              ...ev,
              title: (ev.title || "").replace(/^Prazo:\s*/i, "")
            }));
          }
        }
      } catch (err) {}

      return [];
    },

    saveEvents(events) {
      // Salva no servidor (events.json)
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(events)
      }).catch(err => console.warn("Nao foi possivel salvar no servidor:", err.message));

      // Salva tambem no localStorage como backup local
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
      } catch (e) {}
    },

    generateSampleEvents() {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const u = CP.utils;

      // Garante dia válido dentro do mês atual
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

      const makeEv = (day, category, title, location, description, timeStart, timeEnd, allDay = false) => {
        const validDay = Math.min(Math.max(day, 1), lastDayOfMonth);
        const d = new Date(year, month, validDay);
        return {
          id: u.generateUID(),
          title: title.replace(/^Prazo:\s*/i, ""),
          category,
          dateStart: u.toISO(d),
          dateEnd: u.toISO(d),
          allDay,
          timeStart: allDay ? "" : timeStart,
          timeEnd: allDay ? "" : timeEnd,
          location: location || "Secretaria / Coordenação",
          description: description || "",
          audience: "Professores e Funcionários",
          color: CP.config.categories[category]?.color || "#0d9488"
        };
      };

      return [
        makeEv(6, "prova", "Semana de Avaliações Bimestrais", "Salas de Aula", "Aplicação das avaliações formais do bimestre.", "07:30", "11:30"),
        makeEv(18, "trabalho", "Entrega do Projeto Interdisciplinar", "Secretaria Escolar", "Recebimento dos relatórios das turmas do Fundamental e Médio.", "08:00", "12:00"),
        makeEv(21, "conselho", "Reunião de Pais e Mestres", "Pátio e Salas de Aula", "Apresentação dos boletins e atendimento individual às famílias.", "18:00", "20:30"),
        makeEv(25, "feriado", "Recesso Escolar / Feriado Municipal", "—", "Sem expediente pedagógico presencial.", "", "", true),
        makeEv(lastDayOfMonth, "conselho", "Conselho de Classe e Fechamento Bimestral", "Sala dos Professores", "Análise do desempenho dos estudantes, fechamento de notas e deliberação de intervenções pedagógicas.", "13:30", "17:00")
      ];
    }
  },

  /* =========================================================
     ESTADO DA APLICAÇÃO
  ========================================================= */
  state: {
    events: [],
    view: "month", // "month" ou "year"
    refDate: new Date(),
    searchQuery: "",
    selectedBimester: "all", // "all", "jan", "1", "2", "3", "4"
    editingEventId: null,
    selectedEventId: null,
    selectedDay: null,
    selectedColor: "#dc2626",

    getFilteredEvents() {
      const q = this.searchQuery.trim().toLowerCase();
      if (!q) return this.events;

      return this.events.filter(ev => {
        const cat = CP.config.categories[ev.category];
        const haystack = (
          (ev.title || "") + " " +
          (cat?.label || "") + " " +
          (ev.location || "") + " " +
          (ev.description || "") + " " +
          (ev.audience || "")
        ).toLowerCase();
        return haystack.includes(q);
      });
    },

    getEventsOnDate(date, eventList = null) {
      const list = eventList || this.getFilteredEvents();
      const iso = CP.utils.toISO(date);

      return list.filter(ev => {
        const end = ev.dateEnd || ev.dateStart;
        return iso >= ev.dateStart && iso <= end;
      });
    }
  },

  /* =========================================================
     VISUALIZAÇÕES (MÊS / ANO)
  ========================================================= */
  views: {
    month: {
      render(container, eventsList) {
        const ref = CP.state.refDate;
        const year = ref.getFullYear();
        const month = ref.getMonth();

        const firstDay = new Date(year, month, 1);
        const gridStart = CP.utils.getStartOfWeek(firstDay);
        const today = new Date();
        const meta = CP.config.monthMeta[month] || { daysLetivos: 0, notes: "" };

        let html = `
          <div class="weekday-header-row">
            ${CP.config.weekdaysShort
              .map(day => `<div class="weekday-header-cell">${day}</div>`)
              .join("")}
          </div>
          <div class="month-grid">
        `;

        for (let i = 0; i < 42; i++) {
          const date = CP.utils.addDays(gridStart, i);
          const outside = date.getMonth() !== month;
          const isToday = CP.utils.isSameDay(date, today);
          const events = CP.state.getEventsOnDate(date, eventsList);
          const visible = events.slice(0, 3);
          const hidden = events.length - visible.length;
          const iso = CP.utils.toISO(date);

          html += `
            <div
              class="month-day-cell ${outside ? "outside-month" : ""} ${isToday ? "is-today" : ""}"
              data-date="${iso}"
              id="day-cell-${iso}"
            >
              <div class="month-day-header">
                <span class="day-number-badge">${date.getDate()}</span>
                <button
                  class="quick-add-btn"
                  data-action="quick-add"
                  data-date="${iso}"
                  title="Novo registro nesta data"
                >
                  +
                </button>
              </div>

              <div class="events-stack">
                ${visible.map(ev => this.renderEventChip(ev)).join("")}
                ${
                  hidden > 0
                    ? `<div class="more-events-indicator" data-action="view-day-events" data-date="${iso}">
                        +${hidden} mais
                       </div>`
                    : ""
                }
              </div>
            </div>
          `;
        }

        html += `</div>`;
        container.innerHTML = html;
      },

      renderEventChip(ev) {
        const cat = CP.config.categories[ev.category] || {
          label: "Evento",
          color: "#ea580c"
        };
        const color = ev.color || cat.color;

        return `
          <div
            class="event-chip-item"
            data-event-id="${ev.id}"
            style="border-left-color:${color};"
            title="${CP.utils.escapeHTML(ev.title)}"
          >
            <span class="truncate">${CP.utils.escapeHTML(ev.title)}</span>
          </div>
        `;
      }
    },

    year: {
      render(container, eventsList) {
        const year = CP.state.refDate.getFullYear();

        let html = `
          <div class="year-view">
            <div class="year-view-header">
              <h2 class="year-title">Calendário Escolar — ${year}</h2>
            </div>
            <div class="year-months-grid">
        `;

        for (let month = 0; month < 12; month++) {
          html += this.renderMiniMonth(year, month, eventsList);
        }

        html += `
            </div>
          </div>
        `;

        container.innerHTML = html;
      },

      renderMiniMonth(year, month, eventsList) {
        const first = new Date(year, month, 1);
        const start = CP.utils.getStartOfWeek(first);
        const today = new Date();

        let html = `
          <div class="mini-month" data-month="${month}">
            <div class="mini-month-header">
              ${CP.config.monthsFull[month]}
            </div>
            <div class="mini-weekdays">
              ${CP.config.weekdaysShort
                .map(day => `<span>${day.substring(0, 1)}</span>`)
                .join("")}
            </div>
            <div class="mini-days">
        `;

        for (let i = 0; i < 42; i++) {
          const date = CP.utils.addDays(start, i);

          if (date.getMonth() !== month) {
            html += `<div class="mini-day"></div>`;
            continue;
          }

          const events = CP.state.getEventsOnDate(date, eventsList);
          const isToday = CP.utils.isSameDay(date, today);

          let dotsHtml = "";
          let titleText = "";
          let bgStyle = "";

          if (events.length > 0) {
            titleText = events.map(e => e.title).join(" | ");
            // Se houver um evento prioritário (ex: feriado, férias, etc.), podemos colorir suavemente a célula ou renderizar dots
            const primaryEv = events[0];
            const cat = CP.config.categories[primaryEv.category] || { color: primaryEv.color || "#5c93c4" };
            const mainColor = primaryEv.color || cat.color;

            // Pontinhos coloridos para diferenciar as categorias dos eventos do dia
            const dots = events.slice(0, 3).map(ev => {
              const c = ev.color || CP.config.categories[ev.category]?.color || "#5c93c4";
              return `<span class="mini-day-dot" style="background-color:${c};"></span>`;
            }).join("");

            dotsHtml = `<div class="mini-day-dots-container">${dots}</div>`;
            if (!isToday) {
              bgStyle = `style="background: ${mainColor}18; color: ${mainColor}; font-weight: 800;"`;
            }
          }

          html += `
            <div
              class="mini-day ${events.length ? "has-events" : ""} ${isToday ? "is-today" : ""}"
              data-date="${CP.utils.toISO(date)}"
              title="${CP.utils.escapeHTML(titleText)}"
              ${bgStyle}
            >
              <span class="mini-day-number">${date.getDate()}</span>
              ${dotsHtml}
            </div>
          `;
        }

        html += `
            </div>
          </div>
        `;

        return html;
      }
    }
  },

  /* =========================================================
     LÓGICA PRINCIPAL (APP)
  ========================================================= */
  app: {
    async init() {
      CP.state.events = await CP.storage.loadEvents();
      // Inicia na data atual real
      const today = new Date();
      CP.state.refDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const currentBim = CP.utils.getBimesterForDate(today);
      CP.state.selectedBimester = currentBim ? String(currentBim.n) : "1";
      this.initTheme();
      this.initCategoriesLegend();
      this.initBimesterButtons();
      this.initCategoryForm();
      this.bindEvents();
      this.renderAll();
    },

    /* =======================================================
       TEMA
    ======================================================== */
    initTheme() {
      const saved = localStorage.getItem(CP.storage.THEME_KEY) || "light";
      document.documentElement.setAttribute("data-theme", saved);
      this.updateThemeButton(saved);
    },

    applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      try { localStorage.setItem(CP.storage.THEME_KEY, theme); } catch(e) {}
      this.updateThemeButton(theme);
    },

    updateThemeButton(theme) {
      const label = document.getElementById("themeToggleLabel");
      if (label) label.textContent = theme === "dark" ? "Modo Claro" : "Modo Escuro";
    },

    /* =======================================================
       LEGENDA DE CATEGORIAS (PARTE INFERIOR)
    ======================================================== */
    initCategoriesLegend() {
      const container = document.getElementById("calendarCategoriesLegend");
      if (!container) return;

      container.innerHTML = "";

      Object.entries(CP.config.categories).forEach(([key, meta]) => {
        const item = document.createElement("div");
        item.className = "legend-item";
        item.innerHTML = `
          <span class="legend-dot" style="background-color:${meta.color};"></span>
          <span>${meta.label}</span>
        `;
        container.appendChild(item);
      });
    },

    /* =======================================================
       BOTÕES DE NAVEGAÇÃO POR PERÍODO / BIMESTRE
    ======================================================== */
    initBimesterButtons() {
      const container = document.getElementById("bimesterButtonsContainer");
      if (!container) return;

      const today = new Date();
      const year = CP.state.refDate.getFullYear();
      const bimesters = CP.config.getBimesters(year);
      const currentBim = CP.utils.getBimesterForDate(today);
      const currentBimLabel = currentBim ? currentBim.label : "Recesso / Férias";

      container.innerHTML = `
        <!-- Botão 1: Atual (Hoje) -->
        <button
          type="button"
          class="bimester-btn ${CP.state.selectedBimester === "atual" ? "active" : ""}"
          data-bimester="atual"
          title="Ir para a data atual de hoje"
          id="bimBtn_atual"
        >
          <span>Atual (Hoje)</span>
          <span class="bim-dates">${currentBimLabel}</span>
        </button>

        <!-- Botão 2: 1º Bimestre -->
        <button
          type="button"
          class="bimester-btn ${CP.state.selectedBimester === "1" ? "active" : ""}"
          data-bimester="1"
          id="bimBtn_1"
        >
          <span>1º Bimestre</span>
          <span class="bim-dates">${CP.utils.formatDateShort(bimesters[0].start)} – ${CP.utils.formatDateShort(bimesters[0].end)}</span>
        </button>

        <!-- Botão 3: 2º Bimestre -->
        <button
          type="button"
          class="bimester-btn ${CP.state.selectedBimester === "2" ? "active" : ""}"
          data-bimester="2"
          id="bimBtn_2"
        >
          <span>2º Bimestre</span>
          <span class="bim-dates">${CP.utils.formatDateShort(bimesters[1].start)} – ${CP.utils.formatDateShort(bimesters[1].end)}</span>
        </button>

        <!-- Botão 4: 3º Bimestre -->
        <button
          type="button"
          class="bimester-btn ${CP.state.selectedBimester === "3" ? "active" : ""}"
          data-bimester="3"
          id="bimBtn_3"
        >
          <span>3º Bimestre</span>
          <span class="bim-dates">${CP.utils.formatDateShort(bimesters[2].start)} – ${CP.utils.formatDateShort(bimesters[2].end)}</span>
        </button>

        <!-- Botão 5: 4º Bimestre -->
        <button
          type="button"
          class="bimester-btn ${CP.state.selectedBimester === "4" ? "active" : ""}"
          data-bimester="4"
          id="bimBtn_4"
        >
          <span>4º Bimestre</span>
          <span class="bim-dates">${CP.utils.formatDateShort(bimesters[3].start)} – ${CP.utils.formatDateShort(bimesters[3].end)}</span>
        </button>
      `;

      container.querySelectorAll(".bimester-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const bim = btn.dataset.bimester;
          this.selectBimester(bim);
        });
      });
    },

    selectBimester(bim) {
      const year = CP.state.refDate.getFullYear();
      const bimesters = CP.config.getBimesters(year);

      if (bim === "atual") {
        CP.state.selectedBimester = "atual";
        const today = new Date();
        const currentBim = CP.utils.getBimesterForDate(today);
        CP.state.refDate = new Date(today);
        CP.state.view = "month";
        this.showToast(currentBim ? `Hoje: ${currentBim.label}` : "Exibindo data atual");
      } else {
        CP.state.selectedBimester = bim;
        const targetBim = bimesters.find(b => String(b.n) === String(bim));
        if (targetBim) {
          CP.state.refDate = new Date(targetBim.start);
          CP.state.view = "month";
          this.showToast(`Exibindo: ${targetBim.label}`);
        }
      }

      this.renderAll();

      if (bim === "atual") {
        setTimeout(() => this.scrollToToday(), 100);
      }
    },

    scrollToToday() {
      const todayISO = CP.utils.toISO(new Date());
      let el = document.getElementById(`day-cell-${todayISO}`);
      if (!el) {
        el = document.querySelector(`.month-day-cell.is-today, .mini-day.is-today`);
      }
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("today-pulse");
        setTimeout(() => el.classList.remove("today-pulse"), 2000);
      }
    },

    /* =======================================================
       FORMULÁRIO DE CATEGORIAS & PALETA
    ======================================================== */
    initCategoryForm() {
      const select = document.getElementById("form_category");
      if (!select) return;

      select.innerHTML = "";
      Object.entries(CP.config.categories).forEach(([key, meta]) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = meta.label;
        select.appendChild(option);
      });

      const palette = document.getElementById("form_colorSwatchesContainer");
      if (!palette) return;

      const colors = [
        "#dc2626", "#7c3aed", "#ec4899", "#16a34a",
        "#5c93c4", "#eab308", "#6b7280", "#ea580c"
      ];

      palette.innerHTML = "";
      colors.forEach(color => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "color-swatch" + (color === CP.state.selectedColor ? " selected" : "");
        button.style.background = color;
        button.dataset.color = color;

        button.addEventListener("click", () => {
          CP.state.selectedColor = color;
          palette.querySelectorAll(".color-swatch").forEach(el => {
            el.classList.toggle("selected", el === button);
          });
        });

        palette.appendChild(button);
      });
    },

    /* =======================================================
       EVENT LISTENERS GERAIS
    ======================================================== */
    bindEvents() {
      // Botão Flutuante (FAB)
      const fabBtn = document.getElementById("fabAddEventBtn");
      if (fabBtn) fabBtn.addEventListener("click", () => this.openEventForm());

      // Botão de Tema
      const themeBtn = document.getElementById("themeToggleBtn");
      if (themeBtn) {
        themeBtn.addEventListener("click", () => {
          const current = document.documentElement.getAttribute("data-theme") || "light";
          this.applyTheme(current === "dark" ? "light" : "dark");
        });
      }

      // Navegação de Mês
      const prevMonthBtn = document.getElementById("calendarPrevMonthBtn");
      if (prevMonthBtn) prevMonthBtn.addEventListener("click", () => this.navigateMonth(-1));

      const nextMonthBtn = document.getElementById("calendarNextMonthBtn");
      if (nextMonthBtn) nextMonthBtn.addEventListener("click", () => this.navigateMonth(1));

      // Seletor de Visão (Mês / Ano)
      const viewSwitcher = document.getElementById("calendarViewSwitcher");
      if (viewSwitcher) {
        viewSwitcher.querySelectorAll(".view-tab-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            CP.state.view = btn.dataset.view;
            this.renderAll();
          });
        });
      }

      // Ações dentro do Calendário
      const calContainer = document.getElementById("calendarActiveViewContainer");
      if (calContainer) {
        calContainer.addEventListener("click", e => {
          const chip = e.target.closest(".event-chip-item");
          if (chip) {
            e.stopPropagation();
            this.openEventDetails(chip.dataset.eventId);
            return;
          }

          const moreBtn = e.target.closest("[data-action='view-day-events']");
          if (moreBtn) {
            e.stopPropagation();
            this.openDayEventsModal(moreBtn.dataset.date);
            return;
          }

          // Clique na Visão Anual para ir para o Mês clicado
          const miniDay = e.target.closest(".mini-day[data-date]");
          const miniMonth = e.target.closest(".mini-month");

          if (CP.state.view === "year" && (miniDay || miniMonth)) {
            if (miniDay) {
              const d = CP.utils.parseISO(miniDay.dataset.date);
              if (d) CP.state.refDate = d;
            } else if (miniMonth) {
              const m = parseInt(miniMonth.dataset.month, 10);
              CP.state.refDate.setMonth(m);
            }
            CP.state.view = "month";

            // Sincroniza o bimestre com o mês clicado
            const targetBim = CP.utils.getBimesterForDate(CP.state.refDate);
            if (targetBim) {
              CP.state.selectedBimester = String(targetBim.n);
            } else {
              CP.state.selectedBimester = "atual";
            }

            this.renderAll();
            return;
          }
        });
      }

      // Salvar Formulário
      const saveBtn = document.getElementById("saveEventFormBtn");
      if (saveBtn) {
        saveBtn.addEventListener("click", () => this.saveEventFromForm());
      }

      // Excluir e Editar dos Detalhes
      const deleteBtn = document.getElementById("deleteFromDetailsBtn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          if (CP.state.selectedEventId) {
            this.deleteEvent(CP.state.selectedEventId);
            this.closeModal("eventDetailsModalOverlay");
          }
        });
      }

      const editBtn = document.getElementById("editFromDetailsBtn");
      if (editBtn) {
        editBtn.addEventListener("click", () => {
          const id = CP.state.selectedEventId;
          this.closeModal("eventDetailsModalOverlay");
          this.openEventForm(null, id);
        });
      }

      // Modal de Eventos do Dia — Adicionar
      const dayAddBtn = document.getElementById("dayEventsModalAddBtn");
      if (dayAddBtn) {
        dayAddBtn.addEventListener("click", () => {
          const date = CP.state.selectedDay;
          this.closeModal("dayEventsModalOverlay");
          this.openEventForm(date);
        });
      }

      // Fechar modais
      document.querySelectorAll("[data-close-modal]").forEach(btn => {
        btn.addEventListener("click", () => {
          const modal = btn.closest(".modal-overlay-backdrop");
          if (modal) modal.classList.remove("open");
        });
      });

      document.querySelectorAll(".modal-overlay-backdrop").forEach(modal => {
        modal.addEventListener("click", e => {
          if (e.target === modal) {
            modal.classList.remove("open");
          }
        });
      });

      // Busca por texto
      const searchInput = document.getElementById("mainSearchInput");
      if (searchInput) {
        searchInput.addEventListener("input", () => {
          CP.state.searchQuery = searchInput.value;
          this.renderAll();
        });
      }

      // Botão de Backup / Impressão no Topo
      const topSettingsBtn = document.getElementById("topSettingsBtn");
      if (topSettingsBtn) topSettingsBtn.addEventListener("click", () => this.openSettingsModal());

      // Ações do Modal de Backup
      const exportBtn = document.getElementById("exportDataBtn");
      if (exportBtn) exportBtn.addEventListener("click", () => this.exportData());

      const importInput = document.getElementById("importDataInput");
      if (importInput) importInput.addEventListener("change", e => this.importData(e));

      const printBtn = document.getElementById("printCalendarBtn");
      if (printBtn) printBtn.addEventListener("click", () => this.printCalendar());

      const resetBtn = document.getElementById("resetDataBtn");
      if (resetBtn) resetBtn.addEventListener("click", () => this.resetData());

      // Checkbox "Dia inteiro"
      const allDayCheck = document.getElementById("form_allDay");
      if (allDayCheck) {
        allDayCheck.addEventListener("change", () => {
          const timeGroup = document.getElementById("timeInputsGroup");
          if (timeGroup) {
            timeGroup.style.display = allDayCheck.checked ? "none" : "grid";
          }
        });
      }
    },

    /* =======================================================
       NAVEGAÇÃO
    ======================================================== */
    navigateMonth(delta) {
      if (CP.state.view === "year") {
        CP.state.refDate.setFullYear(CP.state.refDate.getFullYear() + delta);
      } else {
        CP.state.refDate.setMonth(CP.state.refDate.getMonth() + delta);
        const bim = CP.utils.getBimesterForDate(CP.state.refDate);
        CP.state.selectedBimester = bim ? String(bim.n) : "atual";
      }
      this.renderAll();
    },

    goToToday() {
      CP.state.refDate = new Date();
      CP.state.view = "month";
      const bim = CP.utils.getBimesterForDate(CP.state.refDate);
      CP.state.selectedBimester = bim ? String(bim.n) : "atual";
      this.renderAll();
      this.scrollToToday();
    },

    /* =======================================================
       RENDERIZAÇÃO GERAL
    ======================================================== */
    renderAll() {
      this.updateNavigationControls();
      this.updateBimesterButtonsUI();

      const container = document.getElementById("calendarActiveViewContainer");
      if (!container) return;

      const filteredEvents = CP.state.getFilteredEvents();

      if (CP.state.view === "year") {
        CP.views.year.render(container, filteredEvents);
      } else {
        CP.views.month.render(container, filteredEvents);
      }

      this.updateSidePanel();
    },

    updateNavigationControls() {
      const ref = CP.state.refDate;
      const monthIdx = ref.getMonth();
      const year = ref.getFullYear();

      const monthName = CP.config.monthsFull[monthIdx];
      const prevMonthIdx = (monthIdx + 11) % 12;
      const nextMonthIdx = (monthIdx + 1) % 12;

      const titleEl = document.getElementById("currentPeriodTitle");
      if (titleEl) {
        titleEl.textContent = CP.state.view === "year" ? `Ano ${year}` : monthName;
      }

      const yearBadge = document.getElementById("currentPeriodYearBadge");
      if (yearBadge) {
        yearBadge.textContent = String(year);
      }

      const prevBtnLabel = document.getElementById("calendarPrevMonthLabel");
      if (prevBtnLabel) {
        prevBtnLabel.textContent = CP.state.view === "year" ? "Ano Anterior" : CP.config.monthsShort[prevMonthIdx];
      }

      const nextBtnLabel = document.getElementById("calendarNextMonthLabel");
      if (nextBtnLabel) {
        nextBtnLabel.textContent = CP.state.view === "year" ? "Próximo Ano" : CP.config.monthsShort[nextMonthIdx];
      }

      // Sincroniza abas de visualização (Mês / Ano)
      const viewSwitcher = document.getElementById("calendarViewSwitcher");
      if (viewSwitcher) {
        viewSwitcher.querySelectorAll(".view-tab-btn").forEach(btn => {
          btn.classList.toggle("active", btn.dataset.view === CP.state.view);
        });
      }
    },

    updateBimesterButtonsUI() {
      const container = document.getElementById("bimesterButtonsContainer");
      if (!container) return;

      container.querySelectorAll(".bimester-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.bimester === CP.state.selectedBimester);
      });
    },

    /* =======================================================
       PAINEL LATERAL: ANDAMENTO & PRAZOS DA COORDENAÇÃO
    ======================================================== */
    updateSidePanel() {
      const today = new Date();
      const year = today.getFullYear();
      const bimesters = CP.config.getBimesters(year);
      const allEvents = CP.state.events;

      // 1. Andamento do Ano Letivo
      const progressContainer = document.getElementById("bimesterProgressContainer");
      if (progressContainer) {
        const todayTime = today.getTime();
        let progressHTML = `<div class="panel-content">`;

        bimesters.forEach(b => {
          const startTime = b.start.getTime();
          const endTime = b.end.getTime();
          let pct = 0;
          let statusText = "";

          if (todayTime < startTime) {
            pct = 0;
            statusText = "A iniciar";
          } else if (todayTime > endTime) {
            pct = 100;
            statusText = "Concluído";
          } else {
            const total = endTime - startTime;
            const current = todayTime - startTime;
            pct = Math.min(Math.max(Math.round((current / total) * 100), 0), 100);
            statusText = `${pct}% concluído`;
          }

          progressHTML += `
            <div class="progress-item">
              <div class="progress-top">
                <strong>${b.label}</strong>
                <span>${statusText}</span>
              </div>
              <div class="progress-track">
                <div class="progress-bar" style="width:${pct}%;"></div>
              </div>
            </div>
          `;
        });

        progressHTML += `</div>`;
        progressContainer.innerHTML = progressHTML;
      }

      // 2. Próximos Compromissos (Baseado rigorosamente no dia atual)
      const deadlinesContainer = document.getElementById("coordinationDeadlinesListContainer");
      if (deadlinesContainer) {
        const todayISO = CP.utils.toISO(today);
        const upcoming = allEvents
          .filter(ev => ev.category !== "letivo" && (ev.dateEnd || ev.dateStart) >= todayISO)
          .sort((a, b) => a.dateStart.localeCompare(b.dateStart))
          .slice(0, 10);

        if (upcoming.length === 0) {
          deadlinesContainer.innerHTML = `<div class="empty-state">Nenhum compromisso agendado a partir de hoje.</div>`;
        } else {
          let html = "";
          upcoming.forEach(ev => {
            const cat = CP.config.categories[ev.category] || { label: "Evento", color: "#5c93c4" };
            const isToday = ev.dateStart <= todayISO && (ev.dateEnd || ev.dateStart) >= todayISO;
            const badge = isToday ? `<span class="deadline-live-chip">Hoje</span>` : "";

            html += `
              <div class="deadline-item" data-event-id="${ev.id}" style="border-left: 4px solid ${ev.color || cat.color};">
                <div class="deadline-title-row">
                  <span class="deadline-title">${CP.utils.escapeHTML(ev.title)}</span>
                  ${badge}
                </div>
                <div class="deadline-meta">
                  <span style="color:${ev.color || cat.color}; font-weight:700;">${cat.label}</span>
                  <span>•</span>
                  <span>${CP.utils.formatDeadlineDate(ev)}</span>
                </div>
              </div>
            `;
          });
          deadlinesContainer.innerHTML = html;

          deadlinesContainer.querySelectorAll(".deadline-item").forEach(item => {
            item.addEventListener("click", () => this.openEventDetails(item.dataset.eventId));
          });
        }
      }
    },

    /* =======================================================
       FORMULÁRIO DE EVENTO
    ======================================================== */
    openEventForm(presetDate = null, eventId = null) {
      CP.state.editingEventId = eventId;
      const modal = document.getElementById("eventFormModalOverlay");
      const titleEl = document.getElementById("eventFormModalTitle");
      const timeGroup = document.getElementById("timeInputsGroup");

      if (eventId) {
        const ev = CP.state.events.find(e => e.id === eventId);
        if (!ev) return;

        if (titleEl) titleEl.textContent = "Editar Registro Pedagógico";

        document.getElementById("form_title").value = ev.title || "";
        document.getElementById("form_category").value = ev.category || "coordenacao";
        document.getElementById("form_dateStart").value = ev.dateStart || "";
        document.getElementById("form_dateEnd").value = ev.dateEnd || ev.dateStart || "";
        document.getElementById("form_allDay").checked = !!ev.allDay;
        document.getElementById("form_timeStart").value = ev.timeStart || "08:00";
        document.getElementById("form_timeEnd").value = ev.timeEnd || "09:00";
        document.getElementById("form_location").value = ev.location || "";
        document.getElementById("form_audience").value = ev.audience || "Todos os Professores";
        document.getElementById("form_description").value = ev.description || "";

        CP.state.selectedColor = ev.color || CP.config.categories[ev.category]?.color || "#ea580c";

        if (timeGroup) {
          timeGroup.style.display = ev.allDay ? "none" : "grid";
        }
      } else {
        if (titleEl) titleEl.textContent = "Novo Registro Pedagógico";

        const defaultDate = presetDate || CP.utils.toISO(new Date());

        document.getElementById("form_title").value = "";
        document.getElementById("form_category").value = "coordenacao";
        document.getElementById("form_dateStart").value = defaultDate;
        document.getElementById("form_dateEnd").value = defaultDate;
        document.getElementById("form_allDay").checked = false;
        document.getElementById("form_timeStart").value = "08:00";
        document.getElementById("form_timeEnd").value = "09:40";
        document.getElementById("form_location").value = "Secretaria / Coordenação";
        document.getElementById("form_audience").value = "Professores e Funcionários";
        document.getElementById("form_description").value = "";

        CP.state.selectedColor = CP.config.categories.coordenacao.color;

        if (timeGroup) {
          timeGroup.style.display = "grid";
        }
      }

      const palette = document.getElementById("form_colorSwatchesContainer");
      if (palette) {
        palette.querySelectorAll(".color-swatch").forEach(el => {
          el.classList.toggle("selected", el.dataset.color === CP.state.selectedColor);
        });
      }

      if (modal) modal.classList.add("open");
    },

    saveEventFromForm() {
      const title = document.getElementById("form_title").value.trim();
      const category = document.getElementById("form_category").value;
      const dateStart = document.getElementById("form_dateStart").value;
      const dateEnd = document.getElementById("form_dateEnd").value || dateStart;
      const allDay = document.getElementById("form_allDay").checked;
      const timeStart = allDay ? "" : document.getElementById("form_timeStart").value;
      const timeEnd = allDay ? "" : document.getElementById("form_timeEnd").value;
      const location = document.getElementById("form_location").value.trim();
      const audience = document.getElementById("form_audience").value.trim();
      const description = document.getElementById("form_description").value.trim();
      const color = CP.state.selectedColor;

      if (!title) {
        alert("Por favor, preencha o título do evento.");
        document.getElementById("form_title").focus();
        return;
      }

      if (!dateStart) {
        alert("Por favor, informe a data de início.");
        return;
      }

      if (CP.state.editingEventId) {
        const idx = CP.state.events.findIndex(e => e.id === CP.state.editingEventId);
        if (idx !== -1) {
          CP.state.events[idx] = {
            ...CP.state.events[idx],
            title,
            category,
            dateStart,
            dateEnd,
            allDay,
            timeStart,
            timeEnd,
            location,
            audience,
            description,
            color
          };
          this.showToast("Informações atualizadas com sucesso");
        }
      } else {
        const newEvent = {
          id: CP.utils.generateUID(),
          title,
          category,
          dateStart,
          dateEnd,
          allDay,
          timeStart,
          timeEnd,
          location,
          audience,
          description,
          color
        };
        CP.state.events.push(newEvent);
        this.showToast("Registro adicionado ao calendário");
      }

      CP.storage.saveEvents(CP.state.events);
      this.closeModal("eventFormModalOverlay");
      this.renderAll();
    },

    /* =======================================================
       DETALHES DO EVENTO
    ======================================================== */
    openEventDetails(eventId) {
      const ev = CP.state.events.find(e => e.id === eventId);
      if (!ev) return;

      CP.state.selectedEventId = eventId;
      const modal = document.getElementById("eventDetailsModalOverlay");
      const content = document.getElementById("eventDetailsModalContent");

      const cat = CP.config.categories[ev.category] || {
        label: "Registro Geral",
        color: "#ea580c"
      };

      if (content) {
        content.innerHTML = `
          <div class="details-grid">
            <div class="detail-row">
              <div class="detail-icon-box" style="background-color:${ev.color || cat.color};"></div>
              <div>
                <div class="detail-label">Título do Compromisso</div>
                <div class="detail-value" style="font-size:16px; font-weight:800;">${CP.utils.escapeHTML(ev.title)}</div>
              </div>
            </div>

            <div class="detail-row">
              <div>
                <div class="detail-label">Categoria</div>
                <div class="detail-value">${cat.label}</div>
              </div>
            </div>

            <div class="detail-row">
              <div>
                <div class="detail-label">Data e Horário</div>
                <div class="detail-value">${CP.utils.formatEventDate(ev)}</div>
              </div>
            </div>

            ${
              ev.location
                ? `
                  <div class="detail-row">
                    <div>
                      <div class="detail-label">Local</div>
                      <div class="detail-value">${CP.utils.escapeHTML(ev.location)}</div>
                    </div>
                  </div>
                `
                : ""
            }

            ${
              ev.audience
                ? `
                  <div class="detail-row">
                    <div>
                      <div class="detail-label">Público Envolvido</div>
                      <div class="detail-value">${CP.utils.escapeHTML(ev.audience)}</div>
                    </div>
                  </div>
                `
                : ""
            }

            ${
              ev.description
                ? `
                  <div class="detail-row">
                    <div style="flex:1;">
                      <div class="detail-label">Observações e Orientações</div>
                      <div class="detail-description">${CP.utils.escapeHTML(ev.description)}</div>
                    </div>
                  </div>
                `
                : ""
            }
          </div>
        `;
      }

      if (modal) modal.classList.add("open");
    },

    deleteEvent(eventId) {
      if (!confirm("Deseja realmente remover este registro do calendário?")) {
        return;
      }

      CP.state.events = CP.state.events.filter(e => e.id !== eventId);
      CP.storage.saveEvents(CP.state.events);
      this.showToast("Registro removido");
      this.renderAll();
    },

    /* =======================================================
       MODAL DE EVENTOS DO DIA
    ======================================================== */
    openDayEventsModal(dateStr) {
      CP.state.selectedDay = dateStr;
      const date = CP.utils.parseISO(dateStr);
      const modal = document.getElementById("dayEventsModalOverlay");
      const titleEl = document.getElementById("dayEventsModalTitle");
      const content = document.getElementById("dayEventsModalContent");

      if (titleEl) {
        titleEl.textContent = `Compromissos de ${CP.utils.formatDate(date)}`;
      }

      const events = CP.state.getEventsOnDate(date);

      if (content) {
        if (events.length === 0) {
          content.innerHTML = `<div class="empty-state">Nenhum evento registrado nesta data.</div>`;
        } else {
          let html = `<div style="display:flex; flex-direction:column; gap:8px;">`;
          events.forEach(ev => {
            const cat = CP.config.categories[ev.category] || { label: "Evento" };
            html += `
              <div
                class="deadline-item"
                data-event-id="${ev.id}"
                style="border-radius:6px; border:1px solid var(--border-color); background:var(--bg-subtle);"
              >
                <div class="deadline-title">${CP.utils.escapeHTML(ev.title)}</div>
                <div class="deadline-meta">
                  <span class="deadline-tag">${cat.label}</span>
                  <span>${CP.utils.formatEventDate(ev)}</span>
                </div>
              </div>
            `;
          });
          html += `</div>`;
          content.innerHTML = html;

          content.querySelectorAll(".deadline-item").forEach(item => {
            item.addEventListener("click", () => {
              this.closeModal("dayEventsModalOverlay");
              this.openEventDetails(item.dataset.eventId);
            });
          });
        }
      }

      if (modal) modal.classList.add("open");
    },

    /* =======================================================
       BACKUP & IMPRESSÃO
    ======================================================== */
    openSettingsModal() {
      const modal = document.getElementById("settingsModalOverlay");
      if (modal) modal.classList.add("open");
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove("open");
    },

    exportData() {
      const dataStr = JSON.stringify(CP.state.events, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `calendario_pedagogico_${CP.utils.toISO(new Date())}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showToast("Cópia de segurança exportada");
    },

    importData(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (Array.isArray(parsed)) {
            CP.state.events = parsed;
            CP.storage.saveEvents(parsed);
            this.renderAll();
            this.closeModal("settingsModalOverlay");
            this.showToast("Dados restaurados com sucesso");
          } else {
            alert("O arquivo selecionado não contém um formato de dados válido.");
          }
        } catch (err) {
          alert("Erro ao ler o arquivo JSON: " + err.message);
        }
      };
      reader.readAsText(file);
    },

    resetData() {
      if (confirm("Deseja substituir todos os dados pelos exemplos padrão da escola?")) {
        CP.state.events = CP.storage.generateSampleEvents();
        CP.storage.saveEvents(CP.state.events);
        this.renderAll();
        this.closeModal("settingsModalOverlay");
        this.showToast("Dados de exemplo restaurados");
      }
    },

    printCalendar() {
      window.print();
    },

    showToast(message) {
      const toast = document.getElementById("appToastNotification");
      if (!toast) return;

      toast.textContent = message;
      toast.classList.add("show");

      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    }
  }
};

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  CP.app.init();
});
