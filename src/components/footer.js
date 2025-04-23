/**
 * Footer component - zobrazuje patičku stránky
 * @module components/footer
 */

/**
 * Vyrenderuje HTML kód pro footer
 * @param {Object} options - Nastavení footeru
 * @param {number} options.year - Rok pro copyright (defaultně aktuální rok)
 * @return {string} HTML kód footeru
 */
export const renderFooter = (options = {}) => {
    const { year = new Date().getFullYear() } = options;
    
    return `
      <footer>
          <div class="container">
              <p>&copy; ${year} FormBuilder - Semestrální práce KAJ</p>
              <p>Autor: Adam Zámečník</p>
          </div>
      </footer>
    `;
  };
  
  /**
   * Vloží footer do DOM
   * @param {HTMLElement} targetElement - Element, do kterého se vloží footer
   * @param {Object} options - Nastavení footeru
   */
  export const mountFooter = (targetElement, options = {}) => {
    if (!targetElement) {
      throw new Error('Target element is required to mount footer');
    }
    targetElement.insertAdjacentHTML('beforeend', renderFooter(options));
  };
  
  export default { renderFooter, mountFooter };