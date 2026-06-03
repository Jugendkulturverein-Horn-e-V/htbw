/**
 * Horn to be Wild - Main JavaScript
 * Vanilla JS for all interactive functionality
 */

(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    festivalDate: new Date(window.SITE_CONFIG.festivalDate + "T12:00:00"),
    festivalEndDate: new Date(window.SITE_CONFIG.festivalEndDate + "T23:59:59"),
    cookieConsentKey: "htbw_youtube_consent",
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
  };

  // =====================
  // Mobile Menu
  // =====================
  function initMobileMenu() {
    const toggle = document.getElementById("mobile-menu-toggle");
    const menu = document.getElementById("mobile-menu");
    const closeBtn = document.getElementById("mobile-menu-close");
    const closeLinks = menu?.querySelectorAll("[data-close-menu]");

    if (!toggle || !menu) {
      return;
    }

    function openMenu() {
      menu.classList.add("open");
      menu.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Menü schließen");
      toggle.querySelector(".menu-icon-open")?.classList.add("hidden");
      toggle.querySelector(".menu-icon-close")?.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Menü öffnen");
      toggle.querySelector(".menu-icon-open")?.classList.remove("hidden");
      toggle.querySelector(".menu-icon-close")?.classList.add("hidden");
      document.body.style.overflow = "";
    }

    toggle.addEventListener("click", function () {
      const isOpen = menu.classList.contains("open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close button handler
    closeBtn?.addEventListener("click", closeMenu);

    // Close menu on link click
    closeLinks?.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        closeMenu();
      }
    });
  }

  // =====================
  // Countdown Timer
  // =====================
  function initCountdown() {
    const countdown = document.getElementById("countdown");
    if (!countdown) return;

    const now = new Date();

    // Hide countdown if festival has ended
    if (now > CONFIG.festivalEndDate) {
      countdown.style.display = "none";
      return;
    }

    function updateCountdown() {
      const now = new Date();
      const diff = CONFIG.festivalDate - now;

      if (diff <= 0) {
        countdown.innerHTML =
          '<p class="font-heading text-2xl text-htbw-pink">Das Festival läuft!</p>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      // const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      countdown.innerHTML = `
        <div class="countdown-item">
          <span class="countdown-number">${days}</span>
          <span class="countdown-label">Tage</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${hours.toString().padStart(2, "0")}</span>
          <span class="countdown-label">Stunden</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${minutes.toString().padStart(2, "0")}</span>
          <span class="countdown-label">Minuten</span>
        </div>
      `;
      // <div class="countdown-item">
      //   <span class="countdown-number">${seconds.toString().padStart(2, "0")}</span>
      //   <span class="countdown-label">Sekunden</span>
      // </div>
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // =====================
  // Post-Festival Mode
  // =====================
  function initPostFestivalMode() {
    const now = new Date();
    const postFestivalElements = document.querySelectorAll(
      "[data-post-festival]",
    );
    const preFestivalElements = document.querySelectorAll(
      "[data-pre-festival]",
    );

    if (now > CONFIG.festivalEndDate) {
      postFestivalElements.forEach((el) => el.classList.remove("hidden"));
      preFestivalElements.forEach((el) => el.classList.add("hidden"));
    } else {
      postFestivalElements.forEach((el) => el.classList.add("hidden"));
      preFestivalElements.forEach((el) => el.classList.remove("hidden"));
    }
  }

  // =====================
  // Youtube Videos
  // =====================
  function initYouTubeFacades() {
    const placeholders = document.querySelectorAll("[data-youtube-id]");
    placeholders.forEach((placeholder) => {
      // Avoid double-initialising
      if (placeholder.dataset.facadeReady) return;
      placeholder.dataset.facadeReady = "true";

      placeholder.style.cursor = "pointer";
      placeholder.addEventListener("click", function () {
        loadYouTubeVideo(placeholder);
      });
    });
  }

  function updateVideoPlaceholderHints() {
    const consent = localStorage.getItem(CONFIG.cookieConsentKey);

    document.querySelectorAll("[data-youtube-id]").forEach((placeholder) => {
      const playOverlay = placeholder.querySelector(".video-overlay");

      if (!playOverlay) return;

      if (consent === "accepted") {
        const hint = playOverlay.querySelector(".consent-hint-overlay");
        if (hint) hint.remove();
        playOverlay
          .querySelector(".play-btn-wrapper")
          ?.classList.remove("hidden");
      } else {
        playOverlay.querySelector(".play-btn-wrapper")?.classList.add("hidden");

        if (!playOverlay.querySelector(".consent-hint-overlay")) {
          const hint = document.createElement("div");
          hint.className =
            "consent-hint-overlay flex flex-col items-center justify-center gap-3 p-4 text-center";
          hint.innerHTML = `
             <div class="w-12 h-12 rounded-full bg-htbw-pink flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <p class="text-white text-sm font-medium bg-htbw-pink px-2">YouTube Videos sind deaktiviert</p>
            <button 
              type="button"
              class="consent-hint-trigger text-white text-xs bg-htbw-pink px-2 underline hover:font-bold transition-colors"
            >
              Bitte aktiviere Videos in den Datenschutz-Einstellungen.
            </button>
          `;

          playOverlay.appendChild(hint);

          hint
            .querySelector(".consent-hint-trigger")
            .addEventListener("click", function (e) {
              e.stopPropagation();
              const banner = document.getElementById("cookie-banner");
              if (banner && !banner.classList.contains("visible")) {
                const toggle = document.getElementById("consent-toggle");
                toggle
                  ?.closest("div.mt-6")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
                toggle?.focus();
              } else {
                banner?.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
                banner?.classList.add("visible");
                void banner?.offsetWidth;
                banner?.classList.add("animate-shake");
                banner?.addEventListener(
                  "animationend",
                  () => banner.classList.remove("animate-shake"),
                  { once: true },
                );
              }
            });
        }
      }
    });
  }

  // =====================
  // Cookie Consent
  // =====================

  // function loadAllYouTubeVideos() {
  //   // Replace all YouTube placeholders with actual embeds
  //   const placeholders = document.querySelectorAll("[data-youtube-id]");
  //   placeholders.forEach((placeholder) => {
  //     const videoId = placeholder.dataset.youtubeId;
  //     const iframe = document.createElement("iframe");
  //     iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
  //     iframe.setAttribute(
  //       "allow",
  //       "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  //     );
  //     iframe.setAttribute("allowfullscreen", "");
  //     iframe.classList.add("absolute", "inset-0", "w-full", "h-full");
  //     iframe.title = placeholder.dataset.videoTitle || "YouTube Video";

  //     placeholder.innerHTML = "";
  //     placeholder.appendChild(iframe);
  //   });
  // }

  // =====================
  // Shared consent state updater
  // =====================
  function applyConsentState(accepted) {
    // Update YouTube facades/hints
    if (accepted) {
      initYouTubeFacades();
    }
    updateVideoPlaceholderHints();

    // Update footer toggle UI
    const toggle = document.getElementById("consent-toggle");
    const statusLabel = document.getElementById("consent-status-label");
    if (toggle && statusLabel) {
      toggle.setAttribute("aria-checked", accepted ? "true" : "false");
      toggle.classList.toggle("bg-htbw-pink", accepted);
      toggle.classList.toggle("bg-white/20", !accepted);
      toggle
        .querySelector(".consent-toggle-thumb")
        ?.classList.toggle("translate-x-5", accepted);
      toggle
        .querySelector(".consent-toggle-thumb")
        ?.classList.toggle("translate-x-0", !accepted);
      statusLabel.textContent = accepted ? "✓ Aktiviert" : "✗ Deaktiviert";
      statusLabel.classList.toggle("text-htbw-pink", accepted);
      statusLabel.classList.toggle("text-white/50", !accepted);
    }
  }

  function initCookieConsent() {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("cookie-accept");
    const declineBtn = document.getElementById("cookie-decline");

    if (!banner) return;

    const consent = localStorage.getItem(CONFIG.cookieConsentKey);

    if (consent === null) {
      setTimeout(() => {
        banner.classList.add("visible");
      }, 1000);
    }
    applyConsentState(consent === "accepted");

    acceptBtn?.addEventListener("click", function () {
      localStorage.setItem(CONFIG.cookieConsentKey, "accepted");
      banner.classList.remove("visible");
      applyConsentState(true);
    });

    declineBtn?.addEventListener("click", function () {
      localStorage.setItem(CONFIG.cookieConsentKey, "declined");
      banner.classList.remove("visible");
      applyConsentState(false);
    });
  }

  function loadYouTubeVideo(placeholder) {
    const videoId = placeholder.dataset.youtubeId;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    );
    iframe.setAttribute("allowfullscreen", "");
    iframe.classList.add("absolute", "inset-0", "w-full", "h-full");
    iframe.title = placeholder.dataset.videoTitle || "YouTube Video";

    placeholder.innerHTML = "";
    placeholder.appendChild(iframe);
  }

  // =====================
  // Footer Consent Toggle
  // =====================
  function initConsentToggle() {
    const toggle = document.getElementById("consent-toggle");
    const statusLabel = document.getElementById("consent-status-label");

    if (!toggle || !statusLabel) return;

    function updateToggleUI(accepted) {
      toggle.setAttribute("aria-checked", accepted ? "true" : "false");
      toggle.classList.toggle("bg-htbw-pink", accepted);
      toggle.classList.toggle("bg-white/20", !accepted);
      toggle
        .querySelector(".consent-toggle-thumb")
        .classList.toggle("translate-x-5", accepted);
      toggle
        .querySelector(".consent-toggle-thumb")
        .classList.toggle("translate-x-0", !accepted);
      statusLabel.textContent = accepted ? "✓ Aktiviert" : "✗ Deaktiviert";
      statusLabel.classList.toggle("text-htbw-pink", accepted);
      statusLabel.classList.toggle("text-white/70", !accepted);
    }

    // Set initial state
    const consent = localStorage.getItem(CONFIG.cookieConsentKey);
    updateToggleUI(consent === "accepted");

    toggle.addEventListener("click", function () {
      const isAccepted =
        localStorage.getItem(CONFIG.cookieConsentKey) === "accepted";

      if (isAccepted) {
        localStorage.setItem(CONFIG.cookieConsentKey, "declined");
        updateToggleUI(false);
        updateVideoPlaceholderHints();
      } else {
        localStorage.setItem(CONFIG.cookieConsentKey, "accepted");
        updateToggleUI(true);
        initYouTubeFacades();
        updateVideoPlaceholderHints();
      }
    });
  }

  // =====================
  // Video Modal
  // =====================
  function initVideoModal() {
    const modal = document.getElementById("video-modal");
    const container = document.getElementById("video-container");
    const closeBtn = document.getElementById("video-modal-close");

    if (!modal || !container) return;

    // Trigger buttons for video modal
    document.addEventListener("click", function (e) {
      const trigger = e.target.closest("[data-video-trigger]");
      if (!trigger) return;
      if (trigger.hasAttribute("data-video-inline")) return;

      const videoId = trigger.dataset.videoId;
      if (!videoId) return;

      // Check cookie consent
      const consent = localStorage.getItem(CONFIG.cookieConsentKey);
      if (consent !== "accepted") {
        const banner = document.getElementById("cookie-banner");
        if (banner) {
          // Scroll banner into view
          banner.scrollIntoView({ behavior: "smooth", block: "nearest" });
          // Shake it to draw attention
          banner.classList.remove("animate-shake");
          void banner.offsetWidth; // force reflow to restart animation
          banner.classList.add("animate-shake");
          banner.addEventListener(
            "animationend",
            () => banner.classList.remove("animate-shake"),
            { once: true },
          );
          // Make sure it's visible
          banner.classList.add("visible");
        }
        return;
      }

      openVideoModal(videoId);
    });

    function openVideoModal(videoId) {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      );
      iframe.setAttribute("allowfullscreen", "");
      iframe.classList.add("absolute", "inset-0", "w-full", "h-full");
      iframe.title = "Video";

      container.innerHTML = "";
      container.appendChild(iframe);

      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeVideoModal() {
      modal.classList.remove("open");
      container.innerHTML = "";
      document.body.style.overflow = "";
    }

    closeBtn?.addEventListener("click", closeVideoModal);

    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeVideoModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        closeVideoModal();
      }
    });
  }

  // =====================
  // FAQ Accordion
  // =====================
  function initAccordion() {
    const accordions = document.querySelectorAll(".accordion-trigger");

    accordions.forEach((trigger) => {
      trigger.addEventListener("click", function () {
        const content = this.nextElementSibling;
        const icon = this.querySelector(".accordion-icon");
        const isOpen = content.classList.contains("open");

        // Close all other accordions in the same group
        const parent = this.closest(".accordion-group");
        if (parent) {
          parent.querySelectorAll(".accordion-content.open").forEach((item) => {
            if (item !== content) {
              item.classList.remove("open");
              item.previousElementSibling
                ?.querySelector(".accordion-icon")
                ?.classList.remove("rotate-180");
            }
          });
        }

        // Toggle current
        content.classList.toggle("open");
        icon?.classList.toggle("rotate-180");

        // Update aria
        this.setAttribute("aria-expanded", !isOpen);
      });
    });
  }

  // =====================
  // Past Artists Year Tabs
  // =====================
  function initYearTabs() {
    const tabContainer = document.querySelector("[data-year-tabs]");
    if (!tabContainer) return;

    const tabs = tabContainer.querySelectorAll(".year-tab");
    const panels = document.querySelectorAll("[data-year-panel]");

    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const year = this.dataset.year;

        // Update active tab
        tabs.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");

        // Show corresponding panel
        panels.forEach((panel) => {
          if (panel.dataset.yearPanel === year) {
            panel.classList.remove("hidden");
          } else {
            panel.classList.add("hidden");
          }
        });
      });
    });
  }

  // =====================
  // Festival Map Interaction
  // =====================
  function initFestivalMap() {
    const mapAreas = document.querySelectorAll(".map-area");
    const infoPanel = document.getElementById("map-info-panel");

    if (!mapAreas.length) return;

    mapAreas.forEach((area) => {
      area.addEventListener("click", function () {
        const areaId = this.dataset.areaId;
        const name = this.dataset.areaName;
        const description = this.dataset.areaDescription;

        // Update active state
        mapAreas.forEach((a) => a.classList.remove("active"));
        this.classList.add("active");

        // Update info panel
        if (infoPanel) {
          infoPanel.innerHTML = `
            <h3 class="font-body text-xl text-htbw-green mb-2">${name}</h3>
            <p class="text-htbw-black">${description}</p>
          `;
          infoPanel.classList.remove("hidden");
        }
      });
    });
  }

  // =====================
  // Scroll Animations (respects reduced motion)
  // =====================
  function initScrollAnimations() {
    if (CONFIG.reducedMotion) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll("[data-animate]").forEach((el) => {
      el.style.opacity = "0";
      observer.observe(el);
    });
  }

  // =====================
  // Sticker Card Rotations
  // =====================
  function initStickerCards() {
    const cards = document.querySelectorAll(
      ".sticker-card:not([data-rotation-set])",
    );

    cards.forEach((card) => {
      const rotation = Math.round((Math.random() - 0.5) * 3 * 10) / 10;
      card.style.setProperty("--rotation", `${rotation}deg`);
      card.dataset.rotationSet = "true";
    });
  }

  // =====================
  // Smooth Scroll for Anchor Links
  // =====================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight =
            document.querySelector("header")?.offsetHeight || 80;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: CONFIG.reducedMotion ? "auto" : "smooth",
          });
        }
      });
    });
  }

  // =====================
  // Act Description Toggle
  // =====================
  function initDescriptionToggles() {
    document.querySelectorAll("[data-act-description]").forEach((container) => {
      const toggle = container.querySelector(".description-toggle");
      if (!toggle) return;

      toggle.addEventListener("click", function () {
        const short = container.querySelector(".description-short");
        const full = container.querySelector(".description-full");
        const isExpanded = this.getAttribute("aria-expanded") === "true";

        short.classList.toggle("hidden", !isExpanded);
        full.classList.toggle("hidden", isExpanded);
        this.setAttribute("aria-expanded", !isExpanded);
        this.textContent = isExpanded ? "Mehr lesen ↓" : "Weniger ↑";
      });
    });
  }

  // =====================
  // Initialize All
  // =====================
  function init() {
    initMobileMenu();
    initCountdown();
    initPostFestivalMode();
    initCookieConsent();
    initConsentToggle();
    initVideoModal();
    initAccordion();
    initYearTabs();
    initFestivalMap();
    initScrollAnimations();
    initStickerCards();
    initSmoothScroll();
    initDescriptionToggles();
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
