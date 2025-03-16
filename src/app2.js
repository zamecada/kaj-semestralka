/**
 * Hlavní soubor aplikace
 */

import { mountHeader } from './components/header.js';
import { mountFooter } from './components/footer.js';

/**
 * Inicializuje aplikaci - vloží společné prvky a detekuje aktuální stránku
 */
const initApp = () => {
  // Vložení headeru a footeru
  mountHeader(document.body, { activePage: getCurrentPage() });
  mountFooter(document.body);
  
  // Inicializace konkrétní stránky
  initCurrentPage();
};

/**
 * Vrátí identifikátor aktuální stránky
 * @return {string} ID stránky
 */
const getCurrentPage = () => {
  const path = window.location.pathname;
  
  if (path.includes('form-builder')) {
    return 'form-builder';
  } else if (path.includes('form-view')) {
    return 'form-view';
  } else if (path.includes('form-admin')) {
    return 'form-admin';
  } else {
    return 'home';
  }
};

/**
 * Inicializuje moduly potřebné pro aktuální stránku
 */
const initCurrentPage = async () => {
  const currentPage = getCurrentPage();
  
  switch (currentPage) {
    case 'form-builder':
      // Dynamický import modulu pro generátor formulářů
      const { default: FormGenerator } = await import('./modules/formGenerator.js');
      new FormGenerator();
      break;
    
    case 'form-view':
      // Dynamický import