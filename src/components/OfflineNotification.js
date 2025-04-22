/**
 * Komponenta pro zobrazení notifikace o offline režimu
 */
import { App } from '../AppModule.js';

export class OfflineNotification {
  constructor() {
    this.element = null;
    this.visible = false;
    this.storageService = App.storageService;
    
    // Inicializace
    this._init();
  }
  
  /**
   * Inicializuje notifikaci
   * @private
   */
  _init() {
    // Vytvoření elementu
    this.element = document.createElement('div');
    this.element.className = 'offline-notification';
    this.element.style.display = 'none';
    this.element.style.position = 'fixed';
    this.element.style.bottom = '20px';
    this.element.style.right = '20px';
    this.element.style.backgroundColor = '#f44336';
    this.element.style.color = 'white';
    this.element.style.padding = '15px 20px';
    this.element.style.borderRadius = '8px';
    this.element.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    this.element.style.zIndex = '1000';
    this.element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    this.element.style.transform = 'translateY(100px)';
    this.element.style.opacity = '0';
    
    // Přidání ikony a textu
    this.element.innerHTML = `
      <div style="display: flex; align-items: center;">
        <i class="fas fa-wifi" style="margin-right: 10px;"></i>
        <span>Jste offline. Data budou uložena lokálně.</span>
      </div>
    `;
    
    // Přidání do DOM
    document.body.appendChild(this.element);
    
    // Přidání posluchačů pro stav připojení
    this.removeListeners = this.storageService.addConnectionListeners(
      () => this.hide(),
      () => this.show()
    );
  }
  
  /**
   * Zobrazí notifikaci
   */
  show() {
    if (this.visible) return;
    
    this.element.style.display = 'block';
    // Použití setTimeout pro spuštění animace po přidání do DOM
    setTimeout(() => {
      this.element.style.transform = 'translateY(0)';
      this.element.style.opacity = '1';
    }, 10);
    
    this.visible = true;
  }
  
  /**
   * Skryje notifikaci
   */
  hide() {
    if (!this.visible) return;
    
    this.element.style.transform = 'translateY(100px)';
    this.element.style.opacity = '0';
    
    // Po dokončení animace skrýt element
    setTimeout(() => {
      this.element.style.display = 'none';
    }, 300);
    
    this.visible = false;
  }
  
  /**
   * Odstraní notifikaci a posluchače
   */
  destroy() {
    if (this.removeListeners) {
      this.removeListeners();
    }
    
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}