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

  // ---- Helpers ----
  function $(id) { return document.getElementById(id); }
  function fmt(v) {
    return v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  // ---- Build photo dropdown ----
  function buildPhotosSelect() {
    var sel = $('photos-select');
    var min = state.formula === 'numerique' ? 8 : 7;
    var max = state.formula === 'numerique' ? 52 : 44;
    sel.innerHTML = '';
    for (var i = min; i <= max; i++) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      if (i === state.photoCount) opt.selected = true;
      sel.appendChild(opt);
    }
  }

  // ---- Calculate ----
  function calculate() {
    var table = state.formula === 'numerique' ? PRICING_NUMERIQUE : PRICING_PRODUITS;
    var min = state.formula === 'numerique' ? 8 : 7;
    var max = state.formula === 'numerique' ? 52 : 44;

    // Photos facturées = total - offertes
    var billed = clamp(state.photoCount - state.photoSup, min, max);
    var data = table[billed];
    if (!data) return null;

    var initial = data.prix;
    var restant = Math.max(0, initial - state.caution - state.reduction);
    var mensualite = state.months > 0 ? restant / state.months : restant;
    var tier = getTier(state.photoCount);

    return {
      initial: initial,
      restant: restant,
      mensualite: mensualite,
      inclus: data.inclus,
      tier: tier
    };
  }

  // ---- Render ----
  function flash(el) {
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }

  function render() {
    var r = calculate();
    if (!r) return;

    // Config display
    $('sup-value').textContent = state.photoSup;
    $('caution-value').textContent = fmt(state.caution);
    $('reduction-value').textContent = fmt(state.reduction);
    $('months-value').textContent = state.months;

    // Results
    var iiEl = $('invest-initial');
    var newII = fmt(r.initial);
    if (iiEl.textContent !== newII) { iiEl.textContent = newII; flash(iiEl); }

    var irEl = $('invest-restant');
    var newIR = fmt(r.restant);
    if (irEl.textContent !== newIR) { irEl.textContent = newIR; flash(irEl); }

    var maEl = $('mensualite-amount');
    var newMA = fmt(r.mensualite);
    if (maEl.textContent !== newMA) { maEl.textContent = newMA; flash(maEl); }

    $('inclus-text').textContent = r.inclus;
    $('tier-name').textContent = r.tier.name;
  }

  // ---- Events ----
  function init() {
    buildPhotosSelect();
    render();

    // Type select
    $('type-select').addEventListener('change', function () {
      state.formula = this.value;
      var min = state.formula === 'numerique' ? 8 : 7;
      var max = state.formula === 'numerique' ? 52 : 44;
      state.photoCount = clamp(state.photoCount, min, max);
      buildPhotosSelect();
      render();
    });

    // Photos select
    $('photos-select').addEventListener('change', function () {
      state.photoCount = parseInt(this.value);
      render();
    });

    // Photo Sup stepper
    $('btn-sup-minus').addEventListener('click', function () {
      state.photoSup = clamp(state.photoSup - 1, 0, 10);
      render();
    });
    $('btn-sup-plus').addEventListener('click', function () {
      state.photoSup = clamp(state.photoSup + 1, 0, 10);
      render();
    });

    // Caution stepper
    $('btn-caution-minus').addEventListener('click', function () {
      state.caution = clamp(state.caution - 50, 0, 2000);
      render();
    });
    $('btn-caution-plus').addEventListener('click', function () {
      state.caution = clamp(state.caution + 50, 0, 2000);
      render();
    });

    // Réduction stepper
    $('btn-reduction-minus').addEventListener('click', function () {
      state.reduction = clamp(state.reduction - 10, 0, 1000);
      render();
    });
    $('btn-reduction-plus').addEventListener('click', function () {
      state.reduction = clamp(state.reduction + 10, 0, 1000);
      render();
    });

    // Months stepper
    $('btn-months-minus').addEventListener('click', function () {
      state.months = clamp(state.months - 1, 1, 24);
      render();
    });
    $('btn-months-plus').addEventListener('click', function () {
      state.months = clamp(state.months + 1, 1, 24);
      render();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
