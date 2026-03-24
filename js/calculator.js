// Calculator — Expérience Boudoir Toulouse
(function () {
  'use strict';

  // ---- State ----
  const state = {
    formula: 'numerique',
    photoCount: 10,
  };

  // ---- DOM refs ----
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const els = {};

  function cacheElements() {
    els.toggleBtns = $$('.toggle__btn');
    els.toggleWrap = $('.toggle');
    els.tierName = $('.tier__name');
    els.tierTagline = $('.tier__tagline');
    els.photoCount = $('#photo-count');
    els.slider = $('#photo-slider');
    els.btnMinus = $('#btn-minus');
    els.btnPlus = $('#btn-plus');
    els.freePhotos = $('#free-photos');
    els.freePhotosText = $('#free-photos-text');
    els.prixTotal = $('#prix-total');
    els.reductionRow = $('#row-reduction');
    els.reductionValue = $('#reduction-value');
    els.remainingValue = $('#remaining-value');
    els.photoSupRow = $('#row-photo-sup');
    els.photoSupValue = $('#photo-sup-value');
    els.inclusText = $('#inclus-text');
    els.monthAmounts = $$('.month-card__amount');
    els.monthCards = $$('.month-card');
  }

  // ---- Formatting ----
  function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  function formatCurrencyShort(value) {
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    return formatted + ' €';
  }

  // ---- Calculation ----
  function calculate() {
    const data = state.formula === 'numerique'
      ? PRICING_NUMERIQUE[state.photoCount]
      : PRICING_PRODUITS[state.photoCount];

    if (!data) return null;

    const tier = getTier(state.photoCount);
    const freeCount = getFreePhotos(state.photoCount, state.formula);
    const reduction = data.reduction || 0;
    const remaining = data.prix + reduction;
    const mensualite = remaining / 6;

    return {
      tier,
      photos: state.photoCount,
      freePhotos: freeCount,
      prix: data.prix,
      photoSup: data.photoSup,
      reduction,
      remaining,
      inclus: data.inclus,
      mensualite,
    };
  }

  // ---- Render ----
  let prevTierName = null;

  function render() {
    const result = calculate();
    if (!result) return;

    // Tier
    if (prevTierName !== result.tier.name) {
      els.tierName.classList.add('tier--changing');
      setTimeout(() => {
        els.tierName.textContent = result.tier.name;
        els.tierTagline.textContent = result.tier.tagline;
        els.tierName.classList.remove('tier--changing');
      }, 200);
      prevTierName = result.tier.name;
    }

    // Photo count display
    els.photoCount.textContent = result.photos;

    // Slider sync
    els.slider.value = result.photos;
    updateSliderProgress();

    // Free photos
    if (result.freePhotos > 0) {
      els.freePhotos.hidden = false;
      els.freePhotosText.textContent = result.freePhotos + ' photo' + (result.freePhotos > 1 ? 's' : '') + ' offerte' + (result.freePhotos > 1 ? 's' : '') + ' !';
    } else {
      els.freePhotos.hidden = true;
    }

    // Price with animation
    animateUpdate(els.prixTotal, formatCurrency(result.prix));

    // Reduction
    if (result.reduction && result.reduction !== 0) {
      els.reductionRow.classList.remove('price-card__row--hidden');
      els.reductionValue.textContent = formatCurrency(result.reduction);
    } else {
      els.reductionRow.classList.add('price-card__row--hidden');
    }

    // Remaining
    animateUpdate(els.remainingValue, formatCurrency(result.remaining));

    // Photo sup
    if (result.photoSup === null) {
      els.photoSupValue.textContent = 'Offert';
      els.photoSupValue.style.color = '#2d8a56';
    } else {
      els.photoSupValue.textContent = formatCurrency(result.photoSup);
      els.photoSupValue.style.color = '';
    }

    // Inclus
    els.inclusText.textContent = result.inclus;

    // Mensualités
    const mensualiteStr = formatCurrencyShort(result.mensualite);
    els.monthAmounts.forEach((el) => {
      el.textContent = mensualiteStr;
    });

    // Staggered animation on month cards
    els.monthCards.forEach((card, i) => {
      card.style.animation = 'none';
      card.offsetHeight; // reflow
      card.style.animation = `fadeSlideIn 0.3s var(--ease) ${i * 0.05}s both`;
    });
  }

  function animateUpdate(el, newText) {
    if (el.textContent !== newText) {
      el.classList.add('price-updating');
      el.textContent = newText;
      setTimeout(() => el.classList.remove('price-updating'), 400);
    }
  }

  // ---- Slider progress ----
  function updateSliderProgress() {
    const min = parseInt(els.slider.min);
    const max = parseInt(els.slider.max);
    const val = parseInt(els.slider.value);
    const progress = ((val - min) / (max - min)) * 100;
    els.slider.style.setProperty('--progress', progress + '%');

    // Update tick positions
    const ticks = $$('.photo-selector__tick');
    const tierStarts = [15, 25, 35];
    ticks.forEach((tick, i) => {
      const pos = ((tierStarts[i] - min) / (max - min)) * 100;
      tick.style.left = pos + '%';
      // Hide ticks that are beyond max
      tick.style.display = tierStarts[i] <= max ? '' : 'none';
    });
  }

  // ---- Event Handlers ----
  function setFormula(formula) {
    state.formula = formula;

    // Update toggle UI
    els.toggleBtns.forEach((btn) => {
      btn.classList.toggle('toggle__btn--active', btn.dataset.formula === formula);
    });
    els.toggleWrap.classList.toggle('toggle--produits', formula === 'produits');

    // Adjust slider max
    const maxPhotos = formula === 'numerique' ? 52 : 44;
    els.slider.max = maxPhotos;
    if (state.photoCount > maxPhotos) {
      state.photoCount = maxPhotos;
    }

    render();
  }

  function setPhotoCount(count) {
    const max = parseInt(els.slider.max);
    const min = parseInt(els.slider.min);
    state.photoCount = Math.max(min, Math.min(max, count));
    render();
  }

  // ---- Init ----
  function init() {
    cacheElements();

    // Toggle buttons
    els.toggleBtns.forEach((btn) => {
      btn.addEventListener('click', () => setFormula(btn.dataset.formula));
    });

    // Slider
    els.slider.addEventListener('input', () => {
      setPhotoCount(parseInt(els.slider.value));
    });

    // +/- buttons
    els.btnMinus.addEventListener('click', () => setPhotoCount(state.photoCount - 1));
    els.btnPlus.addEventListener('click', () => setPhotoCount(state.photoCount + 1));

    // Keyboard on +/- for accessibility
    [els.btnMinus, els.btnPlus].forEach((btn) => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    // Initial render
    updateSliderProgress();
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
