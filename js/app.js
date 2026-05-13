/* ============================================================
   APP — Data for the Agentic Enterprise
   Reads from window.CONTENT (content.js) and builds the DOM,
   then runs all animation / scrollytelling logic.
   ============================================================ */

(function () {
  "use strict";

  /* ── Helpers ─────────────────────────────────────────── */
  function el(tag, attrs = {}, ...children) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "className") e.className = v;
      else if (k === "innerHTML") e.innerHTML = v;
      else e.setAttribute(k, v);
    }
    children.forEach(c => {
      if (typeof c === "string") e.insertAdjacentHTML("beforeend", c);
      else if (c) e.appendChild(c);
    });
    return e;
  }

  /* ── Content alias ───────────────────────────────────── */
  const C = window.CONTENT;

  /* ══════════════════════════════════════════════════════
     1. POPULATE STATIC / META
  ══════════════════════════════════════════════════════ */
  document.title = C.meta.pageTitle;
  document.querySelector('meta[name="author"]').setAttribute("content", C.meta.author);

  /* ── Back / Start buttons ─────────────────────────────  */
  document.getElementById("backToIntroBtn").textContent = C.intro.backBtn;

  /* ══════════════════════════════════════════════════════
     2. BUILD INTRO SCREEN
  ══════════════════════════════════════════════════════ */
  (function buildIntro() {
    const intro = C.intro;
    document.querySelector(".intro-kicker").textContent = intro.kicker;
    document.querySelector(".intro-title").textContent  = intro.title;
    document.querySelector(".intro-subtitle").innerHTML = intro.subtitle;

    /* chips */
    const chipsEl = document.querySelector(".intro-chips");
    chipsEl.innerHTML = "";
    intro.chips.forEach(ch => {
      chipsEl.appendChild(el("div", { className: `intro-chip ${ch.cssClass}` }, ch.label));
    });

    /* story paragraphs */
    const storyEl = document.querySelector(".intro-story");
    storyEl.innerHTML = "";
    intro.story.forEach((text, i) => {
      const p = el("p");
      if (i === intro.storyEmphasisIndex) p.className = "intro-emphasis";
      p.innerHTML = text;
      storyEl.appendChild(p);
    });

    /* pillars */
    const pillarsEl = document.querySelector(".intro-pillars");
    pillarsEl.innerHTML = "";
    intro.pillars.forEach(pillar => {
      const logoRow = el("div", { className: "intro-logo-row" });
      pillar.logos.forEach(logo => {
        logoRow.appendChild(el("img", { src: logo.src, alt: logo.alt }));
      });
      (pillar.logoTags || (pillar.logoTag ? [pillar.logoTag] : [])).forEach(tag => {
        logoRow.appendChild(el("span", { className: "intro-logo-tag" }, tag));
      });
      pillarsEl.appendChild(
        el("div", { className: "intro-pillar" },
          el("div", { className: "intro-pillar-title" }, pillar.title),
          el("div", { className: "intro-pillar-body" }, logoRow, pillar.body)
        )
      );
    });

    document.querySelector(".intro-note").textContent       = intro.note;
    document.querySelector(".intro-start-btn").innerHTML    = intro.startBtn;
  })();

  /* ══════════════════════════════════════════════════════
     3. BUILD STORY HEADER
  ══════════════════════════════════════════════════════ */
  (function buildStoryHeader() {
    const sh = C.storyHeader;
    const nw = C.storyHeader.navWords;
    const header = document.querySelector("#narrativeCol > .sticky");

    header.querySelector("h1").innerHTML =
      `${sh.title} <span class="text-energeticOrange">${sh.titleHL}</span>`;
    header.querySelector(".text-sm").innerHTML =
      `From <span class="nav-word" id="word-chaos">${nw.chaos}</span> to ` +
      `<span class="nav-word" id="word-trust">${nw.trust}</span> to ` +
      `<span class="nav-word" id="word-context">${nw.context}</span> to ` +
      `<span class="nav-word" id="word-action">${nw.action}</span>.`;
    header.querySelector(".text-\\[10px\\]").textContent = C.meta.preparedBy;
  })();

  /* ══════════════════════════════════════════════════════
     4. BUILD CHAPTERS (narrative left column)
  ══════════════════════════════════════════════════════ */
  (function buildChapters() {
    const col = document.getElementById("narrativeCol");

    C.chapters.forEach(ch => {
      const block = document.getElementById(`step-${ch.id}`);
      if (!block) return;
      block.innerHTML = "";

      /* title row */
      block.innerHTML += `
        <div class="step-dot"></div>
        <h2 class="text-2xl font-bold ${ch.id === 7 ? "text-agentPurple" : ch.id === 8 ? "text-mulePink" : "text-deepNavy"} mb-3 flex items-center gap-3">
          ${ch.title}
          <span class="intro-chip ${ch.chipClass}" style="font-size:10px;padding:4px 8px;margin-bottom:0;animation:none;">${ch.chipLabel}</span>
        </h2>`;

      if (ch.tagline)  block.innerHTML += `<p class="text-sm font-semibold text-energeticOrange mb-2">${ch.tagline}</p>`;
      if (ch.subtitle) block.innerHTML += `<h3 class="text-base font-semibold text-slate-500 mb-2 italic">${ch.subtitle}</h3>`;

      if (ch.body?.length) {
        block.innerHTML += `<div class="space-y-4 text-sm leading-relaxed">`;
        ch.body.forEach(p => { block.innerHTML += `<p>${p}</p>`; });
        block.innerHTML += `</div>`;
      }

      /* Chapter 1 special boxes */
      if (ch.infoBox) {
        block.innerHTML += `
          <div class="bg-white rounded-lg border border-slate-200 p-4 mt-4">
            <p class="font-semibold text-deepNavy mb-2">${ch.infoBox.title}</p>
            <p>${ch.infoBox.intro}</p>
            <ul class="list-disc ml-5 mt-2 space-y-1">${ch.infoBox.items.map(i => `<li>${i}</li>`).join("")}</ul>
          </div>`;
      }
      if (ch.infoBox2) {
        block.innerHTML += `
          <div class="bg-slate-50 rounded-lg border border-slate-200 p-4 mt-4">
            <p class="font-semibold text-deepNavy mb-2">${ch.infoBox2.title}</p>
            <ul class="list-disc ml-5 space-y-1">${ch.infoBox2.items.map(i => `<li>${i}</li>`).join("")}</ul>
          </div>`;
      }
      if (ch.closingQ) {
        block.innerHTML += `
          <p class="font-semibold text-deepNavy mt-4">${ch.closingQ}</p>
          <p class="text-slate-700">${ch.closingAns}</p>`;
      }

      /* Chapter 2 pipeline */
      if (ch.pipelineSteps) {
        block.innerHTML += `<div class="space-y-4 text-sm text-slate-600 bg-white p-4 rounded border border-slate-200 shadow-sm mt-4">`;
        ch.pipelineSteps.forEach((s, i) => {
          block.innerHTML += `
            <div class="flex gap-3 ${i < ch.pipelineSteps.length - 1 ? "border-b border-slate-100 pb-3" : ""}">
              <div class="font-bold ${s.numClass}">${s.num}</div>
              <div><strong class="text-deepNavy">${s.title}</strong><div class="mt-1">${s.desc}</div></div>
            </div>`;
        });
        block.innerHTML += `</div>`;
        block.innerHTML += `<div class="bg-cyan-50 border border-cyan-200 p-3 rounded mt-5 text-sm text-cyan-800"><strong>Result:</strong> ${ch.result}</div>`;
      }

      /* Chapter 3 share strategy */
      if (ch.shareStrategy) {
        const ss = ch.shareStrategy;
        block.innerHTML += `
          <div class="bg-orange-50 border border-orange-200 p-4 rounded mb-5 text-sm text-orange-900 space-y-3 mt-4">
            <strong>${ss.title}</strong>
            <p>${ss.intro}</p>
            <ul class="list-disc pl-5 space-y-2">${ss.items.map(i => `<li>${i}</li>`).join("")}</ul>
          </div>
          <p class="text-sm text-slate-600"><strong>Robert's Reality:</strong> ${ch.robertStory}</p>`;
      }

      /* Chapter 4 boxes */
      if (ch.muleBox && ch.id === 4) {
        block.innerHTML += `
          <div class="bg-purple-50 border border-purple-200 p-4 rounded mb-4 text-sm text-purple-900 space-y-2 mt-4">
            <p class="font-semibold text-deepNavy">${ch.muleBox.title}</p>
            <ul class="list-disc pl-5 space-y-1">${ch.muleBox.items.map(i => `<li>${i}</li>`).join("")}</ul>
          </div>
          <div class="bg-white border-l-4 border-purple-500 shadow-sm p-4 mb-4">
            <h4 class="font-bold text-deepNavy text-sm mb-1">${ch.robertStory.title}</h4>
            <p class="text-sm text-slate-600 mb-2">${ch.robertStory.intro}</p>
            <ul class="list-disc pl-5 text-sm text-slate-600 space-y-1">${ch.robertStory.items.map(i => `<li>${i}</li>`).join("")}</ul>
          </div>`;
      }

      /* Chapter 5 */
      if (ch.buildingBlocks) {
        const bb = ch.buildingBlocks;
        block.innerHTML += `
          <div class="bg-slate-50 border border-slate-200 p-4 rounded mb-4 text-sm text-slate-800 space-y-3 mt-4">
            <p class="font-semibold text-deepNavy">${bb.title}</p>
            <ul class="list-disc pl-5 space-y-1">${bb.items.map(i => `<li>${i}</li>`).join("")}</ul>
            <p class="text-slate-700">${bb.metadata}</p>
            <p class="text-slate-700">${bb.snowflake}</p>
          </div>
          <p class="text-sm text-slate-600 mb-4 leading-relaxed">${ch.snowflakeNote}</p>
          <div class="bg-white border-l-4 border-blue-500 shadow-sm p-4 mb-4">
            <h4 class="font-bold text-deepNavy text-sm mb-1">${ch.robertStory.title}</h4>
            <p class="text-sm text-slate-600">${ch.robertStory.body}</p>
          </div>
          <p class="text-sm text-slate-600 leading-relaxed">${ch.closing}</p>`;
      }

      /* Chapter 6 */
      if (ch.contextBox) {
        const cb = ch.contextBox;
        block.innerHTML += `
          <div class="bg-blue-50 border border-blue-200 p-4 rounded mb-4 text-sm text-blue-900 space-y-3 mt-4">
            <strong>${cb.title}</strong>
            <p>${cb.intro}</p>
            <ul class="list-disc pl-5 space-y-1">${cb.items.map(i => `<li>${i}</li>`).join("")}</ul>
            <p class="mt-2 font-bold">Result: ${cb.result}</p>
          </div>
          <div class="bg-white border-l-4 border-green-500 shadow-sm p-4 mb-4">
            <h4 class="font-bold text-deepNavy text-sm mb-1">${ch.robertStory.title}</h4>
            <p class="text-sm text-slate-600">${ch.robertStory.body}</p>
          </div>`;
      }

      /* Chapter 7 */
      if (ch.id === 7 && ch.robertStory) {
        block.innerHTML += `
          <div class="bg-white border-l-4 border-agentPurple shadow-sm p-4 mb-4 mt-4">
            <h4 class="font-bold text-deepNavy text-sm mb-1">${ch.robertStory.title}</h4>
            <p class="text-sm text-slate-600 mb-2">${ch.robertStory.intro}</p>
            <ul class="list-disc pl-5 text-sm text-slate-600 space-y-1">${ch.robertStory.items.map(i => `<li>${i}</li>`).join("")}</ul>
          </div>`;
      }

      /* Chapter 8 */
      if (ch.id === 8) {
        const mb = ch.muleBox;
        const eb = ch.evolutionBox;
        const cl = ch.closing;
        block.innerHTML += `
          <div class="bg-slate-50 border border-slate-200 p-3 rounded mb-4 text-xs text-slate-700 space-y-2 mt-4">
            <p class="font-semibold text-deepNavy">${mb.title}</p>
            <ul class="list-disc pl-5 space-y-1">${mb.items.map(i => `<li>${i}</li>`).join("")}</ul>
          </div>
          <div class="bg-white border border-slate-200 p-4 rounded mb-4 text-sm text-slate-700 space-y-2">
            <p class="font-semibold text-deepNavy">${eb.title}</p>
            <p>${eb.intro}</p>
            <ul class="list-disc pl-5 space-y-1">${eb.items.map(i => `<li>${i}</li>`).join("")}</ul>
            <p class="text-slate-600"><strong>Result:</strong> ${eb.result}</p>
          </div>
          <div class="mt-6 bg-white rounded-lg border border-slate-200 p-4">
            <p class="font-semibold text-deepNavy mb-1">${cl.title}</p>
            <p class="text-sm text-slate-700">${cl.body}</p>
            <p class="text-xs italic text-slate-500 mt-2">${cl.contact}</p>
          </div>`;
      }
    });
  })();

  /* ══════════════════════════════════════════════════════
     5. BUILD VISUAL COLUMN — SOURCE CARDS (shelf top)
  ══════════════════════════════════════════════════════ */
  (function buildSourceCards() {
    C.sourceCards.forEach(sc => {
      const existing = document.getElementById(sc.id);
      if (existing) {
        /* update texts */
        existing.querySelector("span.font-bold").textContent = sc.label;
        existing.querySelector("img").src    = sc.icon;
        existing.querySelector("img").alt    = sc.iconAlt;
        existing.querySelector(".data-badge").textContent = sc.badge;
        const eid = existing.querySelector(".eid-badge");
        if (eid) eid.textContent = sc.eid;
        const tip = existing.querySelector(".hover-tooltip");
        if (tip) {
          tip.querySelector("h4").textContent = sc.tooltip.title;
          tip.querySelector("p").textContent  = sc.tooltip.body;
        }
      }
    });
  })();

  /* source context tooltip text */
  (function buildSourceContextTooltip() {
    const sct = C.sourceContextTooltip;
    const box = document.querySelector("#source-context-text .bg-white\\/95");
    if (box) {
      box.querySelector("strong").textContent = sct.title;
      const rest = box.querySelector("strong").nextSibling;
      if (rest && rest.nodeType === 3) rest.textContent = " ";
    }
  })();

  /* ══════════════════════════════════════════════════════
     6. BUILD MULE CARD
  ══════════════════════════════════════════════════════ */
  (function buildMuleCard() {
    const mc = C.muleCard;
    const card = document.getElementById("card-mule");
    if (!card) return;
    card.querySelector("img").src = mc.icon;
    card.querySelector("img").alt = mc.iconAlt;
    card.querySelector(".font-bold.text-sm").textContent = mc.label;
    card.querySelector(".text-xs.text-slate-500").textContent = mc.sublabel;

    const extra = document.getElementById("muleFabricExtra");
    if (extra) {
      extra.querySelector(".font-semibold.text-slate-800").textContent = mc.fabricTitle;
      const items = extra.querySelectorAll("li");
      mc.fabricItems.forEach((txt, i) => {
        if (items[i]) items[i].innerHTML = txt;
      });
    }

    const tip = card.querySelector(".hover-tooltip");
    if (tip) {
      tip.querySelector("h4").textContent = mc.tooltip.title;
      tip.querySelector("p").textContent  = mc.tooltip.body;
    }

    document.getElementById("label-app-int").innerHTML = mc.labelAppInt;
  })();

  /* ══════════════════════════════════════════════════════
     7. BUILD DATA MANAGEMENT GROUP
  ══════════════════════════════════════════════════════ */
  (function buildDataManagement() {
    const dm = C.dataManagement;
    const group = document.getElementById("card-dm-group");
    if (!group) return;

    /* group header */
    const hdr = group.querySelector(".absolute.-top-3 img");
    if (hdr) { hdr.src = dm.groupIcon; hdr.alt = dm.groupIconAlt; }
    const hdrText = group.querySelector(".absolute.-top-3");
    if (hdrText) { const tn = hdrText.lastChild; if (tn && tn.nodeType === 3) tn.textContent = " " + dm.groupLabel; }

    /* catalog */
    const catalog = document.getElementById("card-catalog");
    if (catalog) {
      catalog.querySelector(".text-orange-600").innerHTML = dm.catalog.label;
      catalog.querySelector(".text-slate-400").innerHTML  = dm.catalog.sublabel;
      const tip = catalog.querySelector(".hover-tooltip h4"); if (tip) tip.textContent = dm.catalog.tooltip.title;
      const tip2 = catalog.querySelector(".hover-tooltip p"); if (tip2) tip2.textContent = dm.catalog.tooltip.body;
    }

    /* integration */
    const di = document.getElementById("card-di");
    if (di) {
      di.querySelector(".text-orange-600").innerHTML = dm.integration.label;
      di.querySelector(".text-slate-400").innerHTML  = dm.integration.sublabel;
      const tip = di.querySelector(".hover-tooltip h4"); if (tip) tip.textContent = dm.integration.tooltip.title;
      const tip2 = di.querySelector(".hover-tooltip p"); if (tip2) tip2.textContent = dm.integration.tooltip.body;
    }

    /* quality */
    const dq = document.getElementById("card-dq");
    if (dq) {
      dq.querySelector(".text-orange-600").innerHTML = dm.quality.label;
      dq.querySelector(".text-slate-400").innerHTML  = dm.quality.sublabel;
      const tip = dq.querySelector(".hover-tooltip h4"); if (tip) tip.textContent = dm.quality.tooltip.title;
      const tip2 = dq.querySelector(".hover-tooltip p"); if (tip2) tip2.textContent = dm.quality.tooltip.body;
    }

    /* MDM Hub badge */
    const mdmCard = document.getElementById("card-mdm");
    if (mdmCard) {
      const badge = mdmCard.querySelector(".absolute.-top-3");
      if (badge) badge.textContent = dm.mdm.hubLabel;
      const tipTitle = mdmCard.querySelector(".hover-tooltip h4");
      if (tipTitle) tipTitle.textContent = dm.mdm.tooltip.title;
      const mdmWhat = document.getElementById("mdm-what");
      if (mdmWhat) mdmWhat.textContent = dm.mdm.tooltip.what;
      const mdmFunc = document.getElementById("mdm-func");
      if (mdmFunc) mdmFunc.textContent = dm.mdm.tooltip.func;
    }

    /* pipeline steps */
    dm.mdm.pipeline.forEach(step => {
      const p = document.getElementById(step.id);
      if (!p) return;
      if (step.id === "pipe-5") {
        p.innerHTML = `GOLDEN RECORD E-999`;
      } else {
        p.querySelector(".pipe-icon").textContent = step.icon;
        p.querySelector(".font-bold.block.text-xs").textContent = step.title;
        p.querySelector(".text-slate-400.block").textContent    = step.sub;
      }
    });

    /* analytics label */
    document.getElementById("label-analytics").innerHTML = dm.analytics ? dm.analytics : C.analytics.labelAnalytics;
  })();

  /* ══════════════════════════════════════════════════════
     8. BUILD ANALYTICS COLUMN
  ══════════════════════════════════════════════════════ */
  (function buildAnalytics() {
    const an = C.analytics;
    document.getElementById("label-analytics").innerHTML = an.labelAnalytics;

    const sf = document.getElementById("card-snowflake");
    if (sf) {
      const imgs = sf.querySelectorAll("img");
      an.snowflakeCard.icons.forEach((ico, i) => {
        if (imgs[i]) { imgs[i].src = ico.src; imgs[i].alt = ico.alt; }
      });
      sf.querySelector(".font-bold.text-sm").textContent = an.snowflakeCard.label;
      sf.querySelector(".text-xs.text-slate-500").textContent = an.snowflakeCard.sublabel;
      const tip = sf.querySelector(".hover-tooltip");
      if (tip) { tip.querySelector("h4").textContent = an.snowflakeCard.tooltip.title; tip.querySelector("p").textContent = an.snowflakeCard.tooltip.body; }
    }

    const tab = document.getElementById("card-tableau");
    if (tab) {
      tab.querySelector("img").src = an.tableauCard.icon;
      tab.querySelector("img").alt = an.tableauCard.iconAlt;
      tab.querySelector(".font-bold").textContent = an.tableauCard.label;
      const tip = tab.querySelector(".hover-tooltip");
      if (tip) { tip.querySelector("h4").textContent = an.tableauCard.tooltip.title; tip.querySelector("p").textContent = an.tableauCard.tooltip.body; }
    }
  })();

  /* ══════════════════════════════════════════════════════
     9. BUILD DATA 360 CARD
  ══════════════════════════════════════════════════════ */
  (function buildData360() {
    const d = C.data360;
    const card = document.getElementById("card-data360");
    if (!card) return;

    card.querySelector("img.w-4").src = d.icon;
    card.querySelector("img.w-4").alt = d.iconAlt;
    card.querySelector("span.font-bold.text-sm.text-deepNavy").textContent = d.label;
    card.querySelector(".w-3\\/4.text-right").innerHTML = d.desc;

    const tip = card.querySelector(".hover-tooltip");
    if (tip) { tip.querySelector("h4").textContent = d.tooltip.title; tip.querySelector("p").textContent = d.tooltip.body; }

    const gc = document.getElementById("g-center");
    if (gc) {
      gc.querySelector(".text-\\[8px\\]").textContent  = d.graphCenter.topLabel;
      gc.querySelector(".font-bold.text-white.text-base").textContent = d.graphCenter.name;
      gc.querySelector(".text-\\[9px\\].text-brightCyan").textContent = d.graphCenter.uuid;
      gc.querySelector(".bg-amber-100").textContent = d.graphCenter.linkedId;
    }

    /* graph nodes */
    d.graphNodes.forEach(node => {
      const nb = document.getElementById(node.id);
      if (!nb) return;
      const img = nb.querySelector("img");
      if (img) img.src = node.icon;
      const tableId = node.id.replace("g-", "t-");
      const table = document.getElementById(tableId);
      if (table) table.querySelector(".dt-head").textContent = node.tableHead;
    });
  })();

  /* ══════════════════════════════════════════════════════
     10. BUILD AGENTFORCE CARDS (both #card-agent + #card-agent-2)
  ══════════════════════════════════════════════════════ */
  (function buildAgentforce() {
    function populateCard(card, ag) {
      if (!card || !ag) return;
      const logoEl = card.querySelector("img.w-7");
      if (logoEl) { logoEl.src = ag.icon; logoEl.alt = ag.iconAlt; }
      const labelEl = card.querySelector(".font-bold.text-\\[12px\\]");
      if (labelEl) labelEl.textContent = ag.label;
      const atlasLabel = card.querySelector(".text-xs.font-bold.text-agentPurple");
      if (atlasLabel) atlasLabel.textContent = ag.atlasLabel;
      const trustLabel = card.querySelector(".text-\\[7px\\].text-green-600");
      if (trustLabel) trustLabel.textContent = ag.trustLabel;

      const tip = card.querySelector(".hover-tooltip");
      if (tip && ag.tooltip) {
        tip.querySelector("h4").textContent = ag.tooltip.title || "";
        const ps = tip.querySelectorAll("p");
        if (ps[0]) ps[0].innerHTML = `<strong>Atlas Reasoning Engine:</strong> ${ag.tooltip.atlasEngine || ""}`;
        if (ps[1]) ps[1].innerHTML = `<strong>Trust Layer:</strong> ${ag.tooltip.trustLayer || ""}`;
        const a = tip.querySelector("a");
        if (a) { a.href = ag.tooltip.vendorUrl || "#"; a.textContent = ag.tooltip.vendorLabel || ""; }
      }

      const channelsInner = card.querySelector(".channels-inside .flex.items-center.gap-5");
      if (channelsInner) {
        channelsInner.innerHTML = "";
        (ag.channels || []).forEach(ch => {
          channelsInner.innerHTML += `
            <div class="flex flex-col items-center leading-none" title="${ch.title}">
              <span class="text-3xl">${ch.icon}</span>
              <span class="text-sm text-slate-600 mt-1 font-semibold">${ch.label}</span>
            </div>`;
        });
        const channelLabelEl = card.querySelector(".text-\\[10px\\].text-slate-400");
        if (channelLabelEl) channelLabelEl.textContent = ag.channelLabel || "";
      }
    }

    populateCard(document.getElementById("card-agent"),   C.agentforce  || {});
    populateCard(document.getElementById("card-agent-2"), C.agentforce2 || {});

    /* channels outside — driven by card 1 */
    const chOut = document.getElementById("agentChannelsOutside");
    if (chOut) {
      chOut.innerHTML = "";
      (C.agentforce.channels || []).forEach(ch => {
        chOut.innerHTML += `
          <div class="agent-channel-pill" title="${ch.title}">
            <span class="icon">${ch.icon}</span><span>${ch.label}</span>
          </div>`;
      });
    }

    /* autonomous zone label */
    document.querySelector(".shelf-bottom").setAttribute("data-zone-label", C.agentforce.autonomousZoneLabel);
  })();

  /* ══════════════════════════════════════════════════════
     11. BUILD SF APPS BAR
  ══════════════════════════════════════════════════════ */
  (function buildSfApps() {
    const sa = C.sfApps;
    const bar = document.getElementById("card-sf-apps");
    if (!bar) return;

    const labelEl = bar.querySelector(".text-\\[10px\\].font-bold");
    if (labelEl) {
      const img = labelEl.querySelector("img");
      if (img) { img.src = sa.icon; img.alt = sa.iconAlt; }
      labelEl.childNodes[labelEl.childNodes.length - 1].textContent = " " + sa.label;
    }

    const appsRow = bar.querySelector(".flex.flex-wrap");
    if (appsRow) {
      appsRow.innerHTML = "";
      sa.apps.forEach(app => {
        appsRow.innerHTML += `
          <div class="bg-white border border-blue-200 text-blue-900 text-xs px-3 py-1.5 rounded-md shadow-sm font-bold flex items-center gap-1">
            <span class="text-sm">${app.icon}</span> ${app.label}
          </div>`;
      });
      /* last app gets different colours */
      const last = appsRow.lastElementChild;
      if (last) last.className = "bg-white border border-slate-200 text-slate-600 text-xs px-3 py-1.5 rounded-md shadow-sm font-bold flex items-center gap-1";
    }
  })();

  /* ══════════════════════════════════════════════════════
     12. INTRO / BACK BUTTON LOGIC
  ══════════════════════════════════════════════════════ */
  (function initIntro() {
    const btn     = document.getElementById("startBtn");
    const backBtn = document.getElementById("backToIntroBtn");

    if (btn) {
      btn.addEventListener("click", function () {
        document.body.classList.add("started");
        window.scrollTo(0, 0);
        const first = document.querySelector('.step-block[data-step="1"]');
        if (first) first.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.__setNavActive) window.__setNavActive(1);
      });
    }

    window.__setNavActive = function () {};

    if (backBtn && !backBtn.__bound) {
      backBtn.__bound = true;
      backBtn.addEventListener("click", () => {
        document.body.classList.remove("started");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  })();

  /* ══════════════════════════════════════════════════════
     13. CANVAS / ANIMATION ENGINE
  ══════════════════════════════════════════════════════ */
  const canvas = document.getElementById("connectorCanvas");
  const ctx    = canvas.getContext("2d");
  let arrows       = [];
  let movingTokens = [];
  let offset       = 0;
  let currentStep  = 1;
  const totalSteps = 8;

  function scrollToStep(delta) {
    let next = currentStep + delta;
    if (next < 1) next = 1;
    if (next > totalSteps) next = totalSteps;
    const target = document.getElementById(`step-${next}`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  window.scrollToStep = scrollToStep;

  function resize() {
    const container = document.querySelector(".shelf-container");
    if (container) { canvas.width = container.offsetWidth; canvas.height = container.offsetHeight; }
  }
  window.addEventListener("resize", resize);
  resize();

  function drawArrow(fromSel, toSel, color, type = "solid") {
    const from = document.querySelector(fromSel);
    const to   = document.querySelector(toSel);
    if (!from || !to) return null;

    const containerRect = document.querySelector(".shelf-container").getBoundingClientRect();
    const f = from.getBoundingClientRect();
    const t = to.getBoundingClientRect();

    const x1 = (f.left + f.width / 2)  - containerRect.left;
    const y1 = f.bottom                 - containerRect.top;
    const x2 = (t.left + t.width / 2)  - containerRect.left;
    const y2 = t.top                    - containerRect.top;

    ctx.beginPath();
    ctx.lineWidth    = type === "bi" ? 2.8 : 1.5;
    ctx.globalAlpha  = type === "bi" ? 0.75 : 0.5;
    ctx.strokeStyle  = color;

    const isStraight = type.startsWith("straight");
    const baseType   = isStraight ? (type.replace("straight-", "") || "solid") : type;

    if      (baseType === "bi")     ctx.setLineDash([14, 8]);
    else if (baseType === "dashed") ctx.setLineDash([6, 6]);
    else if (baseType === "dotted") ctx.setLineDash([3, 3]);
    else                            ctx.setLineDash([]);
    ctx.lineDashOffset = -offset;

    let midY = null;
    if (isStraight) {
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    } else {
      midY = (y1 + y2) / 2;
      ctx.moveTo(x1, y1); ctx.lineTo(x1, midY); ctx.lineTo(x2, midY); ctx.lineTo(x2, y2);
    }
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    ctx.beginPath();
    ctx.arc(x2, y2, 3, 0, 2 * Math.PI);
    ctx.fillStyle   = color;
    ctx.globalAlpha = type === "bi" ? 0.85 : 0.7;
    ctx.fill();
    if (type === "bi") {
      ctx.beginPath(); ctx.arc(x1, y1, 3, 0, 2 * Math.PI);
      ctx.fillStyle = color; ctx.globalAlpha = 0.85; ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    return { x1, y1, x2, y2, midY, straight: isStraight };
  }

  function drawPacket(fromSel, toSel, progress, color, strokeColor = null) {
    const coords = drawArrow(fromSel, toSel, "transparent");
    if (!coords) return;
    const { x1, y1, x2, y2, midY, straight } = coords;
    let cx, cy;

    if (straight) {
      cx = x1 + (x2 - x1) * progress;
      cy = y1 + (y2 - y1) * progress;
    } else {
      const d1 = Math.abs(midY - y1);
      const d2 = Math.abs(x2 - x1);
      const d3 = Math.abs(y2 - midY);
      const totalDist = d1 + d2 + d3;
      const p1 = d1 / totalDist;
      const p2 = (d1 + d2) / totalDist;
      if (progress < p1) {
        cx = x1; cy = y1 + (progress / p1) * (midY - y1);
      } else if (progress < p2) {
        cx = x1 + ((progress - p1) / (p2 - p1)) * (x2 - x1); cy = midY;
      } else {
        cx = x2; cy = midY + ((progress - p2) / (1 - p2)) * (y2 - midY);
      }
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
    ctx.fillStyle  = color;
    ctx.shadowColor = color;
    ctx.shadowBlur  = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    if (strokeColor) { ctx.lineWidth = 2; ctx.strokeStyle = strokeColor; ctx.stroke(); }
  }

  function animate() {
    offset++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    arrows.forEach(a => drawArrow(a.from, a.to, a.color, a.type));
    movingTokens.forEach(token => {
      drawPacket(token.from, token.to, token.progress, token.color, token.stroke);
      token.progress += 0.005;
      if (token.progress > 1) token.progress = 0;
    });
    if (document.getElementById("graphAnimation")?.classList.contains("active")) {
      updateGraphLines();
    }
    requestAnimationFrame(animate);
  }
  animate();

  /* ══════════════════════════════════════════════════════
     14. INTERSECTION OBSERVER → updateVisuals
  ══════════════════════════════════════════════════════ */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const step = entry.target.dataset.step;
          currentStep = parseInt(step);
          if (window.__setNavActive) window.__setNavActive(step);

          document.querySelectorAll(".step-block").forEach(s => s.classList.remove("active"));
          entry.target.classList.add("active");
          updateVisuals(step);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll(".step-block").forEach(s => observer.observe(s));

  function updateVisuals(step) {
    arrows       = [];
    movingTokens = [];

    const mule         = document.querySelector("#card-mule");
    const bottomShelf  = document.querySelector(".shelf-bottom");
    const shelfContainer = document.querySelector(".shelf-container");

    if (mule) { mule.classList.remove("mule-border-sweep", "mule-ch8-wide"); }
    bottomShelf.classList.remove("agent-perimeter");

    const labelAppInt  = document.getElementById("label-app-int");
    const labelAnalytics = document.getElementById("label-analytics");

    document.querySelectorAll(".tech-card").forEach(c => c.classList.remove("active", "highlight", "glow-ch5"));
    document.getElementById("card-mule")?.classList.remove("agent-fabric-expanded");
    document.getElementById("card-mule")?.classList.remove("mule-ch8-wide", "mule-ch8-shift", "mule-border-sweep", "mule-ch8-focus");
    document.getElementById("graphAnimation").classList.remove("active");
    document.querySelectorAll(".pipeline-step").forEach(p => p.classList.remove("visible"));

    const chOutside  = document.getElementById("agentChannelsOutside");
    const chInsideAll = document.querySelectorAll(".channels-inside");
    const chInside   = chInsideAll[0] || null;
    if (chOutside) chOutside.style.display = "none";
    chInsideAll.forEach(el => el.style.display = "");

    const fabricSvg = document.getElementById("fabricLinkSvg");
    if (fabricSvg) fabricSvg.style.display = "none";

    /* shelf position */
    if      (step === "8") shelfContainer.style.transform = "translateY(-240px)";
    else if (step === "7") shelfContainer.style.transform = "translateY(-340px)";
    else if (parseInt(step) >= 6) shelfContainer.style.transform = "translateY(-150px)";
    else    shelfContainer.style.transform = "translateY(0)";

    /* source context tooltip */
    const contextText = document.getElementById("source-context-text");
    if (step === "1") { contextText.classList.remove("opacity-0"); contextText.classList.add("opacity-100"); }
    else              { contextText.classList.remove("opacity-100"); contextText.classList.add("opacity-0"); }

    /* labels */
    if (parseInt(step) >= 4) labelAppInt.classList.remove("opacity-0");
    else                     labelAppInt.classList.add("opacity-0");
    if (parseInt(step) >= 3) labelAnalytics.classList.remove("opacity-0");
    else                     labelAnalytics.classList.add("opacity-0");

    /* nav word highlight */
    document.querySelectorAll(".nav-word").forEach(w => w.classList.remove("active"));
    if      (step === "1")               document.getElementById("word-chaos").classList.add("active");
    else if (["2","3"].includes(step))   document.getElementById("word-trust").classList.add("active");
    else if (["4","5","6"].includes(step)) document.getElementById("word-context").classList.add("active");
    else if (step === "7")               document.getElementById("word-action").classList.add("active");

    /* golden badges */
    document.querySelectorAll(".golden-badge").forEach(b => b.classList.remove("visible"));
    if (parseInt(step) >= 3) document.querySelectorAll(".golden-badge").forEach(b => b.classList.add("visible"));

    /* step-specific logic */
    if (step === "1") {
      ["#src-sap","#src-sfdc","#src-mkto","#src-snow","#src-legacy"].forEach(id => {
        document.querySelector(id)?.classList.add("active","highlight");
      });
    }

    if (step === "2") {
      document.querySelector("#card-mdm")?.classList.add("active","highlight");
      document.querySelector("#card-dm-group")?.classList.add("active");
      ["#src-sap","#src-sfdc","#src-mkto","#src-snow","#src-legacy"].forEach((id, i) => {
        document.querySelector(id)?.classList.add("active");
        arrows.push({ from: id, to: "#card-mdm", color: "#cbd5e1" });
        movingTokens.push({ from: id, to: "#card-mdm", progress: i * 0.1, color: "#e0f2fe", stroke: "#3b82f6" });
      });
      setTimeout(() => document.getElementById("pipe-1")?.classList.add("visible"), 200);
      setTimeout(() => document.getElementById("pipe-2")?.classList.add("visible"), 600);
      setTimeout(() => document.getElementById("pipe-3")?.classList.add("visible"), 1000);
      setTimeout(() => document.getElementById("pipe-4")?.classList.add("visible"), 1400);
      setTimeout(() => document.getElementById("pipe-5")?.classList.add("visible"), 1800);
    }

    if (step === "3") {
      document.querySelector("#card-dm-group")?.classList.add("active");
      document.querySelector("#card-mdm")?.classList.add("active");
      document.querySelector("#card-snowflake")?.classList.add("active");
      ["#src-sap","#src-sfdc","#src-legacy"].forEach((id, i) => {
        document.querySelector(id)?.classList.add("active");
        arrows.push({ from: "#card-mdm", to: id, color: "#10b981" });
        movingTokens.push({ from: "#card-mdm", to: id, progress: i * 0.1, color: "#f59e0b" });
      });
      arrows.push({ from: "#card-mdm", to: "#card-snowflake", color: "#10b981" });
      movingTokens.push({ from: "#card-mdm", to: "#card-snowflake", progress: 0.3, color: "#f59e0b" });
      document.querySelector("#badge-snow-analytic")?.classList.remove("hidden");
      ["pipe-1","pipe-2","pipe-3","pipe-4","pipe-5"].forEach(p => document.getElementById(p)?.classList.add("visible"));
    }

    if (step === "4") {
      ["#card-mule","#src-sfdc","#src-sap","#src-legacy"].forEach(id => document.querySelector(id)?.classList.add("active"));
      document.querySelector("#card-mule")?.classList.add("highlight");
      arrows.push({ from: "#src-sfdc",   to: "#card-mule", color: "#a80232", type: "dashed" });
      arrows.push({ from: "#src-sap",    to: "#card-mule", color: "#a80232", type: "dashed" });
      arrows.push({ from: "#src-legacy", to: "#card-mule", color: "#a80232", type: "dashed" });
    }

    if (step === "5") {
      ["#card-snowflake","#card-tableau","#src-mkto","#src-snow","#card-dm-group","#card-di","#card-dq","#card-catalog","#src-sap","#src-sfdc","#src-legacy"].forEach(id => {
        document.querySelector(id)?.classList.add("active");
      });
      document.querySelector("#card-snowflake")?.classList.add("highlight");
      document.querySelector("#card-tableau")?.classList.add("highlight");
      document.querySelector("#card-catalog")?.classList.add("highlight");
      arrows.push({ from: "#card-dm-group",   to: "#card-snowflake", color: "#29b5e8", type: "bi"     });
      arrows.push({ from: "#card-snowflake",  to: "#card-tableau",   color: "#29b5e8", type: "solid"  });
      arrows.push({ from: "#card-tableau",    to: "#card-dm-group",  color: "#f59e0b", type: "dashed" });
      movingTokens.push({ from: "#card-dm-group",  to: "#card-snowflake", progress: 0,   color: "#29b5e8", stroke: "#1e3a8a" });
      movingTokens.push({ from: "#card-snowflake", to: "#card-dm-group",  progress: 0.5, color: "#29b5e8", stroke: "#1e3a8a" });
      movingTokens.push({ from: "#card-tableau",   to: "#card-dm-group",  progress: 0.2, color: "#f59e0b" });
      ["#src-sap","#src-sfdc","#src-mkto","#src-snow","#src-legacy"].forEach(src => {
        arrows.push({ from: src, to: "#card-di", color: "#29b5e8" });
      });
      arrows.push({ from: "#card-di", to: "#card-dq", color: "#f97316" });
    }

    if (step === "6") {
      document.querySelectorAll(".tech-card").forEach(c => {
        if (c.id !== "card-agent" && c.id !== "card-agent-2" && c.id !== "card-sf-apps") c.classList.add("active");
      });
      document.querySelector("#card-data360")?.classList.add("highlight");
      ["#src-sap","#src-sfdc","#src-legacy"].forEach(id => document.querySelector(id)?.classList.add("active"));
      arrows.push({ from: "#src-sap",       to: "#card-data360", color: "#3b82f6" });
      arrows.push({ from: "#src-sfdc",      to: "#card-data360", color: "#3b82f6" });
      arrows.push({ from: "#card-mule",     to: "#card-data360", color: "#a80232", type: "straight" });
      arrows.push({ from: "#card-snowflake",to: "#card-data360", color: "#29b5e8", type: "straight-dashed" });
      document.getElementById("graphAnimation").classList.add("active");
      ["pipe-1","pipe-2","pipe-3","pipe-4","pipe-5"].forEach(p => document.getElementById(p)?.classList.add("visible"));
      requestAnimationFrame(updateGraphLines);
    }

    if (step === "7") {
      document.querySelectorAll(".tech-card").forEach(c => c.classList.add("active"));
      document.querySelector("#card-agent")?.classList.add("highlight");
      document.querySelector("#card-agent-2")?.classList.add("highlight");
      document.getElementById("graphAnimation").classList.add("active");
      bottomShelf.classList.add("agent-perimeter");
      chInsideAll.forEach(el => el.style.display = "none");
      if (chOutside) chOutside.style.display  = "flex";
      arrows.push({ from: "#src-sap",        to: "#card-data360", color: "#3b82f6" });
      arrows.push({ from: "#src-sfdc",       to: "#card-data360", color: "#3b82f6" });
      arrows.push({ from: "#card-mule",      to: "#card-data360", color: "#a80232", type: "straight" });
      arrows.push({ from: "#card-snowflake", to: "#card-data360", color: "#29b5e8", type: "straight-dashed" });
      arrows.push({ from: "#card-data360",   to: "#card-agent",   color: "#7c3aed" });
      arrows.push({ from: "#card-data360",   to: "#card-agent-2", color: "#7c3aed" });
      ["pipe-1","pipe-2","pipe-3","pipe-4","pipe-5"].forEach(p => document.getElementById(p)?.classList.add("visible"));
      requestAnimationFrame(updateGraphLines);
    }

    if (step === "8") {
      document.querySelectorAll(".tech-card").forEach(c => c.classList.add("active"));
      document.getElementById("card-mule")?.classList.add("agent-fabric-expanded","mule-border-sweep","mule-ch8-focus","mule-ch8-wide","mule-ch8-shift");
      document.getElementById("graphAnimation")?.classList.add("active");
      document.querySelector("#card-agent")?.classList.add("highlight");
      document.querySelector("#card-agent-2")?.classList.add("highlight");
      bottomShelf.classList.add("agent-perimeter");
      if (fabricSvg) { fabricSvg.style.display = "block"; positionFabricLink(); }
      chInsideAll.forEach(el => el.style.display = "none");
      if (chOutside) chOutside.style.display  = "flex";
      ["pipe-1","pipe-2","pipe-3","pipe-4","pipe-5"].forEach(p => document.getElementById(p)?.classList.add("visible"));
      arrows.push({ from: "#card-data360", to: "#card-agent",   color: "#7c3aed" });
      arrows.push({ from: "#card-data360", to: "#card-agent-2", color: "#7c3aed" });
      requestAnimationFrame(updateGraphLines);
    }
  }

  /* ══════════════════════════════════════════════════════
     15. DATA 360 GRAPH LINES
  ══════════════════════════════════════════════════════ */
  const graphSvg = document.getElementById("graphSvg");

  function updateGraphLines() {
    if (!document.getElementById("graphAnimation").classList.contains("active")) {
      if (graphSvg) while (graphSvg.firstChild) graphSvg.removeChild(graphSvg.firstChild);
    } else {
      const center = document.getElementById("g-center");
      if (center && graphSvg) {
        const container = document.getElementById("graphAnimation").getBoundingClientRect();
        const cRect = center.getBoundingClientRect();
        const cx = (cRect.left + cRect.width / 2) - container.left;
        const cy = (cRect.top  + cRect.height / 2) - container.top;

        while (graphSvg.firstChild) graphSvg.removeChild(graphSvg.firstChild);

        const systems = [
          { node: "g-sap",  table: "t-sap",  id: "ID: 101" },
          { node: "g-sfdc", table: "t-sfdc", id: "ID: A99" },
          { node: "g-mkto", table: "t-mkto", id: "ID: 500" },
          { node: "g-snow", table: "t-snow", id: "ID: 202" },
          { node: "g-leg",  table: "t-leg",  id: "ID: 800" },
        ];

        systems.forEach(sys => {
          const nodeEl  = document.getElementById(sys.node);
          const tableEl = document.getElementById(sys.table);
          const satNode = nodeEl?.querySelector(".sat-node");
          if (!nodeEl || !tableEl || !satNode) return;

          const nRect = satNode.getBoundingClientRect();
          const tRect = tableEl.getBoundingClientRect();
          const nx = (nRect.left + nRect.width / 2) - container.left;
          const ny = (nRect.top  + nRect.height / 2) - container.top;
          const tx = (tRect.left + tRect.width / 2) - container.left;
          const ty = (tRect.top  + tRect.height / 2) - container.top;

          const mkLine = (x1,y1,x2,y2,stroke,sw,dash) => {
            const line = document.createElementNS("http://www.w3.org/2000/svg","line");
            line.setAttribute("x1",x1); line.setAttribute("y1",y1);
            line.setAttribute("x2",x2); line.setAttribute("y2",y2);
            line.setAttribute("stroke",stroke); line.setAttribute("stroke-width",sw);
            if (dash) line.setAttribute("stroke-dasharray",dash);
            return line;
          };

          graphSvg.appendChild(mkLine(cx,cy,nx,ny,"#cbd5e1","2","4"));

          const text = document.createElementNS("http://www.w3.org/2000/svg","text");
          text.setAttribute("x", (cx+nx)/2); text.setAttribute("y", (cy+ny)/2);
          text.setAttribute("text-anchor","middle"); text.setAttribute("dominant-baseline","middle");
          text.setAttribute("font-size","8"); text.setAttribute("fill","#64748b"); text.setAttribute("font-weight","bold");
          text.style.paintOrder = "stroke"; text.style.stroke = "white"; text.style.strokeWidth = "3px";
          text.textContent = sys.id;
          graphSvg.appendChild(text);

          graphSvg.appendChild(mkLine(nx,ny,tx,ty,"#10b981","2",null));
        });
      }
    }
    requestAnimationFrame(updateGraphLines);
  }

  /* ══════════════════════════════════════════════════════
     16. FABRIC LINK SVG
  ══════════════════════════════════════════════════════ */
  function positionFabricLink() {
    const fabricSvg      = document.getElementById("fabricLinkSvg");
    const path           = document.getElementById("fabricLinkPath");
    const mule           = document.getElementById("card-mule");
    const autonomousZone = document.querySelector(".shelf-bottom.agent-perimeter");
    if (!fabricSvg || !path || !mule || !autonomousZone) return;
    if (fabricSvg.style.display === "none") return;

    const r1 = mule.getBoundingClientRect();
    const rz = autonomousZone.getBoundingClientRect();

    let x1, x2;
    const gapRL = Math.abs(rz.left - r1.right);
    const gapLR = Math.abs(r1.left - rz.right);

    if      (r1.right <= rz.left)  { x1 = r1.right; x2 = rz.left; }
    else if (r1.left  >= rz.right) { x1 = r1.left;  x2 = rz.right; }
    else { if (gapRL <= gapLR) { x1 = r1.right; x2 = rz.left; } else { x1 = r1.left; x2 = rz.right; } }

    const y1 = r1.top + r1.height * 0.55;
    const y2 = Math.min(rz.bottom - 14, Math.max(rz.top + 14, y1));

    path.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
    fabricSvg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
  }

  window.addEventListener("resize", () => {
    const fabricSvg = document.getElementById("fabricLinkSvg");
    if (fabricSvg && fabricSvg.style.display !== "none") positionFabricLink();
  });

  /* ── Initial render ──────────────────────────────────── */
  setTimeout(() => { resize(); updateVisuals("1"); }, 500);

})();
