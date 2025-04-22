/**
 * Controller pro administraci formuláře
 */
import { App } from '../AppModule.js';
import { formatDate } from '../utils.js';

export class AdminController {
  /**
   * Vytvoří novou instanci AdminController
   * @param {AdminView} view View pro administraci
   */
  constructor(view) {
    this.view = view;
    this.storageService = App.storageService;
    this.eventBus = App.eventBus;
    this.formId = null;
    this.formData = null;
    
    // Propojení view s handlery
    this.view.bindVerifyPin(this._handleVerifyPin.bind(this));
    this.view.bindExportResponses(this._handleExportResponses.bind(this));
    
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
    this.formId = urlParams.get('id');
    
    if (!this.formId) {
      this.view.showError(
        'Neplatný odkaz na formulář', 
        'Odkaz na administraci není platný. Zkontrolujte, zda jste použili správný odkaz.'
      );
      return;
    }
    
    try {
      // Načtení dat formuláře
      this.formData = await this.storageService.getFormById(this.formId);
      
      if (!this.formData) {
        this.view.showError(
          'Formulář nebyl nalezen', 
          'Požadovaný formulář neexistuje nebo byl odstraněn.'
        );
        return;
      }
      
      // Publikování události o načtení formuláře
      this.eventBus.publish('admin:formLoaded', this.formData);
    } catch (error) {
      console.error('Error loading form:', error);
      this.view.showError(
        'Chyba při načítání formuláře', 
        'Nepodařilo se načíst formulář. Zkuste to prosím znovu později.'
      );
    }
  }
  
  /**
   * Handler pro ověření PINu
   * @param {string} pin Zadaný PIN
   * @private
   */
  _handleVerifyPin(pin) {
    if (!this.formData) {
      return;
    }
    
    // Ověření PINu
    if (pin === this.formData.pin) {
      // Zobrazení dashboardu
      this.view.showDashboard(this.formData);
      
      // Publikování události o úspěšném přihlášení
      this.eventBus.publish('admin:loggedIn', {
        formId: this.formId
      });
    } else {
      // Zobrazení chyby
      this.view.showPinError();
      
      // Publikování události o neúspěšném přihlášení
      this.eventBus.publish('admin:loginFailed', {
        formId: this.formId
      });
    }
  }
  
  /**
   * Handler pro export odpovědí
   * @private
   */
  _handleExportResponses() {
    if (!this.formData || !this.formData.responses || this.formData.responses.length === 0) {
      alert('Nejsou k dispozici žádné odpovědi k exportu.');
      return;
    }
    
    // Příprava dat pro export do CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Přidání hlavičky CSV
    let header = ["#", "Datum"];
    this.formData.questions.forEach(question => {
      header.push(question.title);
    });
    csvContent += header.join(",") + "\r\n";
    
    // Přidání dat
    this.formData.responses.forEach((response, index) => {
      let row = [(index + 1), formatDate(response.submittedAt)];
      
      this.formData.questions.forEach(question => {
        // Podpora pro původní i novou strukturu odpovědí
        const answer = response[question.id] || 
                      (response.answers ? response.answers[question.id] : null);
                      
        if (answer === null || answer === undefined) {
          row.push("");
        } else if (Array.isArray(answer)) {
          row.push(`"${answer.join(', ')}"`);
        } else {
          // Escapování uvozovek v CSV
          row.push(`"${answer.toString().replace(/"/g, '""')}"`);
        }
      });
      
      csvContent += row.join(",") + "\r\n";
    });
    
    // Vytvoření odkazu pro stažení
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${this.formData.title}_odpovedi.csv`);
    document.body.appendChild(link);
    
    // Kliknutí na odkaz a jeho odstranění
    link.click();
    document.body.removeChild(link);
    
    // Publikování události o exportu
    this.eventBus.publish('admin:responsesExported', {
      formId: this.formId,
      responseCount: this.formData.responses.length
    });
  }
}