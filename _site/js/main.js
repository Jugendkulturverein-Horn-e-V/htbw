/**
 * Horn to be Wild - Main JavaScript
 * Vanilla JS for all interactive functionality
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    festivalDate: new Date('2026-09-05T12:00:00'),
    festivalEndDate: new Date('2026-09-06T23:59:59'),
    cookieConsentKey: 'htbw_youtube_consent',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  // =====================
  // Mobile Menu
  // =====================
  function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mobile-menu-close');
    const closeLinks = menu?.querySelectorAll('[data-close-menu]');
    
    if (!toggle || !menu) {
      return;
    }

    function openMenu() {
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Menü schließen');
      toggle.querySelector('.menu-icon-open')?.classList.add('hidden');
      toggle.querySelector('.menu-icon-close')?.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Menü öffnen');
      toggle.querySelector('.menu-icon-open')?.classList.remove('hidden');
      toggle.querySelector('.menu-icon-close')?.classList.add('hidden');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function() {
      const isOpen = menu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    
    // Close button handler
    closeBtn?.addEventListener('click', closeMenu);

    // Close menu on link click
    closeLinks?.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // =====================
  // Countdown Timer
  // =====================
  function initCountdown() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;

    const now = new Date();
    
    // Hide countdown if festival has ended
    if (now > CONFIG.festivalEndDate) {
      countdown.style.display = 'none';
      return;
    }

    function updateCountdown() {
      const now = new Date();
      const diff = CONFIG.festivalDate - now;

      if (diff <= 0) {
        countdown.innerHTML = '<p class="font-heading text-2xl text-htbw-pink">Das Festival läuft!</p>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      countdown.innerHTML = `
        <div class="countdown-item">
          <span class="countdown-number">${days}</span>
          <span class="countdown-label">Tage</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${hours.toString().padStart(2, '0')}</span>
          <span class="countdown-label">Stunden</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${minutes.toString().padStart(2, '0')}</span>
          <span class="countdown-label">Minuten</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${seconds.toString().padStart(2, '0')}</span>
          <span class="countdown-label">Sekunden</span>
        </div>
      `;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // =====================
  // Post-Festival Mode
  // =====================
  function initPostFestivalMode() {
    const now = new Date();
    const postFestivalElements = document.querySelectorAll('[data-post-festival]');
    const preFestivalElements = document.querySelectorAll('[data-pre-festival]');

    if (now > CONFIG.festivalEndDate) {
      postFestivalElements.forEach(el => el.classList.remove('hidden'));
      preFestivalElements.forEach(el => el.classList.add('hidden'));
    } else {
      postFestivalElements.forEach(el => el.classList.add('hidden'));
      preFestivalElements.forEach(el => el.classList.remove('hidden'));
    }
  }

  // =====================
  // Cookie Consent
  // =====================
  function initCookieConsent() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (!banner) return;

    // Check if consent was already given
    const consent = localStorage.getItem(CONFIG.cookieConsentKey);
    
    if (consent === null) {
      // Show banner after a short delay
      setTimeout(() => {
        banner.classList.add('visible');
      }, 1000);
    } else if (consent === 'accepted') {
      loadAllYouTubeVideos();
    }

    acceptBtn?.addEventListener('click', function() {
      localStorage.setItem(CONFIG.cookieConsentKey, 'accepted');
      banner.classList.remove('visible');
      loadAllYouTubeVideos();
    });

    declineBtn?.addEventListener('click', function() {
      localStorage.setItem(CONFIG.cookieConsentKey, 'declined');
      banner.classList.remove('visible');
    });
  }

  function loadAllYouTubeVideos() {
    // Replace all YouTube placeholders with actual embeds
    const placeholders = document.querySelectorAll('[data-youtube-id]');
    placeholders.forEach(placeholder => {
      const videoId = placeholder.dataset.youtubeId;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.classList.add('absolute', 'inset-0', 'w-full', 'h-full');
      iframe.title = placeholder.dataset.videoTitle || 'YouTube Video';
      
      placeholder.innerHTML = '';
      placeholder.appendChild(iframe);
    });
  }

  // =====================
  // Video Modal
  // =====================
  function initVideoModal() {
    const modal = document.getElementById('video-modal');
    const container = document.getElementById('video-container');
    const closeBtn = document.getElementById('video-modal-close');
    
    if (!modal || !container) return;

    // Trigger buttons for video modal
    document.addEventListener('click', function(e) {
      const trigger = e.target.closest('[data-video-trigger]');
      if (!trigger) return;

      const videoId = trigger.dataset.videoId;
      if (!videoId) return;

      // Check cookie consent
      const consent = localStorage.getItem(CONFIG.cookieConsentKey);
      if (consent !== 'accepted') {
        // Show cookie banner
        const banner = document.getElementById('cookie-banner');
        banner?.classList.add('visible');
        return;
      }

      openVideoModal(videoId);
    });

    function openVideoModal(videoId) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.classList.add('absolute', 'inset-0', 'w-full', 'h-full');
      iframe.title = 'Video';
      
      container.innerHTML = '';
      container.appendChild(iframe);
      
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
      modal.classList.remove('open');
      container.innerHTML = '';
      document.body.style.overflow = '';
    }

    closeBtn?.addEventListener('click', closeVideoModal);
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeVideoModal();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeVideoModal();
      }
    });
  }

  // =====================
  // FAQ Accordion
  // =====================
  function initAccordion() {
    const accordions = document.querySelectorAll('.accordion-trigger');
    
    accordions.forEach(trigger => {
      trigger.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const icon = this.querySelector('.accordion-icon');
        const isOpen = content.classList.contains('open');

        // Close all other accordions in the same group
        const parent = this.closest('.accordion-group');
        if (parent) {
          parent.querySelectorAll('.accordion-content.open').forEach(item => {
            if (item !== content) {
              item.classList.remove('open');
              item.previousElementSibling?.querySelector('.accordion-icon')?.classList.remove('rotate-180');
            }
          });
        }

        // Toggle current
        content.classList.toggle('open');
        icon?.classList.toggle('rotate-180');
        
        // Update aria
        this.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  // =====================
  // Past Artists Year Tabs
  // =====================
  function initYearTabs() {
    const tabContainer = document.querySelector('[data-year-tabs]');
    if (!tabContainer) return;

    const tabs = tabContainer.querySelectorAll('.year-tab');
    const panels = document.querySelectorAll('[data-year-panel]');

    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const year = this.dataset.year;
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        // Show corresponding panel
        panels.forEach(panel => {
          if (panel.dataset.yearPanel === year) {
            panel.classList.remove('hidden');
          } else {
            panel.classList.add('hidden');
          }
        });
      });
    });
  }

  // =====================
  // Festival Map Interaction
  // =====================
  function initFestivalMap() {
    const mapAreas = document.querySelectorAll('.map-area');
    const infoPanel = document.getElementById('map-info-panel');
    
    if (!mapAreas.length) return;

    mapAreas.forEach(area => {
      area.addEventListener('click', function() {
        const areaId = this.dataset.areaId;
        const name = this.dataset.areaName;
        const description = this.dataset.areaDescription;

        // Update active state
        mapAreas.forEach(a => a.classList.remove('active'));
        this.classList.add('active');

        // Update info panel
        if (infoPanel) {
          infoPanel.innerHTML = `
            <h3 class="font-heading text-xl text-htbw-green mb-2">${name}</h3>
            <p class="text-htbw-brown">${description}</p>
          `;
          infoPanel.classList.remove('hidden');
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
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  // =====================
  // Sticker Card Rotations
  // =====================
  function initStickerCards() {
    const cards = document.querySelectorAll('.sticker-card');
    
    cards.forEach((card, index) => {
      // Apply random rotation between -3 and 3 degrees
      const rotation = (Math.random() - 0.5) * 6;
      card.style.setProperty('--rotation', `${rotation}deg`);
    });
  }

  // =====================
  // Smooth Scroll for Anchor Links
  // =====================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('header')?.offsetHeight || 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: CONFIG.reducedMotion ? 'auto' : 'smooth'
          });
        }
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
    initVideoModal();
    initAccordion();
    initYearTabs();
    initFestivalMap();
    initScrollAnimations();
    initStickerCards();
    initSmoothScroll();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
