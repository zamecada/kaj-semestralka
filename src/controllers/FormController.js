/**
 * Controller pro správu formuláře
 */
import { Form } from '../models/form.js';
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
    // Posloucháme události v aplikaci
    this.eventBus.subscribe('form:title-change', this._handleTitleChange.bind(this));
    this.eventBus.subscribe('form:description-change', this._handleDescriptionChange.bind(this));
    
    // Kontrola, zda je načítán existující formulář
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('id');
    
    if (formId) {
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
        }
      } catch (error) {
        console.error('Error loading form:', error);
      }
    }
  }
  
  /**
   * Propojí view s handlery
   * @private
   */
  _bindViewHandlers() {
    this.view.bindAddQuestion(this._handleAddQuestion.bind(this));
    this.view.bindRemoveQuestion(this._handleRemoveQuestion.bind(this));
    this.view.bindUpdateQuestion(this._handleUpdateQuestion.bind(this));
    this.view.bindAddOption(this._handleAddOption.bind(this));
    this.view.bindRemoveOption(this._handleRemoveOption.bind(this));
    this.view.bindUpdateOption(this._handleUpdateOption.bind(this));
    this.view.bindSaveForm(this._handleSaveForm.bind(this));
    this.view.bindPreviewForm(this._handlePreviewForm.bind(this));
  }
  
  /**
   * Handler pro změnu titulku formuláře
   * @param {string} title Nový titulek
   * @private
   */
  _handleTitleChange(title) {
    this.form.title = title;
  }
  
  /**
   * Handler pro změnu popisu formuláře
   * @param {string} description Nový popis
   * @private
   */
  _handleDescriptionChange(description) {
    this.form.description = description;
  }
  
  /**
   * Handler pro přidání otázky
   * @param {string} type Typ otázky
   * @private
   */
  _handleAddQuestion(type) {
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
    // Aktualizace v modelu
    this.form.updateQuestion(questionId, props);
  }
  
  /**
   * Handler pro přidání možnosti
   * @param {string} questionId ID otázky
   * @private
   */
  _handleAddOption(questionId) {
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
      this.view.showSaveError(error);
    }
  }
  
  /**
   * Handler pro náhled formuláře
   * @private
   */
  _handlePreviewForm() {
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