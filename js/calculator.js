// Calculator — Expérience Boudoir Toulouse
(function () {
  'use strict';

  var state = {
    formula: 'numerique',
    photoCount: 10,
    photoSup: 1,
    caution: 0,
    reduction: 150,
    months: 6
  };

  function $(id) { return document.getElementById(id); }
  function fmt(v) {
    return v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }
  function fmtShort(v) {
    return v.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
  }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function updateSlider(slider) {
    var min = parseFloat(slider.min), max = parseFloat(slider.max), val = parseFloat(slider.value);
    var pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
    slider.style.setProperty('--progress', pct + '%');
  }

  function calculate() {
    var table = state.formula === 'numerique' ? PRICING_NUMERIQUE : PRICING_PRODUITS;
    var min = state.formula === 'numerique' ? 8 : 7;
    var max = state.formula === 'numerique' ? 52 : 44;
    var billed = clamp(state.photoCount - state.photoSup, min, max);
    var data = table[billed];
    if (!data) return null;
    var initial = data.prix;
    var restant = Math.max(0, initial - state.caution - state.reduction);
    var mensualite = state.months > 0 ? restant / state.months : restant;
    var tier = getTier(state.photoCount);
    return { initial: initial, restant: restant, mensualite: mensualite, inclus: data.inclus, tier: tier };
  }

  var prevTier = null;

  function flash(el) {
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }

  function render() {
    var r = calculate();
    if (!r) return;

    // Tier animation
    var tierEl = $('tier-name');
    if (prevTier !== r.tier.name) {
      tierEl.classList.add('changing');
      setTimeout(function () {
        tierEl.textContent = r.tier.name;
        $('tier-tagline').textContent = r.tier.tagline;
        tierEl.classList.remove('changing');
      }, 180);
      prevTier = r.tier.name;
    }

    // Values display
    $('photos-value').textContent = state.photoCount;
    $('sup-value').textContent = state.photoSup;
    $('caution-value').textContent = fmtShort(state.caution);
    $('reduction-value').textContent = '-' + fmtShort(state.reduction);
    $('months-value').textContent = state.months;

    // Sliders sync
    $('photos-slider').value = state.photoCount;
    $('reduction-slider').value = state.reduction;
    $('sup-slider').value = state.photoSup;
    $('caution-slider').value = state.caution;
    updateSlider($('photos-slider'));
    updateSlider($('reduction-slider'));
    updateSlider($('sup-slider'));
    updateSlider($('caution-slider'));

    // Results
    var irEl = $('invest-restant');
    var newIR = fmt(r.restant);
    if (irEl.textContent !== newIR) { irEl.textContent = newIR; flash(irEl); }

    var iiEl = $('invest-initial');
    iiEl.textContent = fmt(r.initial);

    var maEl = $('mensualite-amount');
    var newMA = fmt(r.mensualite);
    if (maEl.textContent !== newMA) { maEl.textContent = newMA; flash(maEl); }

    $('inclus-text').textContent = r.inclus;

    // Free photos badge
    var badge = $('free-badge');
    if (state.photoSup > 0) {
      badge.style.display = '';
      $('free-badge-text').textContent = state.photoSup + ' photo' + (state.photoSup > 1 ? 's' : '') + ' offerte' + (state.photoSup > 1 ? 's' : '') + ' !';
    } else {
      badge.style.display = 'none';
    }
  }

  function bindStepper(minusId, plusId, sliderId, key, step, minVal, maxVal) {
    $(minusId).addEventListener('click', function () {
      state[key] = clamp(state[key] - step, minVal, maxVal);
      render();
    });
    $(plusId).addEventListener('click', function () {
      state[key] = clamp(state[key] + step, minVal, maxVal);
      render();
    });
    if (sliderId) {
      $(sliderId).addEventListener('input', function () {
        state[key] = parseFloat(this.value);
        render();
      });
    }
  }

  function init() {
    // Toggle
    var toggleBtns = document.querySelectorAll('.toggle__btn');
    var toggleWrap = document.querySelector('.toggle');
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.formula = btn.dataset.formula;
        toggleBtns.forEach(function (b) {
          b.classList.toggle('toggle__btn--active', b.dataset.formula === state.formula);
        });
        toggleWrap.classList.toggle('toggle--produits', state.formula === 'produits');
        var min = state.formula === 'numerique' ? 8 : 7;
        var max = state.formula === 'numerique' ? 52 : 44;
        $('photos-slider').min = min;
        $('photos-slider').max = max;
        state.photoCount = clamp(state.photoCount, min, max);
        render();
      });
    });

    // Steppers
    bindStepper('btn-photos-minus', 'btn-photos-plus', 'photos-slider', 'photoCount', 1, 7, 52);
    bindStepper('btn-reduction-minus', 'btn-reduction-plus', 'reduction-slider', 'reduction', 10, 0, 1000);
    bindStepper('btn-sup-minus', 'btn-sup-plus', 'sup-slider', 'photoSup', 1, 0, 10);
    bindStepper('btn-caution-minus', 'btn-caution-plus', 'caution-slider', 'caution', 50, 0, 2000);
    bindStepper('btn-months-minus', 'btn-months-plus', null, 'months', 1, 1, 24);

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
