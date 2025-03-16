/**
 * Header component - zobrazuje navigační lištu a logo
 * @module components/header
 */

/**
 * Vyrenderuje HTML kód pro header
 * @param {Object} options - Nastavení headeru
 * @param {string} options.activePage - ID aktivní stránky pro zvýraznění v menu
 * @return {string} HTML kód headeru
 */
export const renderHeader = (options = {}) => {
    const { activePage = '' } = options;
    
    return `
      <header>
          <div class="container">
              <div class="logo">
                  <h1>FormBuilder</h1>
              </div>
              <nav>
                  <ul>
                      <li><a href="/" class="${activePage === 'home' ? 'active' : ''}">Domů</a></li>
                      <li><a href="/#features" class="${activePage === 'features' ? 'active' : ''}">Funkce</a></li>
                      <li><a href="/#how-it-works" class="${activePage === 'how-it-works' ? 'active' : ''}">Jak to funguje</a></li>
                  </ul>
              </nav>
          </div>
      </header>
    `;
  };
  
  /**
   * Vloží header do DOM
   * @param {HTMLElement} targetElement - Element, do kterého se vloží header
   * @param {Object} options - Nastavení headeru
   */
  export const mountHeader = (targetElement, options = {}) => {
    if (!targetElement) {
      throw new Error('Target element is required to mount header');
    }
    targetElement.insertAdjacentHTML('afterbegin', renderHeader(options));
  };
  
  export default { renderHeader, mountHeader };