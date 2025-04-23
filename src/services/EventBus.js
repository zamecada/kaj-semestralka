/**
 * EventBus pro komunikaci mezi komponentami aplikace
 * Implementuje vzor pub/sub (publisher/subscriber)
 */
export class EventBus {
    constructor() {
      this.events = {};
    }
    
    /**
     * Přihlásí callback k odběru události
     * @param {string} event Název události
     * @param {Function} callback Funkce, která se má zavolat
     * @returns {Function} Funkce pro odhlášení odběru
     */
    subscribe(event, callback) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      
      this.events[event].push(callback);
      
      // Vrací funkci pro odhlášení
      return () => {
        this.events[event] = this.events[event].filter(cb => cb !== callback);
        
        // Vyčistíme pole, pokud je prázdné
        if (this.events[event].length === 0) {
          delete this.events[event];
        }
      };
    }
    
    /**
     * Zveřejní událost všem odběratelům
     * @param {string} event Název události
     * @param {any} data Data k předání odběratelům
     */
    publish(event, data) {
      if (!this.events[event]) {
        return;
      }
      
      this.events[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
    
    /**
     * Odebere všechny odběratele dané události
     * @param {string} event Název události
     */
    clear(event) {
      if (event) {
        delete this.events[event];
      } else {
        this.events = {};
      }
    }
  }