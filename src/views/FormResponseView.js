/**
 * View pro zobrazení a vyplnění formuláře
 */
import { sanitizeInput } from '../services/Utils.js';

export class FormResponseView {
  /**
   * Vytvoří novou instanci FormResponseView
   * @param {HTMLElement} container Element, do kterého se bude renderovat
   */
  constructor(container) {
    this.container = container;
    this.form = null;
    this.formElement = document.getElementById('response-form');
    this.formTitle = document.getElementById('form-title');
    this.formDescription = document.getElementById('form-description');
    this.questionsContainer = document.getElementById('questions-container');
    this.submitButton = this.formElement ? this.formElement.querySelector('button[type="submit"]') : null;
    
    // Reference na callback pro odeslání formuláře
    this.submitHandler = null;
    
    // Inicializace view
    this._init();
  }
  
  /**
   * Inicializuje view
   * @private
   */
  _init() {
    if (this.formElement) {
      this.formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (this.submitHandler) {
          this.submitHandler();
        }
      });
    }
  }
  
  /**
   * Binduje handler pro odeslání formuláře
   * @param {Function} handler Handler pro odeslání
   */
  bindSubmitForm(handler) {
    this.submitHandler = handler;
  }
  
  /**
   * Renderuje formulář
   * @param {Object} formData Data formuláře
   */
  renderForm(formData) {
    this.form = formData;
    
    // Nastavení titulku a popisu
    if (this.formTitle) {
      this.formTitle.textContent = formData.title;
      document.title = `${formData.title} | FormBuilder`;
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
    div.dataset.questionId = question.id;
    
    // Přidání hlavičky otázky
    const titleHtml = `<h3>${question.title} ${question.required ? '<span style="color: #f44336;">*</span>' : ''}</h3>`;
    div.innerHTML = `<div class="form-group">${titleHtml}`;
    
    // Vykreslení podle typu otázky
    switch(question.type) {
      case 'text':
        div.innerHTML += `
          <input 
            type="text" 
            class="form-control"
            name="${question.id}" 
            placeholder="Vaše odpověď"
            ${question.required ? 'required' : ''}
          >
        `;
        break;
      case 'radio':
        let radioHtml = '<div class="radio-group">';
        question.options.forEach(option => {
          radioHtml += `
            <div class="radio-option">
              <input 
                type="radio" 
                name="${question.id}" 
                value="${sanitizeInput(option)}"
                ${question.required ? 'required' : ''}
              > 
              <span>${option}</span>
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
              <input 
                type="checkbox" 
                name="${question.id}" 
                value="${sanitizeInput(option)}"
              > 
              <span>${option}</span>
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
   * Validuje vyplněný formulář
   * @returns {boolean} Je formulář validní?
   */
  validateForm() {
    let isValid = true;
    
    // Validace povinných otázek
    this.form.questions.forEach(question => {
      if (question.required) {
        const inputs = document.querySelectorAll(`[name="${question.id}"]`);
        
        if (question.type === 'text') {
          if (!inputs[0].value.trim()) {
            isValid = false;
            this._highlightError(inputs[0], 'Toto pole je povinné');
          }
        } else if (question.type === 'radio' || question.type === 'checkbox') {
          const checked = Array.from(inputs).some(input => input.checked);
          if (!checked) {
            isValid = false;
            const questionDiv = inputs[0].closest('.question-card');
            this._highlightError(questionDiv, 'Vyberte prosím alespoň jednu možnost');
          }
        }
      }
    });
    
    return isValid;
  }
  
  /**
   * Zvýrazní element s chybou
   * @param {HTMLElement} element Element k zvýraznění
   * @param {string} message Chybová zpráva
   * @private
   */
  _highlightError(element, message) {
    // Přidat třídu pro zvýraznění chyby
    element.classList.add('error');
    
    // Přidat zprávu o chybě
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = '#f44336';
    errorMessage.style.fontSize = '0.9rem';
    errorMessage.style.marginTop = '5px';
    
    // Vložit zprávu po elementu
    const parent = element.closest('.form-group');
    if (parent && !parent.querySelector('.error-message')) {
      parent.appendChild(errorMessage);
    }
    
    // Odstranit zvýraznění po změně hodnoty
    element.addEventListener('input', function() {
      element.classList.remove('error');
      const msg = parent.querySelector('.error-message');
      if (msg) parent.removeChild(msg);
    });
  }
  
  /**
   * Sbírá odpovědi z formuláře
   * @returns {Object} Odpovědi
   */
  collectResponses() {
    const responses = {};
    
    this.form.questions.forEach(question => {
      const inputs = document.querySelectorAll(`[name="${question.id}"]`);
      
      if (question.type === 'text') {
        responses[question.id] = sanitizeInput(inputs[0].value.trim());
      } else if (question.type === 'radio') {
        const selected = Array.from(inputs).find(input => input.checked);
        responses[question.id] = selected ? selected.value : null;
      } else if (question.type === 'checkbox') {
        responses[question.id] = Array.from(inputs)
          .filter(input => input.checked)
          .map(input => input.value);
      }
    });
    
    return responses;
  }
  
  /**
   * Zobrazí dialog o úspěšném odeslání
   */
  showSubmitSuccess() {
    const dialog = document.getElementById('form-submitted-dialog');
    if (dialog) {
      dialog.style.display = 'flex';
      
      // Přidání událostí tlačítkům v dialogu
      const submitAnotherBtn = document.getElementById('submit-another-btn');
      const closeDialogBtn = document.getElementById('close-dialog-btn');
      
      if (submitAnotherBtn) {
        submitAnotherBtn.addEventListener('click', () => {
          dialog.style.display = 'none';
          if (this.formElement) {
            this.formElement.reset();
          }
        });
      }
      
      if (closeDialogBtn) {
        closeDialogBtn.addEventListener('click', () => {
          dialog.style.display = 'none';
        });
      }
    }
  }
  
  /**
   * Zobrazí chybu
   * @param {string} title Titulek chyby
   * @param {string} message Text chyby
   */
  showError(title, message) {
    const container = this.container.querySelector('.form-container');
    if (container) {
      container.innerHTML = `
        <div class="form-group" style="text-align: center; padding: 50px 0;">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f44336; margin-bottom: 20px;"></i>
          <h3>${title}</h3>
          <p>${message}</p>
        </div>
      `;
    }
  }
}