import { mountHeader } from './header.js';
import { mountFooter } from './footer.js';

document.addEventListener('DOMContentLoaded', () => {
    // Vloží header do kontejneru
    const headerContainer = document.getElementById('header-container');
    mountHeader(headerContainer);
    
    // Vloží footer do kontejneru
    const footerContainer = document.getElementById('footer-container');
    mountFooter(footerContainer);
});