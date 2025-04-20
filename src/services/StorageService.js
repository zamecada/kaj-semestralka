/**
 * Služba pro ukládání dat aplikace
 * Poskytuje abstrakci nad localStorage s možností budoucího rozšíření na IndexedDB
 */
export class StorageService {
    /**
     * Vytvoří novou instanci storage služby
     * @param {string} namespace Namespace pro oddělení dat v úložišti
     */
    constructor(namespace = 'formbuilder') {
      this.namespace = namespace;
    }
    
    /**
     * Uloží formulář do úložiště
     * @param {Object} form Data formuláře
     * @returns {Promise<boolean>} Úspěch operace
     */
    async saveForm(form) {
      try {
        // Uložení do seznamu všech formulářů
        const forms = await this.getAllForms();
        const formIndex = forms.findIndex(f => f.id === form.id);
        
        if (formIndex !== -1) {
          forms[formIndex] = form;
        } else {
          forms.push(form);
        }
        
        // Uložení všech formulářů
        localStorage.setItem(`${this.namespace}_forms`, JSON.stringify(forms));
        
        // Uložení jednotlivého formuláře pro rychlejší přístup
        localStorage.setItem(`${this.namespace}_form_${form.id}`, JSON.stringify(form));
        
        return true;
      } catch (error) {
        console.error('Error saving form to storage:', error);
        throw new Error('Failed to save form');
      }
    }
    
    /**
     * Načte formulář z úložiště podle ID
     * @param {string} formId ID formuláře
     * @returns {Promise<Object|null>} Data formuláře nebo null
     */
    async getFormById(formId) {
      try {
        // Nejprve zkusíme načíst přímo (efektivnější)
        const formJson = localStorage.getItem(`${this.namespace}_form_${formId}`);
        if (formJson) {
          return JSON.parse(formJson);
        }
        
        // Pokud nejde načíst přímo, hledáme v seznamu formulářů
        const forms = await this.getAllForms();
        const form = forms.find(f => f.id === formId);
        return form || null;
      } catch (error) {
        console.error('Error loading form from storage:', error);
        return null;
      }
    }
    
    /**
     * Získá všechny formuláře z úložiště
     * @returns {Promise<Array>} Seznam formulářů
     */
    async getAllForms() {
      try {
        const formsJson = localStorage.getItem(`${this.namespace}_forms`);
        return formsJson ? JSON.parse(formsJson) : [];
      } catch (error) {
        console.error('Error loading forms from storage:', error);
        return [];
      }
    }
    
    /**
     * Uloží odpověď do formuláře
     * @param {string} formId ID formuláře
     * @param {Object} response Data odpovědi
     * @returns {Promise<boolean>} Úspěch operace
     */
    async saveResponse(formId, response) {
      try {
        const form = await this.getFormById(formId);
        if (!form) {
          throw new Error(`Form with ID ${formId} not found`);
        }
        
        // Přidání odpovědi
        form.responses = form.responses || [];
        form.responses.push({
          ...response,
          submittedAt: new Date().toISOString()
        });
        
        // Uložení aktualizovaného formuláře
        return this.saveForm(form);
      } catch (error) {
        console.error('Error saving response:', error);
        throw error;
      }
    }
    
    /**
     * Smaže formulář z úložiště
     * @param {string} formId ID formuláře k odstranění
     * @returns {Promise<boolean>} Úspěch operace
     */
    async deleteForm(formId) {
      try {
        // Odstranění z jednotlivých formulářů
        localStorage.removeItem(`${this.namespace}_form_${formId}`);
        
        // Odstranění ze seznamu formulářů
        const forms = await this.getAllForms();
        const updatedForms = forms.filter(f => f.id !== formId);
        localStorage.setItem(`${this.namespace}_forms`, JSON.stringify(updatedForms));
        
        return true;
      } catch (error) {
        console.error('Error deleting form:', error);
        throw error;
      }
    }
    
    /**
     * Vyčistí všechna data z úložiště
     * @returns {Promise<boolean>} Úspěch operace
     */
    async clearAllData() {
      try {
        // Projít klíče a odstranit jen ty, které patří do našeho namespace
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith(this.namespace)) {
            localStorage.removeItem(key);
          }
        }
        return true;
      } catch (error) {
        console.error('Error clearing storage:', error);
        throw error;
      }
    }
    
    /**
     * Kontrola dostupnosti úložiště
     * @returns {Promise<boolean>} Je úložiště dostupné?
     */
    async isStorageAvailable() {
      try {
        const testKey = `${this.namespace}_test`;
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    }
  }