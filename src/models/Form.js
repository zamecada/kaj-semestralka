/**
 * Model reprezentující formulář
 */
import { generateID } from '../utils.js';

export class Form {
  /**
   * Vytvoří novou instanci formuláře
   * @param {Object} data Inicializační data formuláře
   */
  constructor(data = {}) {
    this.id = data.id || generateID();
    this.title = data.title || '';
    this.description = data.description || '';
    this.questions = data.questions || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.pin = data.pin || this._generatePIN();
    this.responses = data.responses || [];
    
    // Validační flag
    this._isValid = null;
  }
  
  /**
   * Generuje 4-místný PIN pro administraci
   * @returns {string} PIN
   * @private
   */
  _generatePIN() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
  
  /**
   * Přidá novou otázku do formuláře
   * @param {Object} question Otázka k přidání
   * @returns {Form} Instance formuláře pro řetězení
   */
  addQuestion(question) {
    // Reset validace při změně
    this._isValid = null;
    
    this.questions.push(question);
    return this;
  }
  
  /**
   * Odstraní otázku z formuláře
   * @param {string} questionId ID otázky k odstranění
   * @returns {Form} Instance formuláře pro řetězení
   */
  removeQuestion(questionId) {
    // Reset validace při změně
    this._isValid = null;
    
    this.questions = this.questions.filter(q => q.id !== questionId);
    return this;
  }
  
  /**
   * Aktualizuje vlastnosti otázky
   * @param {string} questionId ID otázky k aktualizaci
   * @param {Object} props Nové vlastnosti
   * @returns {Form} Instance formuláře pro řetězení
   */
  updateQuestion(questionId, props) {
    // Reset validace při změně
    this._isValid = null;
    
    const index = this.questions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      this.questions[index] = { ...this.questions[index], ...props };
    }
    return this;
  }
  
  /**
   * Přidá novou odpověď do formuláře
   * @param {Object} responseData Data odpovědi
   * @returns {Form} Instance formuláře pro řetězení
   */
  addResponse(responseData) {
    const response = {
      ...responseData,
      submittedAt: new Date().toISOString()
    };
    
    this.responses.push(response);
    return this;
  }
  
  /**
   * Validuje formulář před uložením
   * @returns {boolean} Je formulář validní?
   */
  validate() {
    // Cache výsledku validace
    if (this._isValid !== null) return this._isValid;
    
    // Validace titulku
    if (!this.title.trim()) {
      this._isValid = false;
      return false;
    }
    
    // Validace otázek
    if (this.questions.length === 0) {
      this._isValid = false;
      return false;
    }
    
    // Kontrola všech otázek
    for (const question of this.questions) {
      if (!question.title.trim()) {
        this._isValid = false;
        return false;
      }
      
      if ((question.type === 'radio' || question.type === 'checkbox') && 
          question.options.some(opt => !opt.trim())) {
        this._isValid = false;
        return false;
      }
    }
    
    this._isValid = true;
    return true;
  }
  
  /**
   * Vrátí reprezentaci modelu jako prostý objekt
   * @returns {Object} Data formuláře
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      questions: this.questions,
      createdAt: this.createdAt,
      pin: this.pin,
      responses: this.responses
    };
  }
  
  /**
   * Vytvoří instanci formuláře z JSON dat
   * @param {Object|string} json JSON objekt nebo řetězec
   * @returns {Form} Instance formuláře
   */
  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    return new Form(data);
  }
}