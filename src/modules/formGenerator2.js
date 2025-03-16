/**
 * Form Generator Module - modul pro vytváření formulářů
 * @module modules/formGenerator2
 */

import { createTextQuestion, createRadioQuestion, createCheckboxQuestion } from '../templates/questionTemplates.js';
import { saveForm } from './formStorage.js';

/**
 * Form Generator - třída pro správu generátoru formulářů
 */
export default class formGenerator2 {
  /**
   * Vytvoří novou instanci FormGenerator
   * @param {Object} options - Nastavení generátoru
   * @param {string} options.containerSelector - CSS selektor pro kontejner formuláře
   */
  constructor(options = {}) {
    const { 
      containerSelector = '#questions-container',
      formTitleSelector = '#form-title',
      formDescriptionSelector = '#form-description',
      addQuestionButtonSelector = '#add-question-btn',
      questionTypesMenuSelector = '#question-types-menu',
      saveFormButtonSelector = '#save-form-btn',
      previewFormButtonSelector = '#preview-form-btn',
      formCreatedDialogSelector = '#form-created-dialog'
    } = options;
    
    // DOM elementy
    this.container = document.querySelector(containerSelector);
    this.formTitle = document.querySelector(formTitleSelector);
    this.formDescription = document.querySelector(formDescriptionSelector);
    this.addQuestionBtn = document.querySelector(addQuestionButtonSelector);
    this.questionTypesMenu = document.querySelector(questionTypesMenuSelector);
    this.saveFormBtn = document.querySelector(saveFormButtonSelector);
    this.previewFormBtn = document.querySelector(previewFormButtonSelector);
    this.formCreatedDialog = document.querySelector(formCreatedDialogSelector);
    
    // Data
    this.questions = [];
    
    // Inicializace
    this.init();
  }
  
  /**
   * Inicializuje generátor formulářů
   */
  init() {
    if (!this.container) {
      console.error('FormGenerator: Container element not found');
      return;
    }
    
    this.bindEvents();
  }
  
  /**
   * Přidá event listenery na interaktivní prvky
   */
  bindEvents() {
    // Zobrazení menu typů otázek
    this.addQuestionBtn?.addEventListener('click', this.toggleQuestionTypesMenu.bind(this));
    
    // Výběr typu otázky
    this.questionTypesMenu?.addEventListener('click', this.handleQuestionTypeSelect.bind(this));
    
    // Globální listenery pro dynamické prvky
    document.addEventListener('click', this.handleGlobalClick.bind(this));
    
    // Uložení formuláře
    this.saveFormBtn?.addEventListener('click', this.handleSaveForm.bind(this));
    
    // Náhled formuláře
    this.previewFormBtn?.addEventListener('click', this.handlePreviewForm.bind(this));
  }
  
  /**
   * Přepíná zobrazení menu typů otázek
   * @param {Event} event - Event objekt
   */
  toggleQuestionTypesMenu(event) {
    event.preventDefault();
    const isVisible = this.questionTypesMenu.style.display !== 'none';
    this.questionTypesMenu.style.display = isVisible ? 'none' : 'block';
  }
  
  /**
   * Zpracovává výběr typu otázky
   * @param {Event} event - Event objekt
   */
  handleQuestionTypeSelect(event) {
    const questionType = event.target.closest('.question-type');
    if (!questionType) return;
    
    const type = questionType.dataset.type;
    this.addQuestion(type);
    this.questionTypesMenu.style.display = 'none';
  }
  
  /**
   * Zpracovává globální kliknutí pro delegaci eventů
   * @param {Event} event - Event objekt
   */
  handleGlobalClick(event) {
    // Kliknutí mimo menu typů otázek
    if (!event.target.closest('#question-types-menu') && 
        !event.target.closest('#add-question-btn')) {
      this.questionTypesMenu.style.display = 'none';
    }
    
    // Smazání otázky
    if (event.target.closest('.delete-question')) {
      this.handleDeleteQuestion(event);
    }
    
    // Přidání možnosti
    if (event.target.closest('.add-option-btn')) {
      this.handleAddOption(event);
    }
    
    // Smazání možnosti
    if (event.target.closest('.delete-option')) {
      this.handleDeleteOption(event);
    }
    
    // Kopírování odkazu
    if (event.target.closest('.copy-btn')) {
      this.handleCopyLink(event);
    }
  }
  
  /**
   * Přidá novou otázku do formuláře
   * @param {string} type - Typ otázky (text, radio, checkbox)
   */
  addQuestion(type) {
    let questionHtml = '';
    
    switch (type) {
      case 'text':
        questionHtml = createTextQuestion();
        break;
      case 'radio':
        questionHtml = createRadioQuestion();
        break;
      case 'checkbox':
        questionHtml = createCheckboxQuestion();
        break;
      default:
        console.error('Unknown question type:', type);
        return;
    }
    
    this.container.insertAdjacentHTML('beforeend', questionHtml);
  }
  
  /**
   * Zpracovává smazání otázky
   * @param {Event} event - Event objekt
   */
  handleDeleteQuestion(event) {
    const questionCard = event.target.closest('.question-card');
    if (questionCard) {
      // Animace před odstraněním
      questionCard.style.opacity = '0';
      questionCard.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        questionCard.remove();
      }, 300);
    }
  }
  
  /**
   * Zpracovává přidání možnosti k otázce
   * @param {Event} event - Event objekt
   */
  handleAddOption(event) {
    event.preventDefault();
    const questionCard = event.target.closest('.question-card');
    const optionsContainer = questionCard.querySelector('.options-container');
    
    const newOption = document.createElement('div');
    newOption.className = 'option-item';
    newOption.innerHTML = `
      <input type="text" class="form-control option-text" placeholder="Nová možnost">
      <button class="btn-icon delete-option"><i class="fas fa-times"></i></button>
    `;
    
    optionsContainer.appendChild(newOption);
    
    // Zaměření nového pole
    newOption.querySelector('input').focus();
  }
  
  /**
   * Zpracovává smazání možnosti
   * @param {Event} event - Event objekt
   */
  handleDeleteOption(event) {
    const optionItem = event.target.closest('.option-item');
    const optionsContainer = optionItem.parentElement;
    
    // Minimálně 2 možnosti musí zůstat
    if (optionsContainer.children.length <= 2) {
      alert('Otázka musí mít alespoň dvě možnosti.');
      return;
    }
    
    optionItem.remove();
  }
  
  /**
   * Zpracovává kopírování odkazu
   * @param {Event} event - Event objekt
   */
  handleCopyLink(event) {
    const button = event.target.closest('.copy-btn');
    const targetId = button.dataset.target;
    const input = document.getElementById(targetId);
    
    input.select();
    document.execCommand('copy');
    
    // Změna ikonky pro potvrzení
    const icon = button.querySelector('i');
    const originalClass = icon.className;
    
    icon.className = 'fas fa-check';
    setTimeout(() => {
      icon.className = originalClass;
    }, 1500);
  }
  
  /**
   * Zpracovává uložení formuláře
   * @param {Event} event - Event objekt
   */
  handleSaveForm(event) {
    event.preventDefault();
    
    // Validace
    if (!this.validateForm()) {
      return;
    }
    
    // Získání dat formuláře
    const formData = this.getFormData();
    
    // Uložení formuláře
    const savedForm = saveForm(formData);
    
    // Zobrazení dialogu s odkazy
    this.showFormCreatedDialog(savedForm);
  }
  
  /**
   * Validuje formulář před uložením
   * @return {boolean} Je formulář validní?
   */
  validateForm() {
    if (!this.formTitle.value.trim()) {
      alert('Prosím zadejte název formuláře.');
      this.formTitle.focus();
      return false;
    }
    
    if (this.container.children.length === 0) {
      alert('Formulář musí obsahovat alespoň jednu otázku.');
      return false;
    }
    
    // Validace jednotlivých otázek
    const questions = this.container.querySelectorAll('.question-card');
    for (const question of questions) {
      const title = question.querySelector('.question-title').value.trim();
      if (!title) {
        alert('Všechny otázky musí mít zadaný text.');
        question.querySelector('.question-title').focus();
        return false;
      }
      
      // Validace možností u radio a checkbox otázek
      const type = question.dataset.questionType;
      if (type === 'radio' || type === 'checkbox') {
        const options = question.querySelectorAll('.option-text');
        for (const option of options) {
          if (!option.value.trim()) {
            alert('Všechny možnosti musí být vyplněné.');
            option.focus();
            return false;
          }
        }
      }
    }
    
    return true;
  }
  
  /**
   * Získá data formuláře
   * @return {Object} Data formuláře
   */
  getFormData() {
    const formData = {
      title: this.formTitle.value.trim(),
      description: this.formDescription.value.trim(),
      questions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Získání otázek
    const questionElements = this.container.querySelectorAll('.question-card');
    questionElements.forEach(element => {
      const questionData = {
        id: element.dataset.questionId,
        type: element.dataset.questionType,
        title: element.querySelector('.question-title').value.trim(),
        required: element.querySelector('.question-required').checked
      };
      
      // Získání možností u radio a checkbox otázek
      if (questionData.type === 'radio' || questionData.type === 'checkbox') {
        questionData.options = [];
        const optionElements = element.querySelectorAll('.option-text');
        optionElements.forEach(optionElement => {
          questionData.options.push(optionElement.value.trim());
        });
      }
      
      formData.questions.push(questionData);
    });
    
    return formData;
  }
  
  /**
   * Zpracovává zobrazení náhledu formuláře
   * @param {Event} event - Event objekt
   */
  handlePreviewForm(event) {
    event.preventDefault();
    
    // Validace
    if (!this.validateForm()) {
      return;
    }
    
    // Získání dat formuláře
    const formData = this.getFormData();
    
    // Dočasné uložení dat pro náhled
    sessionStorage.setItem('formPreview', JSON.stringify(formData));
    
    // Otevření náhledu v novém okně
    window.open('/pages/form-preview.html', '_blank');
  }
  
  /**
   * Zobrazí dialog s odkazy po vytvoření formuláře
   * @param {Object} form - Data uloženého formuláře
   */
  showFormCreatedDialog(form) {
    // Naplnění polí s odkazy
    document.getElementById('respondent-link').value = `${window.location.origin}/form/${form.id}`;
    document.getElementById('admin-link').value = `${window.location.origin}/admin/${form.id}`;
    document.getElementById('admin-pin').value = form.adminPin;
    
    // Nastavení odkazů na tlačítka
    document.getElementById('go-to-form-btn').href = `/form/${form.id}`;
    document.getElementById('go-to-admin-btn').href = `/admin/${form.id}`;
    
    // Zobrazení dialogu
    this.formCreatedDialog.style.display = 'block';
    
    // Animace
    setTimeout(() => {
      this.formCreatedDialog.querySelector('.dialog-content').style.opacity = '1';
      this.formCreatedDialog.querySelector('.dialog-content').style.transform = 'translateY(0)';
    }, 10);
  }
}