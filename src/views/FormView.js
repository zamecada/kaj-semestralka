// src/views/FormView.js - úprava pro zajištění funkčnosti tlačítek

/**
 * View pro renderování a interakci s formulářem
 */
import { sanitizeInput } from '../services/Utils.js';
import { App } from '../AppModule.js';

export class FormView {
	/**
	 * Vytvoří novou instanci FormView
	 * @param {HTMLElement} container Element, do kterého se bude renderovat
	 */
	constructor(container) {
	this.container = container;
	this.questionTypes = {
		text: 'Textová odpověď',
		radio: 'Výběr jedné možnosti',
		checkbox: 'Zaškrtávací pole (více možností)'
	};

	// Reference na callbacky pro události
	this.handlers = {
		addQuestion: null,
		removeQuestion: null,
		updateQuestion: null,
		updateQuestionTitle: null,
		updateQuestionRequired: null,
		addOption: null,
		removeOption: null,
		updateOption: null,
		saveForm: null,
		previewForm: null
	};

	// Inicializace View
	this._initView();

	// Debug log pro ověření inicializace
	console.log('FormView initialized with container:', container);
	}

	/**
	 * Inicializuje prvky View
	 * @private
	 */
	_initView() {
	// Získání referencí na důležité elementy
	this.formTitleInput = document.getElementById('form-title');
	this.formDescriptionInput = document.getElementById('form-description');
	this.questionsContainer = document.getElementById('questions-container');
	this.addQuestionBtn = document.getElementById('add-question-btn');
	this.questionTypesMenu = document.getElementById('question-types-menu');
	this.saveFormBtn = document.getElementById('save-form-btn');
	this.previewFormBtn = document.getElementById('preview-form-btn');

	// Logování pro ověření, že elementy byly nalezeny
	console.log('Form elements found:', {
		formTitleInput: this.formTitleInput,
		formDescriptionInput: this.formDescriptionInput,
		questionsContainer: this.questionsContainer,
		addQuestionBtn: this.addQuestionBtn,
		questionTypesMenu: this.questionTypesMenu,
		saveFormBtn: this.saveFormBtn,
		previewFormBtn: this.previewFormBtn
	});

	// Skryjeme menu typů otázek na začátku
	if (this.questionTypesMenu) {
		this.questionTypesMenu.style.display = 'none';
	}

	// Inicializace posluchačů událostí
	this._setupEventListeners();

	// Publikujeme událost o změně titulku
	if (this.formTitleInput) {
		this.formTitleInput.addEventListener('input', (e) => {
		App.eventBus.publish('form:title-change', e.target.value);
		});
	}

	// Publikujeme událost o změně popisu
	if (this.formDescriptionInput) {
		this.formDescriptionInput.addEventListener('input', (e) => {
		App.eventBus.publish('form:description-change', e.target.value);
		});
	}
	}

	/**
	 * Nastaví posluchače událostí
	 * @private
	 */
	_setupEventListeners() {
	// Zobrazení/skrytí menu typů otázek
	if (this.addQuestionBtn && this.questionTypesMenu) {
		console.log('Setting up question type menu toggle');
		this.addQuestionBtn.addEventListener('click', (e) => {
		e.preventDefault();
		const isVisible = this.questionTypesMenu.style.display === 'block';
		this.questionTypesMenu.style.display = isVisible ? 'none' : 'block';
		console.log('Question type menu toggled:', !isVisible);
		});
		
		// Skrytí menu při kliknutí mimo
		document.addEventListener('click', (e) => {
		if (!e.target.closest('#add-question-btn') && !e.target.closest('#question-types-menu')) {
			this.questionTypesMenu.style.display = 'none';
		}
		});
		
		// Přidání otázky podle vybraného typu
		const questionTypes = this.questionTypesMenu.querySelectorAll('.question-type');
		questionTypes.forEach(typeEl => {
		typeEl.addEventListener('click', (e) => {
			const type = typeEl.dataset.type;
			console.log('Question type selected:', type);
			if (this.handlers.addQuestion) {
			this.handlers.addQuestion(type);
			}
			this.questionTypesMenu.style.display = 'none';
		});
		});
	}

	// Uložení formuláře
	if (this.saveFormBtn) {
		console.log('Setting up save form button');
		this.saveFormBtn.addEventListener('click', (e) => {
		e.preventDefault();
		console.log('Save form button clicked');
		if (this.handlers.saveForm) {
			this.handlers.saveForm();
		}
		});
	}

	// Náhled formuláře
	if (this.previewFormBtn) {
		console.log('Setting up preview form button');
		this.previewFormBtn.addEventListener('click', (e) => {
		e.preventDefault();
		console.log('Preview form button clicked');
		if (this.handlers.previewForm) {
			this.handlers.previewForm();
		}
		});
	}
	}

	/**
	 * Binduje handler pro přidání otázky
	 * @param {Function} handler Callback pro přidání otázky
	 */
	bindAddQuestion(handler) {
		this.handlers.addQuestion = handler;
	}

	/**
	 * Binduje handler pro odstranění otázky
	 * @param {Function} handler Callback pro odstranění otázky
	 */
	bindRemoveQuestion(handler) {
		this.handlers.removeQuestion = handler;
	}

	/**
	 * Binduje handler pro aktualizaci otázky
	 * @param {Function} handler Callback pro aktualizaci otázky
	 */
	bindUpdateQuestion(handler) {
		this.handlers.updateQuestion = handler;
	}

	/**
	 * Binduje handler pro přidání možnosti
	 * @param {Function} handler Callback pro přidání možnosti
	 */
	bindAddOption(handler) {
		this.handlers.addOption = handler;
	}

	/**
	 * Binduje handler pro odstranění možnosti
	 * @param {Function} handler Callback pro odstranění možnosti
	 */
	bindRemoveOption(handler) {
		this.handlers.removeOption = handler;
	}

	/**
	 * Binduje handler pro aktualizaci možnosti
	 * @param {Function} handler Callback pro aktualizaci možnosti
	 */
	bindUpdateOption(handler) {
		this.handlers.updateOption = handler;
	}

	/**
	 * Binduje handler pro uložení formuláře
	 * @param {Function} handler Callback pro uložení formuláře
	 */
	bindSaveForm(handler) {
		this.handlers.saveForm = handler;
	}

	/**
	 * Binduje handler pro náhled formuláře
	 * @param {Function} handler Callback pro náhled formuláře
	 */
	bindPreviewForm(handler) {
		this.handlers.previewForm = handler;
	}

	/**
	 * Renderuje otázku na stránce
	 * @param {Question} question Model otázky
	 */
	renderQuestion(question) {
		const questionElement = document.createElement('div');
		questionElement.className = 'question-card';
		questionElement.dataset.questionId = question.id;

		// Obsah otázky podle typu
		let optionsHtml = '';

		if (question.type === 'radio' || question.type === 'checkbox') {
			const optionsItems = question.options.map((option, index) => `
			<div class="option-item">
				<input type="text" class="form-control option-text" placeholder="Možnost" value="${sanitizeInput(option)}">
				<button class="btn-icon delete-option" data-index="${index}"><i class="fas fa-times"></i></button>
			</div>
			`).join('');
			
			optionsHtml = `
			<div class="options-container">
				${optionsItems}
			</div>
			<button class="btn btn-outline add-option-btn">
				<i class="fas fa-plus"></i> Přidat možnost
			</button>
			`;
		}

		// Sestavení HTML pro otázku
		questionElement.innerHTML = `
			<div class="question-header">
			<h3 class="question-type-label">${this.questionTypes[question.type]}</h3>
			<div class="question-actions">
				<button class="btn-icon delete-question"><i class="fas fa-trash"></i></button>
			</div>
			</div>
			<div class="form-group">
			<label>Text otázky:</label>
			<input type="text" class="form-control question-title" placeholder="Např. Jaký je váš názor?" value="${sanitizeInput(question.title)}">
			</div>
			${optionsHtml}
			<div class="form-group checkbox-group">
			<input type="checkbox" id="required_${question.id}" class="question-required" ${question.required ? 'checked' : ''}>
			<label for="required_${question.id}">Povinná otázka</label>
			</div>
		`;

		// Přidání do DOM
		this.questionsContainer.appendChild(questionElement);

		// Přidání posluchačů událostí pro tuto otázku
		this._setupQuestionListeners(questionElement, question);
	}

	/**
	 * Nastaví posluchače událostí pro otázku
	 * @param {HTMLElement} element Element otázky
	 * @param {Question} question Model otázky
	 * @private
	 */
	_setupQuestionListeners(element, question) {
		// Mazání otázky
		const deleteBtn = element.querySelector('.delete-question');
		if (deleteBtn) {
			deleteBtn.addEventListener('click', () => {
			if (this.handlers.removeQuestion) {
				this.handlers.removeQuestion(question.id);
			}
			});
		}

		// Změna titulku otázky
		const titleInput = element.querySelector('.question-title');
		if (titleInput) {
			titleInput.addEventListener('input', (e) => {
			if (this.handlers.updateQuestion) {
				this.handlers.updateQuestion(question.id, { title: sanitizeInput(e.target.value) });
			}
			});
		}

		// Změna povinnosti otázky
		const requiredCheckbox = element.querySelector('.question-required');
		if (requiredCheckbox) {
			requiredCheckbox.addEventListener('change', (e) => {
			if (this.handlers.updateQuestion) {
				this.handlers.updateQuestion(question.id, { required: e.target.checked });
			}
			});
		}

		// Události pro možnosti (pouze pro radio a checkbox)
		if (question.type === 'radio' || question.type === 'checkbox') {
			// Přidání možnosti
			const addOptionBtn = element.querySelector('.add-option-btn');
			if (addOptionBtn) {
			addOptionBtn.addEventListener('click', () => {
				if (this.handlers.addOption) {
				this.handlers.addOption(question.id);
				}
			});
			}
			
			// Odstranění možnosti
			const deleteOptionBtns = element.querySelectorAll('.delete-option');
			deleteOptionBtns.forEach(btn => {
			btn.addEventListener('click', () => {
				const index = parseInt(btn.dataset.index, 10);
				if (this.handlers.removeOption) {
				this.handlers.removeOption(question.id, index);
				}
			});
			});
			
			// Změna textu možnosti
			const optionInputs = element.querySelectorAll('.option-text');
			optionInputs.forEach((input, index) => {
			input.addEventListener('input', (e) => {
				if (this.handlers.updateOption) {
				this.handlers.updateOption(question.id, index, sanitizeInput(e.target.value));
				}
			});
			});
		}
	}

	/**
	 * Odstraní otázku z DOM
	 * @param {string} questionId ID otázky k odstranění
	 */
	removeQuestion(questionId) {
		const questionElement = this.questionsContainer.querySelector(`[data-question-id="${questionId}"]`);
		if (questionElement) {
			questionElement.remove();
		}
		}

		/**
		 * Aktualizuje možnosti otázky v DOM
		 * @param {Question} question Model otázky
		 */
		updateQuestionOptions(question) {
		if (question.type === 'text') return;

		const questionElement = this.questionsContainer.querySelector(`[data-question-id="${question.id}"]`);
		if (!questionElement) return;

		const optionsContainer = questionElement.querySelector('.options-container');
		if (!optionsContainer) return;

		// Vyčištění a znovu naplnění možnostmi
		optionsContainer.innerHTML = '';

		question.options.forEach((option, index) => {
			const optionItem = document.createElement('div');
			optionItem.className = 'option-item';
			optionItem.innerHTML = `
			<input type="text" class="form-control option-text" placeholder="Možnost" value="${sanitizeInput(option)}">
			<button class="btn-icon delete-option" data-index="${index}"><i class="fas fa-times"></i></button>
			`;
			
			optionsContainer.appendChild(optionItem);
			
			// Přidání posluchačů pro nové možnosti
			const input = optionItem.querySelector('.option-text');
			input.addEventListener('input', (e) => {
			if (this.handlers.updateOption) {
				this.handlers.updateOption(question.id, index, sanitizeInput(e.target.value));
			}
			});
			
			const deleteBtn = optionItem.querySelector('.delete-option');
			deleteBtn.addEventListener('click', () => {
			if (this.handlers.removeOption) {
				this.handlers.removeOption(question.id, index);
			}
			});
		});
	}

	/**
	 * Zobrazí dialog úspěšného uložení formuláře
	 * @param {Object} formData Data formuláře
	 */
	showSaveSuccess(formData) {
		const dialog = document.getElementById('form-created-dialog');
		if (!dialog) return;
		
		// Naplnění odkazů
		const respondentLink = `${window.location.origin}/src/views/form.html?id=${formData.id}`;
		const adminLink = `${window.location.origin}/src/views/admin.html?id=${formData.id}`;
		
		const respondentLinkEl = document.getElementById('respondent-link');
		const adminLinkEl = document.getElementById('admin-link');
		const adminPinEl = document.getElementById('admin-pin');
		
		if (respondentLinkEl) respondentLinkEl.value = respondentLink;
		if (adminLinkEl) adminLinkEl.value = adminLink;
		if (adminPinEl) adminPinEl.value = formData.pin;
		
		// Zobrazení dialogu
		dialog.style.display = 'flex';
		
		// Přidání funkce pro kopírování odkazů
		const copyButtons = dialog.querySelectorAll('.copy-btn');
		copyButtons.forEach(btn => {
			btn.addEventListener('click', () => {
				const targetId = btn.dataset.target;
				const targetInput = document.getElementById(targetId);
				if (targetInput) {
					// Import funkce copyToClipboard
					import('../services/Utils.js').then(utils => {
						const success = utils.copyToClipboard(targetInput.value);
						if (success) {
							// Vizuální potvrzení úspěšného kopírování
							const originalText = btn.innerHTML;
							btn.innerHTML = '<i class="fas fa-check"></i> Zkopírováno';
							setTimeout(() => {
								btn.innerHTML = originalText;
							}, 2000);
						}
					});
				}
			});
		});
		
		// Přidání funkce pro otevření odkazů v novém okně
		const openButtons = dialog.querySelectorAll('.open-link-btn');
		openButtons.forEach(btn => {
			btn.addEventListener('click', () => {
				const targetId = btn.dataset.target;
				const targetInput = document.getElementById(targetId);
				if (targetInput && targetInput.value) {
					window.open(targetInput.value, '_blank');
				}
			});
		});

		// Nastavení tlačítek v dialogu
		const goToFormBtn = document.getElementById('go-to-form-btn');
		const goToAdminBtn = document.getElementById('go-to-admin-btn');

		if (goToFormBtn) {
			goToFormBtn.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.href = respondentLink;
			});
		}

		if (goToAdminBtn) {
			goToAdminBtn.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.href = adminLink;
			});
		}
	}

	/**
	 * Zobrazí chybu při ukládání formuláře
	 * @param {Error} error Chyba
	 */
	showSaveError(error) {
		alert(`Chyba při ukládání formuláře: ${error.message}`);
		}

		/**
		 * Aktualizuje hodnoty formuláře z modelu
		 * @param {Form} form Model formuláře
		 */
		updateFormValues(form) {
		if (this.formTitleInput) {
			this.formTitleInput.value = form.title;
		}

		if (this.formDescriptionInput) {
			this.formDescriptionInput.value = form.description;
		}
	}
}