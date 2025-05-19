const primaryHeader = document.querySelector(".primary-header");
const navToggle = document.querySelector(".mobile-nav-toggle");
const primaryNav = document.querySelector(".primary-navigation");

// Deals with the mobile nav toggle
if (navToggle && primaryNav && primaryHeader) {
  navToggle.addEventListener('click', () => {
    primaryNav.hasAttribute('data-visible')
      ? navToggle.setAttribute('aria-expanded', false)
      : navToggle.setAttribute('aria-expanded', true)
    primaryNav.toggleAttribute("data-visible");
    primaryHeader.toggleAttribute("data-overlay");
  });
}

// Deals with the settings toggle
const settingsToggle = document.querySelector(".website-settings-toggle");
const settings = document.querySelector(".settings");

if (settingsToggle && settings && primaryHeader) {
  settingsToggle.addEventListener('click', () => {
    settings.hasAttribute('data-visible')
      ? settingsToggle.setAttribute('aria-expanded', false)
      : settingsToggle.setAttribute('aria-expanded', true)
    settings.toggleAttribute("data-visible");
    primaryHeader.toggleAttribute("data-overlay");
  });
}

// Deals with the darkmode toggle
let darkMode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');
const checkBox = document.getElementById('checkboxToggle');

const enableDarkmode = () => {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');
}

const disableDarkmode = () => {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', null);
}

if (darkMode === "active") enableDarkmode()

function myFunction() {
  themeSwitch.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkmode')
    darkMode !== "active"
      ? enableDarkmode()
      : disableDarkmode()
  });
}

// The following code was obtained from https://stackoverflow.com/a/76801544

// Function to save checkbox states to Local Storage
function saveCheckboxStates() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    localStorage.setItem(checkbox.id, checkbox.checked);
  });
}

// Function to load checkbox states from Local Storage
function loadCheckboxStates() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    const savedState = localStorage.getItem(checkbox.id);
    if (savedState !== null) {
      checkbox.checked = savedState === 'true';
    }
  });
}

// Attach event listener to the checkboxes to save their states
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', saveCheckboxStates);
});

// Load checkbox states on page load
document.addEventListener('DOMContentLoaded', loadCheckboxStates);

/**
 * jQuery segment of code that handles making the photographs zoom in function
 * This code was obtained from https://stackoverflow.com/a/50430187
*/

$('img[data-enlargeable]').addClass('img-enlargeable').click(function () {
  var src = $(this).attr('src');
  var modal;

  function removeModal() {
    modal.remove();
    $('body').off('keyup.modal-close');
  }
  modal = $('<div>').css({
    background: 'RGBA(0,0,0,.8) url(' + src + ') no-repeat center',
    backgroundSize: 'contain',
    width: '100%',
    height: '100%',
    position: 'fixed',
    zIndex: '10000',
    top: '0',
    left: '0',
    cursor: 'zoom-out'
  }).click(function () {
    removeModal();
  }).appendTo('body');
  //handling ESC
  $('body').on('keyup.modal-close', function (e) {
    if (e.key === 'Escape') {
      removeModal();
    }
  });
});

/**
 * Handles language selection within the website.
 */

const defaultLang = 'en';
const supportedLangs = ['en', 'es', 'tl'];
let currentLang = localStorage.getItem('lang') || defaultLang;

async function loadTranslations(lang) {
  try {
    const resp = await fetch(`lang/${lang}.json`);
    return await resp.json();
  } catch (err) {
    console.error('i18n load error:', err);
    return {};
  }
}

function applyTranslations(trans) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const parts = key.split('.');
    const text = parts.reduce((o, k) => (o || {})[k], trans);
    if (text) el.textContent = text;
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  document.documentElement.lang = currentLang;

  const translations = await loadTranslations(currentLang);
  applyTranslations(translations);

  const sel = document.getElementById('language-select');
  if (sel) {
    sel.value = currentLang;
    sel.addEventListener('change', async e => {
      const newLang = e.target.value;
      if (!supportedLangs.includes(newLang)) return;

      localStorage.setItem('lang', newLang);
      document.documentElement.lang = newLang;
      const newTrans = await loadTranslations(newLang);
      applyTranslations(newTrans);
    });
  }
});
