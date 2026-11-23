/* ============================================================
   繪畫歷程教學儀表板 · main.js
   資料驅動原型：視角切換 / 學生切換 / 熱力圖 / SVG 折線圖 /
   階段紀錄 / 教師註記 / 學生補充 / JSON 匯出 / 設計稿燈箱
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- 模擬資料 ---------------- */
  var SESSIONS = ["第1次", "第2次", "第3次", "第4次"];
  var ORDER = ["A", "B", "C", "D"];

  var DATA = {
    A: {
      name: "學生A", alert: false, help: 2,
      heat: [0.42, 0.36, 0.30, 0.26],
      edit: [1.1, 1.0, 0.95, 0.85],
      pause: [18, 14, 14, 13],
      title: "學生A：線稿到上色・結構規劃清晰",
      self: "我先確定比例再上色，中間改了幾次線條，但大致照計畫走。",
      reply: "結構規劃清楚，可作為同儕示例。",
      stages: [
        { art: "ox", name: "圖1 線稿", desc: "先框出主體比例" },
        { art: "blocks", name: "圖2 上色完成", desc: "分區塊鋪色後收尾" }
      ],
      events: [
        { t: "14:00", text: "開始線稿・先框出主體比例關係", dot: "teal" },
        { t: "14:12", text: "完成主要輪廓（圖1）", dot: "teal" },
        { t: "14:20", text: "進入上色・依區塊順序鋪色", dot: "teal" },
        { t: "15:05", text: "完成全圖（圖2）", dot: "teal" }
      ],
      defaultNote: "例如：學生A先框比例後分區上色，歷程穩定，可請其分享規劃方式。"
    },
    B: {
      name: "學生B", alert: true, help: 5,
      heat: [0.39, 0.46, 0.72, 0.63],
      edit: [0.8, 0.9, 1.7, 1.4],
      pause: [18, 22, 38, 33],
      title: "學生B：單色鋪墊後才補背景細節",
      self: "我不太確定明暗要怎麼分，所以先全部塗一個顏色看看。",
      reply: "單色處理時間較長，建議下次先示範明暗分層。",
      stages: [
        { art: "ox", name: "圖3 線稿", desc: "輪廓完成" },
        { art: "blocks", name: "圖4 單色鋪墊＋背景", desc: "單色處理後補背景" }
      ],
      events: [
        { t: "14:00", text: "開始線稿（圖3）", dot: "teal" },
        { t: "14:25", text: "單色鋪墊・停留約 6 分 40 秒未操作", dot: "orange" },
        { t: "14:52", text: "開始補背景細節（圖4）", dot: "teal" },
        { t: "15:20", text: "完成", dot: "teal" }
      ],
      defaultNote: "例如：學生B單色鋪墊停留約 6 分 40 秒，下次可先示範明暗分層。"
    },
    C: {
      name: "學生C", alert: false, help: 4,
      heat: [0.64, 0.54, 0.43, 0.30],
      edit: [1.3, 1.2, 1.0, 0.9],
      pause: [28, 23, 22, 19],
      title: "學生C：局部上色策略（先樹與裙子）",
      self: "我習慣一次只畫一個東西，全部畫完才換下一個。",
      reply: "局部上色時可先確認下一步順序，避免單區停留過久。",
      stages: [
        { art: "blocks", name: "圖5 局部：聖誕樹", desc: "先處理單一物件" },
        { art: "blocks", name: "圖6 局部：裙子", desc: "局部上色停留較久" },
        { art: "ox", name: "圖7 全圖完成", desc: "最後補齊其他區域" }
      ],
      events: [
        { t: "14:00", text: "開始線稿", dot: "teal" },
        { t: "14:18", text: "先畫聖誕樹（圖5）", dot: "teal" },
        { t: "14:40", text: "局部上色：裙子（圖6）・該區域停頓偏長", dot: "orange" },
        { t: "15:10", text: "補齊其他區域・完成（圖7）", dot: "teal" }
      ],
      defaultNote: "例如：學生C採局部上色策略，裙子區域停頓偏長，可先討論下一步順序。"
    },
    D: {
      name: "學生D", alert: true, help: 9,
      heat: [0.43, 0.90, 1.00, 0.67],
      edit: [1.5, 2.2, 2.5, 1.8],
      pause: [22, 34, 38, 34],
      title: "學生D：線稿階段出現線條加粗與細節追加",
      self: "窗框一直看起來歪歪的，我改了好幾次，後來想說加粗線條可能會好一點。",
      reply: "下次課前先確認是否卡在透視判斷，再決定是否介入。",
      stages: [
        { art: "ox", name: "圖8 線稿", desc: "初稿輪廓" },
        { art: "window", name: "圖9 加粗與補細節", desc: "窗框反覆修改" },
        { art: "blocks", name: "圖10 完成圖", desc: "最終完成" }
      ],
      events: [
        { t: "14:02", text: "開始線稿（圖8）", dot: "teal" },
        { t: "14:18", text: "窗框區域擦除 / 重畫 3 次", dot: "orange" },
        { t: "14:26", text: "停頓 4 分 12 秒未操作", dot: "orange" },
        { t: "14:31", text: "線條加粗・追加細節（圖9）", dot: "teal" }
      ],
      defaultNote: "例如：學生D在窗框區域反覆修改，下次課前先確認是否卡在透視判斷。"
    }
  };

  var DESIGNS = [
    { file: "teacher-a.jpg", label: "教師視角 · 學生A" },
    { file: "teacher-b.jpg", label: "教師視角 · 學生B" },
    { file: "teacher-c.jpg", label: "教師視角 · 學生C" },
    { file: "teacher-d.jpg", label: "教師視角 · 學生D" },
    { file: "student-a.jpg", label: "學生視角 · 學生A" },
    { file: "student-b.jpg", label: "學生視角 · 學生B" },
    { file: "student-c.jpg", label: "學生視角 · 學生C" },
    { file: "student-d.jpg", label: "學生視角 · 學生D" }
  ];

  var state = { view: "teacher", student: "A", session: 0, stage: 0 };
  var NOTE_KEY = "dpd-notes-v1";
  var SUP_KEY = "dpd-supplements-v1";

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function avg(arr) { return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length; }

  /* 本機儲存（file:// 或隱私模式下容錯） */
  var store = {
    get: function (key, fallback) {
      try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set: function (key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); return true; }
      catch (e) { return false; }
    }
  };

  function toast(msg) {
    var el = $("toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { el.classList.remove("is-visible"); }, 2400);
  }

  /* ---------------- 側欄學生列表 ---------------- */
  function renderSidebar() {
    $("studentList").innerHTML = ORDER.map(function (id) {
      var s = DATA[id];
      return '<li><button class="student-item' + (state.student === id ? " is-active" : "") +
        '" data-student="' + id + '" aria-pressed="' + (state.student === id) + '">' +
        '<span class="dot dot-' + (s.alert ? "orange" : "teal") + '"></span>' +
        esc(s.name) + '</button></li>';
    }).join("");
  }

  /* ---------------- 熱力圖 ---------------- */
  function mixColor(t) {
    var a = [226, 239, 235], b = [13, 87, 80]; /* 薄荷 → 深墨綠 */
    var c = a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); });
    return "rgb(" + c.join(",") + ")";
  }

  function renderHeatmap() {
    var html = '<table class="heat-table"><thead><tr><th></th>' +
      SESSIONS.map(function (s) { return "<th>" + s + "</th>"; }).join("") +
      "</tr></thead><tbody>";
    ORDER.forEach(function (id) {
      var s = DATA[id];
      html += '<tr class="' + (state.student === id ? "heat-row-active" : "") + '">' +
        '<td class="heat-row-label">' + esc(s.name) + "</td>";
      s.heat.forEach(function (v, i) {
        var t = Math.max(0, Math.min(1, (v - 0.26) / 0.74));
        var bg = mixColor(t);
        var color = t > 0.55 ? "#ffffff" : "#27423e";
        var active = state.student === id && state.session === i;
        html += '<td><div class="heat-cell' + (active ? " is-active" : "") +
          '" tabindex="0" role="button" data-student="' + id + '" data-session="' + i +
          '" style="background:' + bg + ';color:' + color + '" ' +
          'title="' + esc(s.name) + " " + SESSIONS[i] + "：" + v.toFixed(2) + '">' +
          v.toFixed(2) + "</div></td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table>";
    $("heatmap").innerHTML = html;
  }

  /* ---------------- 折線圖（原生 SVG） ---------------- */
  function niceBounds(values) {
    var lo = Math.min.apply(null, values), hi = Math.max.apply(null, values);
    var pad = Math.max((hi - lo) * 0.35, 0.4);
    var min = Math.max(0, Math.floor((lo - pad) * 10) / 10);
    var max = Math.ceil((hi + pad) * 10) / 10;
    if (max <= min) max = min + 1;
    return { min: min, max: max };
  }

  function drawChart(container, values, color, unit) {
    var b = niceBounds(values);
    var X0 = 36, X1 = 228, Y0 = 12, Y1 = 104;
    var xs = values.map(function (_, i) { return X0 + (X1 - X0) * i / (values.length - 1); });
    var ys = values.map(function (v) { return Y1 - (v - b.min) / (b.max - b.min) * (Y1 - Y0); });
    var fmt = function (v) { return (Math.round(v * 10) / 10).toFixed(1); };

    var svg = '<svg viewBox="0 0 240 140" role="img" aria-label="折線圖">';
    [Y0, (Y0 + Y1) / 2, Y1].forEach(function (y, i) {
      var label = fmt(b.max - (b.max - b.min) * i / 2);
      svg += '<line class="grid-line" x1="' + X0 + '" y1="' + y + '" x2="' + X1 + '" y2="' + y + '"/>';
      svg += '<text class="axis-text" x="2" y="' + (y + 3) + '">' + label + "</text>";
    });
    xs.forEach(function (x, i) {
      svg += '<text class="axis-text" x="' + (x - 10) + '" y="126">' + SESSIONS[i] + "</text>";
    });
    svg += '<polyline class="line-path" stroke="' + color + '" points="' +
      xs.map(function (x, i) { return x + "," + ys[i]; }).join(" ") + '"/>';
    xs.forEach(function (x, i) {
      svg += '<circle class="pt' + (state.session === i ? " is-active" : "") + '" cx="' + x +
        '" cy="' + ys[i] + '" r="' + (state.session === i ? 5 : 3.2) +
        '" fill="' + color + '" data-session="' + i + '" data-value="' + values[i] + '"/>';
    });
    svg += "</svg>";

    container.innerHTML = svg + '<div class="chart-tooltip"></div>';
    var tip = container.querySelector(".chart-tooltip");
    container.querySelectorAll(".pt").forEach(function (pt) {
      var i = +pt.getAttribute("data-session");
      function show() {
        tip.textContent = SESSIONS[i] + "：" + fmt(+pt.getAttribute("data-value")) + unit;
        tip.style.left = (xs[i] / 240 * 100) + "%";
        tip.style.top = (ys[i] / 140 * 100) + "%";
        tip.classList.add("is-visible");
      }
      pt.addEventListener("mouseenter", show);
      pt.addEventListener("focus", show);
      pt.addEventListener("mouseleave", function () { tip.classList.remove("is-visible"); });
      pt.addEventListener("blur", function () { tip.classList.remove("is-visible"); });
      pt.addEventListener("click", function () {
        state.session = i;
        renderDynamic();
      });
    });
  }

  function renderCharts() {
    var s = DATA[state.student];
    drawChart($("chartEditTeacher"), s.edit, "#177e77", " 次/分");
    drawChart($("chartPauseTeacher"), s.pause, "#c1693a", "%");
    drawChart($("chartEditStudent"), s.edit, "#177e77", " 次/分");
    drawChart($("chartPauseStudent"), s.pause, "#c1693a", "%");
  }

  /* ---------------- 階段縮圖（SVG 示意畫作） ---------------- */
  function artwork(kind) {
    if (kind === "ox") {
      return '<svg viewBox="0 0 88 66"><circle cx="28" cy="30" r="17" fill="none" stroke="#a9b9cd" stroke-width="2.4"/>' +
        '<path d="M50 15L76 47M76 15L50 47" stroke="#a9b9cd" stroke-width="2.4" stroke-linecap="round"/>' +
        '<line x1="14" y1="55" x2="76" y2="55" stroke="#d7e0e6" stroke-width="1.5"/></svg>';
    }
    if (kind === "window") {
      return '<svg viewBox="0 0 88 66"><rect x="14" y="12" width="56" height="42" rx="3" fill="none" stroke="#c1693a" stroke-width="3"/>' +
        '<path d="M22 24h40M22 33h40M22 42h28" stroke="#c1693a" stroke-width="2"/>' +
        '<circle cx="66" cy="51" r="9" fill="none" stroke="#7f9bb4" stroke-width="2.4"/></svg>';
    }
    return '<svg viewBox="0 0 88 66"><rect x="10" y="18" width="30" height="34" rx="2" fill="#c4d3ec"/>' +
      '<circle cx="58" cy="35" r="17" fill="#e6c48d"/>' +
      '<line x1="8" y1="55" x2="76" y2="55" stroke="#c9d4d0" stroke-width="2"/></svg>';
  }

  function renderStages() {
    var s = DATA[state.student];
    var thumbs = s.stages.map(function (st, i) {
      return '<button class="stage-thumb' + (state.stage === i ? " is-active" : "") +
        '" data-stage="' + i + '"><div class="stage-art">' + artwork(st.art) + "</div>" +
        '<div class="stage-name">' + esc(st.name) + "</div>" +
        '<div class="stage-desc">' + esc(st.desc) + "</div></button>";
    }).join("");
    $("stageThumbsTeacher").innerHTML = thumbs;
    $("stageThumbsStudent").innerHTML = thumbs;

    $("timelineTeacher").innerHTML = s.events.map(function (ev) {
      return '<li><span class="tl-dot dot-' + ev.dot + '"></span>' +
        '<span class="tl-time">' + ev.t + "</span>" +
        '<span class="tl-text">' + esc(ev.text) + "</span></li>";
    }).join("");
  }

  /* ---------------- 學生視角文字與數值 ---------------- */
  function renderStudentView() {
    var s = DATA[state.student];
    $("summaryTitle").textContent = s.title;
    $("trajTitleTeacher").textContent = s.name + " － 一個人行為軌跡（4 次課堂）";
    $("selfText").textContent = s.self;
    $("teacherReply").textContent = s.reply;

    var stats = [
      { v: avg(s.edit).toFixed(1), l: "平均修改率（次/分）" },
      { v: avg(s.pause).toFixed(1) + "%", l: "平均停頓比例" },
      { v: s.help, l: "求助次數" }
    ];
    $("summaryStats").innerHTML = stats.map(function (x) {
      return '<div class="stat"><span class="stat-value">' + x.v + "</span>" +
        '<span class="stat-label">' + x.l + "</span></div>";
    }).join("");
  }

  /* ---------------- 學生補充說明 ---------------- */
  function getSupplements() {
    var all = store.get(SUP_KEY, {});
    return all[state.student] || [];
  }

  function renderSupplements() {
    var list = getSupplements();
    $("supplementList").innerHTML = list.length ? list.map(function (item, i) {
      return '<div class="supplement-item"><time>' + esc(item.time) + "</time>" +
        esc(item.text) + ' <button class="del-sup" data-index="' + i +
        '" title="刪除" style="float:right;border:none;background:none;color:#7c8b89;cursor:pointer">×</button></div>';
    }).join("") : "";
  }

  /* ---------------- 教師註記 ---------------- */
  function getNotes() { return store.get(NOTE_KEY, {}); }

  function loadNote(id) {
    var notes = getNotes();
    $("noteStudent").value = id;
    $("noteText").value = notes[id] || DATA[id].defaultNote;
    $("noteSavedHint").textContent = notes[id] ? "已有儲存的註記（本機瀏覽器）" : "";
  }

  /* ---------------- 視角切換 ---------------- */
  function setView(view) {
    state.view = view;
    $("viewTeacher").hidden = view !== "teacher";
    $("viewStudent").hidden = view !== "student";
    $("viewSwitch").querySelectorAll("button").forEach(function (btn) {
      var on = btn.getAttribute("data-view") === view;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  /* ---------------- 統一渲染 ---------------- */
  function renderDynamic() {
    renderSidebar();
    renderHeatmap();
    renderCharts();
    renderStages();
    renderStudentView();
    renderSupplements();
  }

  function setStudent(id) {
    state.student = id;
    state.session = 0;
    state.stage = 0;
    renderDynamic();
    loadNote(id);
  }

  /* ---------------- 事件綁定 ---------------- */
  $("viewSwitch").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-view]");
    if (btn) setView(btn.getAttribute("data-view"));
  });

  $("studentList").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-student]");
    if (btn) setStudent(btn.getAttribute("data-student"));
  });

  function bindHeat(containerId) {
    var el = $(containerId);
    el.addEventListener("click", function (e) {
      var cell = e.target.closest(".heat-cell");
      if (!cell) return;
      state.student = cell.getAttribute("data-student");
      state.session = +cell.getAttribute("data-session");
      state.stage = 0;
      renderDynamic();
      loadNote(state.student);
    });
    el.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("heat-cell")) {
        e.preventDefault();
        e.target.click();
      }
    });
  }
  bindHeat("heatmap");

  ["stageThumbsTeacher", "stageThumbsStudent"].forEach(function (id) {
    $(id).addEventListener("click", function (e) {
      var btn = e.target.closest("[data-stage]");
      if (!btn) return;
      state.stage = +btn.getAttribute("data-stage");
      renderStages();
    });
  });

  /* 教師註記 */
  $("noteStudent").addEventListener("change", function () {
    loadNote(this.value);
  });
  $("saveNote").addEventListener("click", function () {
    var id = $("noteStudent").value;
    var notes = getNotes();
    notes[id] = $("noteText").value;
    var ok = store.set(NOTE_KEY, notes);
    $("noteSavedHint").textContent = ok
      ? "已儲存 " + DATA[id].name + " 的註記（本機瀏覽器）"
      : "此瀏覽器無法使用本機儲存，仍可用「匯出 JSON」留存。";
    toast(ok ? "✓ 註記已儲存" : "本機儲存不可用");
  });

  $("exportJson").addEventListener("click", function () {
    var payload = {
      meta: {
        title: "繪畫歷程教學儀表板 | 原型 Demo",
        note: "匿名模擬資料・非評分系統",
        exportedAt: new Date().toISOString()
      },
      task: "靜物與節慶主題：線稿 → 上色 → 完成圖（4 次課堂）",
      sessions: SESSIONS,
      students: DATA,
      teacherNotes: getNotes(),
      studentSupplements: store.get(SUP_KEY, {})
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "drawing-process-dashboard.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast("✓ JSON 已匯出");
  });

  /* 學生補充說明 */
  $("sendSupplement").addEventListener("click", function () {
    var text = $("supplementText").value.trim();
    if (!text) { toast("請先寫下想補充的內容"); return; }
    var all = store.get(SUP_KEY, {});
    if (!all[state.student]) all[state.student] = [];
    all[state.student].push({
      text: text,
      time: new Date().toLocaleString("zh-Hant", { hour12: false })
    });
    store.set(SUP_KEY, all);
    $("supplementText").value = "";
    renderSupplements();
    toast("✓ 補充說明已送出");
  });

  $("supplementList").addEventListener("click", function (e) {
    var btn = e.target.closest(".del-sup");
    if (!btn) return;
    var all = store.get(SUP_KEY, {});
    if (!all[state.student]) return;
    all[state.student].splice(+btn.getAttribute("data-index"), 1);
    store.set(SUP_KEY, all);
    renderSupplements();
  });

  /* Demo 列與設計稿燈箱 */
  $("closeDemo").addEventListener("click", function () {
    $("demoBar").hidden = true;
  });

  function buildDesigns() {
    $("designGrid").innerHTML = DESIGNS.map(function (d) {
      return '<figure class="design-item"><img src="assets/img/' + d.file +
        '" alt="' + esc(d.label) + '" loading="lazy">' +
        "<figcaption>" + esc(d.label) + "</figcaption></figure>";
    }).join("");
  }

  function openModal() {
    buildDesigns();
    $("designModal").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    $("designModal").hidden = true;
    document.body.style.overflow = "";
  }

  $("openDesigns").addEventListener("click", openModal);
  $("openDesignsFooter").addEventListener("click", openModal);
  document.querySelectorAll("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !$("designModal").hidden) closeModal();
  });

  /* ---------------- 初始化 ---------------- */
  setView("teacher");
  renderDynamic();
  loadNote("A");
})();
