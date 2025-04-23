/**
 * Controller pro náhled formuláře
 */
import { App } from '../AppModule.js';
import { Form } from '../models/Form.js';

export class FormPreviewController {
  /**
   * Vytvoří novou instanci FormPreviewController
   * @param {FormPreviewView} view View pro náhled formuláře
   */
  constructor(view) {
    this.view = view;
    this.eventBus = App.eventBus;
    
    // Propojení view s handlery
    this.view.bindBackToEdit(this._handleBackToEdit.bind(this));
    
    // Inicializace
    this._init();
  }
  
  /**
   * Inicializace controlleru
   * @private
   */
  _init() {
    // Získání dat formuláře ze session storage
    try {
      const formDataStr = sessionStorage.getItem('form_preview');
      
      if (!formDataStr) {
        this.view.showError(
          'Nepodařilo se načíst data formuláře',
          'Zkuste se vrátit zpět a znovu zobrazit náhled.'
        );
        return;
      }
      
      const formData = JSON.parse(formDataStr);
      const form = new Form(formData);
      
      // Vykreslení formuláře
      this.view.renderForm(form);
      
      // Publikování události o načtení náhledu
      this.eventBus.publish('formPreview:loaded', form);
    } catch (error) {
      console.error('Error loading preview form:', error);
      this.view.showError(
        'Chyba při načítání náhledu',
        'Nepodařilo se načíst náhled formuláře. Zkuste to prosím znovu.'
      );
    }
  }
  
  /**
   * Handler pro návrat do editoru
   * @private
   */
  _handleBackToEdit() {
    // Standardní akce - zavřít okno náhledu
    window.close();
  }
}