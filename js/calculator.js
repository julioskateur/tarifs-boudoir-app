// Calculator — Expérience Boudoir Toulouse
(function () {
  'use strict';

  // ---- State ----
  const state = {
    formula: 'numerique',
    photoCount: 10,
    photoSup: 1,       // photos offertes
    caution: 0,
    reduction: 150,
    months: 6,
  };

  // ---- DOM refs ----
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const els = {};

  function cacheElements() {
    els.typeBtns = $$('.type-toggle__btn');
    // Photos
    els.photosValue = $('#photos-value');
    els.photosSlider = $('#photos-slider');
    els.btnPhotosMinus = $('#btn-photos-minus');
    els.btnPhotosPlus = $('#btn-photos-plus');
    // Photo Sup
    els.supValue = $('#sup-value');
    els.supSlider = $('#sup-slider');
    els.btnSupMinus = $('#btn-sup-minus');
    els.btnSupPlus = $('#btn-sup-plus');
    // Caution
    els.cautionValue = $('#caution-value');
    els.cautionSlider = $('#caution-slider');
    els.btnCautionMinus = $('#btn-caution-minus');
    els.btnCautionPlus = $('#btn-caution-plus');
    // Réduction
    els.reductionValue = $('#reduction-value');
    els.reductionSlider = $('#reduction-slider');
    els.btnReductionMinus = $('#btn-reduction-minus');
    els.btnReductionPlus = $('#btn-reduction-plus');
    // Months
    els.monthsValue = $('#months-value');
    els.btnMonthsMinus = $('#btn-months-minus');
    els.btnMonthsPlus = $('#btn-months-plus');
    // Results
    els.investInitial = $('#investissement-initial');
    els.investRestant = $('#investissement-restant');
    els.inclusText = $('#inclus-text');
    els.mensualiteAmount = $('#mensualite-amount');
    els.tierName = $('#tier-name');
    els.tierTagline = $('#tier-tagline');
  }

  // ---- Formatting ----
  function fmt(value) {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + ' €';
  }

  // ---- Calculation ----
  function calculate() {
    const table = state.formula === 'numerique' ? PRICING_NUMERIQUE : PRICING_PRODUITS;
    const minPhotos = state.formula === 'numerique' ? 8 : 7;
    const maxPhotos = state.formula === 'numerique' ? 52 : 44;

    // Photos facturées = total - offertes (minimum = min du barème)
    const billedPhotos = Math.max(minPhotos, state.photoCount - state.photoSup);

    // Clamp to available data
    const lookupKey = Math.min(billedPhotos, maxPhotos);
    const data = table[lookupKey];
    if (!data) return null;

    const tier = getTier(state.photoCount);
    const investInitial = data.prix;
    const investRestant = Math.max(0, investInitial - state.caution - state.reduction);
    const mensualite = state.months > 0 ? investRestant / state.months : investRestant;

    return {
      tier,
      investInitial,
      investRestant,
      mensualite,
      inclus: data.inclus,
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

    // Config values
    els.photosValue.textContent = state.photoCount;
    els.supValue.textContent = state.photoSup;
    els.cautionValue.textContent = fmt(state.caution);
    els.reductionValue.textContent = fmt(state.reduction);
    els.monthsValue.textContent = state.months;

    // Sync sliders
    els.photosSlider.value = state.photoCount;
    els.supSlider.value = state.photoSup;
    els.cautionSlider.value = state.caution;
    els.reductionSlider.value = state.reduction;
    updateAllSliders();

    // Results
    animateUpdate(els.investInitial, fmt(result.investInitial));
    animateUpdate(els.investRestant, fmt(result.investRestant));
    animateUpdate(els.mensualiteAmount, fmt(result.mensualite));

    // Inclus
    els.inclusText.textContent = result.inclus;
  }

  function animateUpdate(el, newText) {
    if (el.textContent !== newText) {
      el.classList.add('price-updating');
      el.textContent = newText;
      setTimeout(() => el.classList.remove('price-updating'), 350);
    }
  }

  // ---- Slider progress ----
  function updateSliderProgress(slider) {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const val = parseFloat(slider.value);
    const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
    slider.style.setProperty('--progress', pct + '%');
  }

  function updateAllSliders() {
    [els.photosSlider, els.supSlider, els.cautionSlider, els.reductionSlider].forEach(updateSliderProgress);
  }

  // ---- Event Handlers ----
  function setFormula(formula) {
    state.formula = formula;
    els.typeBtns.forEach((btn) => {
      btn.classList.toggle('type-toggle__btn--active', btn.dataset.formula === formula);
    });

    const minPhotos = formula === 'numerique' ? 8 : 7;
    const maxPhotos = formula === 'numerique' ? 52 : 44;
    els.photosSlider.min = minPhotos;
    els.photosSlider.max = maxPhotos;
    if (state.photoCount > maxPhotos) state.photoCount = maxPhotos;
    if (state.photoCount < minPhotos) state.photoCount = minPhotos;

    render();
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function bindStepper(btnMinus, btnPlus, slider, stateKey, step) {
    const getMin = () => parseFloat(slider.min);
    const getMax = () => parseFloat(slider.max);

    btnMinus.addEventListener('click', () => {
      state[stateKey] = clamp(state[stateKey] - step, getMin(), getMax());
      render();
    });
    btnPlus.addEventListener('click', () => {
      state[stateKey] = clamp(state[stateKey] + step, getMin(), getMax());
      render();
    });
    slider.addEventListener('input', () => {
      state[stateKey] = parseFloat(slider.value);
      render();
    });
  }

  // ---- Init ----
  function init() {
    cacheElements();

    // Type toggle
    els.typeBtns.forEach((btn) => {
      btn.addEventListener('click', () => setFormula(btn.dataset.formula));
    });

    // Steppers with sliders
    bindStepper(els.btnPhotosMinus, els.btnPhotosPlus, els.photosSlider, 'photoCount', 1);
    bindStepper(els.btnSupMinus, els.btnSupPlus, els.supSlider, 'photoSup', 1);
    bindStepper(els.btnCautionMinus, els.btnCautionPlus, els.cautionSlider, 'caution', 10);
    bindStepper(els.btnReductionMinus, els.btnReductionPlus, els.reductionSlider, 'reduction', 10);

    // Months (no slider)
    els.btnMonthsMinus.addEventListener('click', () => {
      state.months = Math.max(1, state.months - 1);
      render();
    });
    els.btnMonthsPlus.addEventListener('click', () => {
      state.months = Math.min(24, state.months + 1);
      render();
    });

    // Initial render
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
