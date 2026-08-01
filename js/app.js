(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let activeSuit = "All";
  let currentIndex = 0;

  const sortedPages = [...PAGES].sort((a, b) => {
    const suitDiff = SUITS.findIndex((s) => s.key === a.suit) - SUITS.findIndex((s) => s.key === b.suit);
    if (suitDiff !== 0) return suitDiff;
    return RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank);
  });

  function suitOf(page) {
    return SUITS.find((s) => s.key === page.suit);
  }

  const viewerCard      = document.querySelector(".viewer-card");
  const viewerImage     = document.getElementById("viewer-image");
  const viewerTitle     = document.getElementById("viewer-title");
  const viewerKind      = document.getElementById("viewer-kind");
  const pageCounter     = document.getElementById("page-counter");
  const pageSelect      = document.getElementById("page-select");
  const prevBtn         = document.getElementById("prev-btn");
  const nextBtn         = document.getElementById("next-btn");
  const downloadBtn     = document.getElementById("download-btn");
  const printBtn        = document.getElementById("print-btn");
  const randomBtn       = document.getElementById("random-btn");
  const filterPills     = document.getElementById("filter-pills");
  const archiveGrid     = document.getElementById("archive-grid");
  const printImage      = document.getElementById("print-image");
  const yearEl          = document.getElementById("year");
  const siteHeader      = document.querySelector(".site-header");
  const heroBanner      = document.querySelector(".hero-banner");

  const revealObserver = prefersReducedMotion
    ? null
    : new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

  function observeReveal(el) {
    if (!el) return;
    if (prefersReducedMotion || !revealObserver) {
      el.classList.add("in-view");
    } else {
      revealObserver.observe(el);
    }
  }

  function init() {
    yearEl.textContent = "© " + new Date().getFullYear();
    buildPageSelect();
    buildFilterPills();
    renderArchive();
    showPage(0);

    document.querySelectorAll(".reveal").forEach(observeReveal);

    prevBtn.addEventListener("click", () => step(-1));
    nextBtn.addEventListener("click", () => step(1));
    randomBtn.addEventListener("click", pickRandom);
    pageSelect.addEventListener("change", (e) => showPage(Number(e.target.value)));
    downloadBtn.addEventListener("click", downloadCurrent);
    printBtn.addEventListener("click", printCurrent);

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
        if (!prefersReducedMotion && heroBanner) {
          const rect = heroBanner.getBoundingClientRect();
          if (rect.bottom > 0) {
            heroBanner.style.transform = `translateY(${Math.min(window.scrollY * 0.15, 60)}px)`;
          }
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function buildPageSelect() {
    pageSelect.innerHTML = sortedPages
      .map((p, i) => `<option value="${i}">${p.rank} of ${suitOf(p).label} — ${p.title}</option>`)
      .join("");
  }

  function buildFilterPills() {
    filterPills.innerHTML =
      `<button class="filter-pill active" data-suit="All">All</button>` +
      SUITS.map(
        (s) =>
          `<button class="filter-pill" data-suit="${s.key}" style="--suit-accent:${s.accent}">
             <span class="pill-symbol">${s.symbol}</span>${s.label}
           </button>`
      ).join("");

    filterPills.querySelectorAll(".filter-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSuit = btn.dataset.suit;
        filterPills
          .querySelectorAll(".filter-pill")
          .forEach((b) => b.classList.toggle("active", b === btn));
        renderArchive();
      });
    });
  }

  function renderArchive() {
    const items =
      activeSuit === "All" ? sortedPages : sortedPages.filter((p) => p.suit === activeSuit);

    archiveGrid.innerHTML = items
      .map((p, i) => {
        const realIndex = sortedPages.indexOf(p);
        const suit = suitOf(p);
        return `
          <div class="archive-item reveal-card${realIndex === currentIndex ? " is-active" : ""}" data-index="${realIndex}" style="--i:${i}; --suit-accent:${suit.accent}">
            <img src="${p.file}" alt="${p.title}" loading="lazy">
            <h3>${p.title}</h3>
            <span class="kind-chip${p.kind === "page" ? " is-page" : ""}">${p.kind === "page" ? "Printable page" : "Finished art"}</span>
          </div>`;
      })
      .join("");

    archiveGrid.querySelectorAll(".archive-item").forEach((el) => {
      el.addEventListener("click", () => {
        showPage(Number(el.dataset.index));
        document.getElementById("viewer").scrollIntoView({ behavior: "smooth" });
      });
      observeReveal(el);
    });
  }

  function showPage(index) {
    currentIndex = ((index % sortedPages.length) + sortedPages.length) % sortedPages.length;

    function applyPage() {
      const page = sortedPages[currentIndex];

      viewerImage.src = page.file;
      viewerImage.alt = page.title;
      viewerTitle.textContent = page.title;
      viewerKind.textContent = page.kind === "page" ? "Printable page" : "Finished art";
      viewerKind.classList.toggle("is-page", page.kind === "page");
      pageCounter.textContent = `Card ${currentIndex + 1} of ${sortedPages.length}`;
      pageSelect.value = String(currentIndex);

      printImage.src = page.file;
      printImage.alt = page.title;

      archiveGrid.querySelectorAll(".archive-item").forEach((el) => {
        el.classList.toggle("is-active", Number(el.dataset.index) === currentIndex);
      });
    }

    if (prefersReducedMotion || !viewerCard) {
      applyPage();
      return;
    }

    viewerCard.classList.add("is-dealing");
    window.setTimeout(() => {
      applyPage();
      viewerCard.classList.remove("is-dealing");
    }, 160);
  }

  function step(delta) {
    showPage(currentIndex + delta);
  }

  function pickRandom() {
    if (sortedPages.length <= 1) return;
    let next;
    do {
      next = Math.floor(Math.random() * sortedPages.length);
    } while (next === currentIndex);
    showPage(next);
  }

  function downloadCurrent() {
    const page = sortedPages[currentIndex];
    const a = document.createElement("a");
    a.href = page.file;
    a.download = page.file.split("/").pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function printCurrent() {
    window.print();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
