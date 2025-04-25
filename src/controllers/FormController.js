// src/controllers/FormController.js - úprava pro zajištění funkčnosti tlačítek

/**
 * Controller pro správu formuláře
 */
import { Form } from '../models/Form.js';
import { Question } from '../models/Question.js';
import { App } from '../AppModule.js';

export class FormController {
  /**
   * Vytvoří novou instanci FormController
   * @param {FormView} view View pro formulář
   */
  constructor(view) {
    this.view = view;
    this.storageService = App.storageService;
    this.eventBus = App.eventBus;
    
    // Vytvoření nového formuláře
    this.form = new Form();
    
    // Logování pro ověření
    console.log('FormController initialized with view:', view);
    
    // Propojení view s handlery
    this._bindViewHandlers();
    
    // Inicializace
    this._init();
  }
  
  /**
   * Inicializace controlleru
   * @private
   */
  async _init() {
    console.log('Initializing FormController');
    
    // Posloucháme události v aplikaci
    this.eventBus.subscribe('form:title-change', this._handleTitleChange.bind(this));
    this.eventBus.subscribe('form:description-change', this._handleDescriptionChange.bind(this));
    
    // Kontrola, zda je načítán existující formulář
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('id');
    
    if (formId) {
      console.log('Loading existing form with ID:', formId);
      // Načtení existujícího formuláře
      try {
        const formData = await this.storageService.getFormById(formId);
        if (formData) {
          this.form = new Form(formData);
          this.view.updateFormValues(this.form);
          
          // Vykreslení otázek
          this.form.questions.forEach(question => {
            this.view.renderQuestion(new Question(question.type, question));
          });
          
          console.log('Existing form loaded successfully');
        }
      } catch (error) {
        console.error('Error loading form:', error);
      }
    } else {
      console.log('Creating a new form');
    }
  }
  
  /**
   * Propojí view s handlery
   * @private
   */
  _bindViewHandlers() {
    console.log('Binding view handlers');
    
    // Důrazně kontrolujeme, zda view obsahuje požadované metody
    if (!this.view) {
      console.error('View is not defined');
      return;
    }
    
    if (typeof this.view.bindAddQuestion === 'function') {
      this.view.bindAddQuestion(this._handleAddQuestion.bind(this));
    } else {
      console.error('View does not have bindAddQuestion method');
    }
    
    if (typeof this.view.bindRemoveQuestion === 'function') {
      this.view.bindRemoveQuestion(this._handleRemoveQuestion.bind(this));
    } else {
      console.error('View does not have bindRemoveQuestion method');
    }
    
    if (typeof this.view.bindUpdateQuestion === 'function') {
      this.view.bindUpdateQuestion(this._handleUpdateQuestion.bind(this));
    } else {
      console.error('View does not have bindUpdateQuestion method');
    }
    
    if (typeof this.view.bindAddOption === 'function') {
      this.view.bindAddOption(this._handleAddOption.bind(this));
    } else {
      console.error('View does not have bindAddOption method');
    }
    
    if (typeof this.view.bindRemoveOption === 'function') {
      this.view.bindRemoveOption(this._handleRemoveOption.bind(this));
    } else {
      console.error('View does not have bindRemoveOption method');
    }
    
    if (typeof this.view.bindUpdateOption === 'function') {
      this.view.bindUpdateOption(this._handleUpdateOption.bind(this));
    } else {
      console.error('View does not have bindUpdateOption method');
    }
    
    if (typeof this.view.bindSaveForm === 'function') {
      this.view.bindSaveForm(this._handleSaveForm.bind(this));
    } else {
      console.error('View does not have bindSaveForm method');
    }
    
    if (typeof this.view.bindPreviewForm === 'function') {
      this.view.bindPreviewForm(this._handlePreviewForm.bind(this));
    } else {
      console.error('View does not have bindPreviewForm method');
    }
  }
  
  /**
   * Handler pro změnu titulku formuláře
   * @param {string} title Nový titulek
   * @private
   */
  _handleTitleChange(title) {
    console.log('Title changed:', title);
    this.form.title = title;
  }
  
  /**
   * Handler pro změnu popisu formuláře
   * @param {string} description Nový popis
   * @private
   */
  _handleDescriptionChange(description) {
    console.log('Description changed:', description);
    this.form.description = description;
  }
  
  /**
   * Handler pro přidání otázky
   * @param {string} type Typ otázky
   * @private
   */
  _handleAddQuestion(type) {
    console.log('Adding question of type:', type);
    
    // Vytvoření nové instance otázky
    const question = new Question(type);
    
    // Přidání do formuláře
    this.form.addQuestion(question.toJSON());
    
    // Vykreslení v UI
    this.view.renderQuestion(question);
  }
  
  /**
   * Handler pro odstranění otázky
   * @param {string} questionId ID otázky
   * @private
   */
  _handleRemoveQuestion(questionId) {
    console.log('Removing question:', questionId);
    
    // Odstranění z formuláře
    this.form.removeQuestion(questionId);
    
    // Odstranění z UI
    this.view.removeQuestion(questionId);
  }
  
  /**
   * Handler pro aktualizaci otázky
   * @param {string} questionId ID otázky
   * @param {Object} props Nové vlastnosti
   * @private
   */
  _handleUpdateQuestion(questionId, props) {
    console.log('Updating question:', questionId, props);
    
    // Aktualizace v modelu
    this.form.updateQuestion(questionId, props);
  }
  
  /**
   * Handler pro přidání možnosti
   * @param {string} questionId ID otázky
   * @private
   */
  _handleAddOption(questionId) {
    console.log('Adding option to question:', questionId);
    
    // Najít otázku v modelu
    const questionIndex = this.form.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return;
    
    // Vytvoření instance pro manipulaci
    const question = new Question(
      this.form.questions[questionIndex].type,
      this.form.questions[questionIndex]
    );
    
    // Přidání možnosti
    question.addOption();
    
    // Aktualizace v modelu
    this.form.questions[questionIndex] = question.toJSON();
    
    // Aktualizace v UI
    this.view.updateQuestionOptions(question);
  }
  
  /**
   * Handler pro odstranění možnosti
   * @param {string} questionId ID otázky
   * @param {number} optionIndex Index možnosti
   * @private
   */
  _handleRemoveOption(questionId, optionIndex) {
    console.log('Removing option from question:', questionId, optionIndex);
    
    // Najít otázku v modelu
    const questionIndex = this.form.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return;
    
    const question = new Question(
      this.form.questions[questionIndex].type,
      this.form.questions[questionIndex]
    );
    
    // Kontrola minimálního počtu možností
    if (question.options.length <= 2) {
      alert('Otázka musí obsahovat alespoň dvě možnosti.');
      return;
    }
    
    // Odstranění možnosti
    question.removeOption(optionIndex);
    
    // Aktualizace v modelu
    this.form.questions[questionIndex] = question.toJSON();
    
    // Aktualizace v UI
    this.view.updateQuestionOptions(question);
  }
  
  /**
   * Handler pro aktualizaci možnosti
   * @param {string} questionId ID otázky
   * @param {number} optionIndex Index možnosti
   * @param {string} text Nový text možnosti
   * @private
   */
  _handleUpdateOption(questionId, optionIndex, text) {
    console.log('Updating option for question:', questionId, optionIndex, text);
    
    // Najít otázku v modelu
    const questionIndex = this.form.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return;
    
    const question = new Question(
      this.form.questions[questionIndex].type,
      this.form.questions[questionIndex]
    );
    
    // Aktualizace textu možnosti
    question.updateOption(optionIndex, text);
    
    // Aktualizace v modelu
    this.form.questions[questionIndex] = question.toJSON();
  }
  
  /**
   * Handler pro uložení formuláře
   * @private
   */
  async _handleSaveForm() {
    console.log('Saving form:', this.form);
    
    // Validace formuláře
    if (!this.form.validate()) {
      alert('Formulář obsahuje chyby. Zkontrolujte, zda jsou vyplněny všechny povinné údaje.');
      return;
    }
    
    try {
      // Uložení do úložiště
      await this.storageService.saveForm(this.form.toJSON());
      
      // Zobrazení úspěchu
      this.view.showSaveSuccess(this.form.toJSON());
      
      // Publikování události o uložení
      this.eventBus.publish('form:saved', this.form.toJSON());
    } catch (error) {
      console.error('Error saving form:', error);
      this.view.showSaveError(error);
    }
  }
  
  /**
   * Handler pro náhled formuláře
   * @private
   */
  _handlePreviewForm() {
    console.log('Showing form preview');
    
    // Validace formuláře
    if (!this.form.validate()) {
      alert('Formulář obsahuje chyby. Zkontrolujte, zda jsou vyplněny všechny povinné údaje.');
      return;
    }
    
    // Uložení do sessionStorage pro náhled
    sessionStorage.setItem('form_preview', JSON.stringify(this.form.toJSON()));
    
    // Otevření náhledu v novém okně
    window.open('/src/views/preview.html', '_blank');
  }
}