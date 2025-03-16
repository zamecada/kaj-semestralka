import { mountHeader } from './header.js';

document.addEventListener('DOMContentLoaded', () => {
    // Vloží header do kontejneru
    const headerContainer = document.getElementById('header-container');
    mountHeader(headerContainer, { 
        activePage: 'home' // Nastav podle aktuální stránky
    });
    
    // Tady můžeš inicializovat další komponenty (footer atd.)
});