// src/AppModule.js
/**
 * Hlavní modul aplikace pro inicializaci a správu služeb
 */
import { StorageService } from './services/StorageService.js';
import { EventBus } from './services/EventBus.js';

class AppModule {
  constructor() {
    // Inicializace služeb
    this.eventBus = new EventBus();
    this.storageService = new StorageService('formbuilder');
    
    // Připravíme prostor pro další služby a kontrolery
    this.controllers = {};
  }
  
  /**
   * Vrátí instanci AppModule (singleton)
   */
  static getInstance() {
    if (!AppModule.instance) {
      AppModule.instance = new AppModule();
    }
    return AppModule.instance;
  }
}

// Exportujeme singleton instanci
export const App = AppModule.getInstance();

// Také přidáme do window pro globální dostupnost
window.App = App;