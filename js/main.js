// Favour Collection - main.js
// Global site interactions: mobile nav, search, and shared helpers

const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const state = {
  searchQuery: ''
};

function initMobileNav() {
  const toggle = qs('[data-nav-toggle]');
  const nav = qs('[data-nav]');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
}

function initSearch() {
  const input = qs('[data-search-input]');
  const clearBtn = qs('[data-search-clear]');
  if (!input) return;
  input.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase();
    const cards = qsa('[data-product-card]');
    cards.forEach(card => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const category = (card.getAttribute('data-category') || '').toLowerCase();
      const matches = name.includes(state.searchQuery) || category.includes(state.searchQuery);
      card.style.display = matches ? '' : 'none';
    });
  });
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
    });
  }
}

function smoothScroll() {
  qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function initYear() {
  const yearEl = qs('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

window.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSearch();
  smoothScroll();
  initYear();
});