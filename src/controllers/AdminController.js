/**
 * Controller pro administraci formuláře
 */
import { App } from '../AppModule.js';
import { formatDate } from '../services/Utils.js';

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
		
		// Nastavení odkazu pro respondenty
		const respondentLink = document.getElementById('respondent-link');
		const openFormLink = document.getElementById('open-form-link');
		
		if (respondentLink) {
			const formUrl = `${window.location.origin}/src/views/form.html?id=${this.formId}`;
			respondentLink.value = formUrl;
			
			// Přidání funkcionality kopírování
			const copyBtn = document.querySelector('.copy-btn[data-target="respondent-link"]');
			if (copyBtn) {
				copyBtn.addEventListener('click', () => {
					import('../services/Utils.js').then(utils => {
						const success = utils.copyToClipboard(respondentLink.value);
						if (success) {
							// Vizuální potvrzení
							const originalText = copyBtn.innerHTML;
							copyBtn.innerHTML = '<i class="fas fa-check"></i>';
							setTimeout(() => {
								copyBtn.innerHTML = originalText;
							}, 2000);
						}
					});
				});
			}
			
			// Nastavení URL pro otevření formuláře
			if (openFormLink) {
				openFormLink.href = formUrl;
			}
		}
		
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
		
		try {
		  console.log('Starting CSV export with data:', this.formData);
		  
		  // Začneme vytvořením řádků pro CSV
		  const rows = [];
		  
		  // Přidání hlavičky CSV
		  const headerRow = ["#", "Datum"];
		  this.formData.questions.forEach(question => {
			headerRow.push(question.title);
		  });
		  rows.push(headerRow);
		  
		  // Přidání dat
		  this.formData.responses.forEach((response, index) => {
			const rowData = [
			  (index + 1).toString(),
			  formatDate(response.submittedAt)
			];
			
			this.formData.questions.forEach(question => {
			  // Získání odpovědi s podporou pro různé struktury dat
			  let answer = null;
			  
			  if (response[question.id] !== undefined) {
				answer = response[question.id];
			  } else if (response.answers && response.answers[question.id] !== undefined) {
				answer = response.answers[question.id];
			  }
			  
			  // Formátování odpovědí pro CSV
			  let formattedAnswer = '';
			  if (answer === null || answer === undefined) {
				formattedAnswer = '';
			  } else if (Array.isArray(answer)) {
				formattedAnswer = answer.join(', ');
			  } else {
				formattedAnswer = answer.toString();
			  }
			  
			  rowData.push(formattedAnswer);
			});
			
			rows.push(rowData);
		  });
		  
		  // Funkce pro escapování hodnot v CSV
		  const escapeCSV = (value) => {
			if (value === null || value === undefined) return '';
			value = value.toString();
			// Pokud hodnota obsahuje čárky, uvozovky nebo nové řádky, obalíme ji uvozovkami
			if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
			  // Zdvojnásobení uvozovek uvnitř řetězce dle CSV standardu
			  return `"${value.replace(/"/g, '""')}"`;
			}
			return value;
		  };
		  
		  // Převedení řádků na CSV řetězec
		  const csvString = rows.map(row => row.map(escapeCSV).join(',')).join('\r\n');
		  
		  console.log('Generated CSV content preview:', csvString.substring(0, 200) + '...');
		  
		  // Vytvoření Blob a generování stažení
		  const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
		  const url = URL.createObjectURL(blob);
		  
		  // Vytvoření odkazu pro stažení
		  const link = document.createElement('a');
		  link.href = url;
		  link.setAttribute('download', `${this.formData.title}_odpovedi.csv`);
		  document.body.appendChild(link);
		  
		  // Kliknutí na odkaz a jeho odstranění
		  link.click();
		  
		  // Čištění
		  document.body.removeChild(link);
		  URL.revokeObjectURL(url);
		  
		  console.log('CSV export completed successfully');
		  
		  // Publikování události o exportu
		  this.eventBus.publish('admin:responsesExported', {
			formId: this.formId,
			responseCount: this.formData.responses.length
		  });
		} catch (error) {
		  console.error('Error during CSV export:', error);
		  alert('Při exportu dat došlo k chybě. Podrobnosti najdete v konzoli prohlížeče.');
		}
	}
}