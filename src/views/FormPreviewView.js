// src/views/FormPreviewView.js
/**
 * View pro náhled formuláře
 */
import { sanitizeInput } from '../services/Utils.js';
import { App } from '../AppModule.js';

export class FormPreviewView {
  /**
   * Vytvoří novou instanci FormPreviewView
   * @param {HTMLElement} container Element, do kterého se bude renderovat
   */
  constructor(container) {
    this.container = container;
    this.formTitle = document.getElementById('form-title');
    this.formDescription = document.getElementById('form-description');
    this.questionsContainer = document.getElementById('questions-container');
    this.backButton = document.getElementById('back-to-edit-btn');
    
    // Reference na callback pro návrat do editoru
    this.backToEditHandler = null;
    
    // Inicializace
    this._init();
    
    console.log('FormPreviewView initialized with container:', container);
  }
  
  /**
   * Inicializuje view
   * @private
   */
  _init() {
    // Přidat posluchač události pro tlačítko zpět
    if (this.backButton) {
      this.backButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default behavior
        console.log('Back to edit button clicked');
        if (this.backToEditHandler) {
          this.backToEditHandler();
        } else {
          // Výchozí akce - zavřít okno
          window.close();
        }
      });
    }
  }
  
  /**
   * Binduje handler pro tlačítko zpět
   * @param {Function} handler Handler pro návrat do editoru
   */
  bindBackToEdit(handler) {
    this.backToEditHandler = handler;
  }
  
  /**
   * Renderuje formulář v náhledu
   * @param {Object} formData Data formuláře
   */
  renderForm(formData) {
    console.log('Rendering form in preview:', formData);
    
    // Nastavení titulku a popisu
    if (this.formTitle) {
      this.formTitle.textContent = formData.title;
      document.title = `Náhled: ${formData.title} | FormBuilder`;
    }
    
    if (this.formDescription) {
      this.formDescription.textContent = formData.description || '';
    }
    
    // Vykreslení otázek
    if (this.questionsContainer) {
      this.questionsContainer.innerHTML = '';
      
      formData.questions.forEach(question => {
        const questionElement = this._createQuestionElement(question);
        this.questionsContainer.appendChild(questionElement);
      });
    }
  }
  
  /**
   * Vytvoří element otázky podle typu
   * @param {Object} question Data otázky
   * @returns {HTMLElement} Element otázky
   * @private
   */
  _createQuestionElement(question) {
    const div = document.createElement('div');
    div.className = 'question-card';
    
    // Přidání hlavičky otázky
    const titleHtml = `<h3>${question.title} ${question.required ? '<span style="color: #f44336;">*</span>' : ''}</h3>`;
    div.innerHTML = `<div class="form-group">${titleHtml}`;
    
    // Vykreslení podle typu otázky
    switch(question.type) {
      case 'text':
        div.innerHTML += `
          <input type="text" class="form-control" disabled placeholder="Textová odpověď">
        `;
        break;
      case 'radio':
        let radioHtml = '<div class="radio-group">';
        question.options.forEach(option => {
          radioHtml += `
            <div class="radio-option">
              <input type="radio" disabled> 
              <span>${sanitizeInput(option)}</span>
            </div>
          `;
        });
        radioHtml += '</div>';
        div.innerHTML += radioHtml;
        break;
      case 'checkbox':
        let checkboxHtml = '<div class="checkbox-group" style="display: block;">';
        question.options.forEach(option => {
          checkboxHtml += `
            <div class="checkbox-option" style="margin-bottom: 10px;">
              <input type="checkbox" disabled> 
              <span>${sanitizeInput(option)}</span>
            </div>
          `;
        });
        checkboxHtml += '</div>';
        div.innerHTML += checkboxHtml;
        break;
    }
    
    div.innerHTML += '</div>'; // Uzavření form-group
    return div;
  }
  
  /**
   * Zobrazí chybu při načítání formuláře
   * @param {string} title Titulek chyby
   * @param {string} message Text chyby
   */
  showError(title, message) {
    const container = this.container.querySelector('.form-container');
    if (container) {
      container.innerHTML = `
        <div class="form-group" style="text-align: center; padding: 50px 0;">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f44336; margin-bottom: 20px;"></i>
          <h3>${sanitizeInput(title)}</h3>
          <p>${sanitizeInput(message)}</p>
        </div>
      `;
    }
  }
}