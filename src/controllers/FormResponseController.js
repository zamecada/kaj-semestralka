/**
 * Controller pro zobrazení a vyplnění formuláře
 */
import { App } from '../AppModule.js';

export class FormResponseController {
  /**
   * Vytvoří novou instanci FormResponseController
   * @param {FormResponseView} view View pro zobrazení formuláře
   */
  constructor(view) {
    this.view = view;
    this.storageService = App.storageService;
    this.eventBus = App.eventBus;
    this.formData = null;
    
    // Propojení view s handlery
    this.view.bindSubmitForm(this._handleSubmitForm.bind(this));
    
    // Inicializace
    this._init();
  }
  
  /**
   * Inicializace controlleru
   * @private
   */
  async _init() {
    // Získání ID formuláře z URL
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('id');
    
    if (!formId) {
      this.view.showError(
        'Neplatný odkaz na formulář', 
        'Odkaz na tento formulář není platný. Zkontrolujte, zda jste použili správný odkaz.'
      );
      return;
    }
    
    try {
      // Načtení dat formuláře
      this.formData = await this.storageService.getFormById(formId);
      
      if (!this.formData) {
        this.view.showError(
          'Formulář nebyl nalezen', 
          'Požadovaný formulář neexistuje nebo byl odstraněn.'
        );
        return;
      }
      
      // Vykreslení formuláře
      this.view.renderForm(this.formData);
      
      // Publikování události o načtení formuláře
      this.eventBus.publish('formResponse:loaded', this.formData);
    } catch (error) {
      console.error('Error loading form:', error);
      this.view.showError(
        'Chyba při načítání formuláře', 
        'Nepodařilo se načíst formulář. Zkuste to prosím znovu později.'
      );
    }
  }
  
  /**
   * Handler pro odeslání formuláře
   * @private
   */
  async _handleSubmitForm() {
    // Validace formuláře
    if (!this.view.validateForm()) {
      return;
    }
    
    // Sbírání odpovědí
    const responses = this.view.collectResponses();
    
    try {
      // Uložení odpovědi
      await this.storageService.saveResponse(this.formData.id, {
        answers: responses,
        submittedAt: new Date().toISOString()
      });
      
      // Zobrazení úspěchu
      this.view.showSubmitSuccess();
      
      // Publikování události o odeslání odpovědi
      this.eventBus.publish('formResponse:submitted', {
        formId: this.formData.id,
        responses
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Nepodařilo se odeslat formulář. Zkuste to prosím znovu.');
    }
  }
}