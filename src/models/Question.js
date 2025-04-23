/**
 * Model reprezentující otázku ve formuláři
 */
import { generateID } from '../services/Utils.js';

export class Question {
  /**
   * Vytvoří novou instanci otázky
   * @param {string} type Typ otázky (text, radio, checkbox)
   * @param {Object} data Inicializační data
   */
  constructor(type, data = {}) {
    this.id = data.id || generateID();
    this.type = type;
    this.title = data.title || '';
    this.required = data.required || false;
    
    // Nastavení výchozích možností podle typu
    if (type === 'text') {
      this.options = data.options || [];
    } else {
      // Pro radio a checkbox, defaultně dvě prázdné možnosti
      this.options = data.options || ['', ''];
    }
  }
  
  /**
   * Přidá novou možnost
   * @returns {Question} Instance pro řetězení
   */
  addOption() {
    if (this.type !== 'text') {
      this.options.push('');
    }
    return this;
  }
  
  /**
   * Odstraní možnost
   * @param {number} index Index možnosti k odstranění
   * @returns {Question} Instance pro řetězení
   */
  removeOption(index) {
    if (this.type !== 'text' && this.options.length > 2) {
      this.options.splice(index, 1);
    }
    return this;
  }
  
  /**
   * Aktualizuje text možnosti
   * @param {number} index Index možnosti
   * @param {string} text Nový text možnosti
   * @returns {Question} Instance pro řetězení
   */
  updateOption(index, text) {
    if (this.type !== 'text' && index >= 0 && index < this.options.length) {
      this.options[index] = text;
    }
    return this;
  }
  
  /**
   * Validuje otázku
   * @returns {boolean} Je otázka validní?
   */
  validate() {
    if (!this.title.trim()) {
      return false;
    }
    
    if (this.type !== 'text' && this.options.some(opt => !opt.trim())) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Vrátí reprezentaci modelu jako prostý objekt
   * @returns {Object} Data otázky
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      required: this.required,
      options: this.options
    };
  }
  
  /**
   * Vytvoří instanci otázky z JSON dat
   * @param {Object|string} json JSON objekt nebo řetězec
   * @returns {Question} Instance otázky
   */
  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    return new Question(data.type, data);
  }
  
  /**
   * Vytvoří otázku typu text
   * @param {Object} data Inicializační data
   * @returns {Question} Instance otázky typu text
   */
  static createText(data = {}) {
    return new Question('text', data);
  }
  
  /**
   * Vytvoří otázku typu radio (jedna možnost)
   * @param {Object} data Inicializační data
   * @returns {Question} Instance otázky typu radio
   */
  static createRadio(data = {}) {
    return new Question('radio', data);
  }
  
  /**
   * Vytvoří otázku typu checkbox (více možností)
   * @param {Object} data Inicializační data
   * @returns {Question} Instance otázky typu checkbox
   */
  static createCheckbox(data = {}) {
    return new Question('checkbox', data);
  }
}