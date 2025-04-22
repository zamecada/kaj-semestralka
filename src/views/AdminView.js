/**
 * View pro administraci formuláře
 */
import { formatDate } from '../services/Utils.js';

export class AdminView {
	/**
	 * Vytvoří novou instanci AdminView
	 * @param {HTMLElement} container Element, do kterého se bude renderovat
	 */
	constructor(container) {
		this.container = container;
		
		// Elementy na stránce
		this.pinLogin = document.getElementById('pin-login');
		this.adminDashboard = document.getElementById('admin-dashboard');
		this.pinSubmit = document.getElementById('pin-submit');
		this.pinInput = document.getElementById('admin-pin-input');
		this.formTitle = document.getElementById('form-title');
		this.totalResponses = document.getElementById('total-responses');
		this.lastResponseDate = document.getElementById('last-response-date');
		this.chartsContainer = document.getElementById('charts');
		this.responsesContainer = document.getElementById('responses-container');
		this.exportBtn = document.getElementById('export-btn');
		
		// Reference na handlery
		this.handlers = {
		verifyPin: null,
		exportResponses: null
		};
		
		// Inicializace
		this._init();
	}
	
	/**
	 * Inicializuje view
	 * @private
	 */
	_init() {
		// Skrytí dashboardu na začátku
		if (this.adminDashboard) {
		this.adminDashboard.style.display = 'none';
		}
		
		// Nastavení posluchače pro Enter v PIN vstupu
		if (this.pinInput) {
		this.pinInput.addEventListener('keyup', (e) => {
			if (e.key === 'Enter' && this.pinSubmit) {
			this.pinSubmit.click();
			}
		});
		}
		
		// Nastavení posluchače pro tlačítko odeslání PINu
		if (this.pinSubmit) {
		this.pinSubmit.addEventListener('click', () => {
			if (this.handlers.verifyPin && this.pinInput) {
			this.handlers.verifyPin(this.pinInput.value);
			}
		});
		}
		
		// Nastavení posluchače pro export
		if (this.exportBtn) {
		this.exportBtn.addEventListener('click', () => {
			if (this.handlers.exportResponses) {
			this.handlers.exportResponses();
			}
		});
		}
	}
	
	/**
	 * Binduje handler pro ověření PINu
	 * @param {Function} handler Handler pro ověření PINu
	 */
	bindVerifyPin(handler) {
		this.handlers.verifyPin = handler;
	}
	
	/**
	 * Binduje handler pro export odpovědí
	 * @param {Function} handler Handler pro export odpovědí
	 */
	bindExportResponses(handler) {
		this.handlers.exportResponses = handler;
	}
	
	/**
	 * Zobrazí chybu při nesprávném PINu
	 */
	showPinError() {
		if (!this.pinInput) return;
		
		this.pinInput.classList.add('error');
		const errorMsg = document.createElement('div');
		errorMsg.className = 'error-message';
		errorMsg.textContent = 'Nesprávný PIN';
		errorMsg.style.color = '#f44336';
		errorMsg.style.fontSize = '0.9rem';
		errorMsg.style.marginTop = '5px';
		
		// Odstraní předchozí chybové zprávy pokud existují
		const existingError = this.pinInput.parentElement.querySelector('.error-message');
		if (existingError) existingError.remove();
		
		this.pinInput.parentElement.appendChild(errorMsg);
		
		// Reset stylů při novém zadání
		this.pinInput.addEventListener('input', () => {
		this.pinInput.classList.remove('error');
		const msg = this.pinInput.parentElement.querySelector('.error-message');
		if (msg) msg.remove();
		}, { once: true });
	}
	
	/**
	 * Zobrazuje dashboard po úspěšném ověření PINu
	 * @param {Object} formData Data formuláře
	 */
	showDashboard(formData) {
		if (!this.pinLogin || !this.adminDashboard) return;
		
		// Skrytí přihlašovacího formuláře a zobrazení dashboardu
		this.pinLogin.style.display = 'none';
		this.adminDashboard.style.display = 'block';
		
		// Nastavení titulku
		if (this.formTitle) {
		this.formTitle.textContent = formData.title;
		document.title = `Administrace: ${formData.title} | FormBuilder`;
		}
		
		// Zobrazení počtu odpovědí
		const responses = formData.responses || [];
		if (this.totalResponses) {
		this.totalResponses.textContent = responses.length;
		}
		
		// Zobrazení data poslední odpovědi
		if (this.lastResponseDate && responses.length > 0) {
		const lastResponse = responses[responses.length - 1];
		this.lastResponseDate.textContent = formatDate(lastResponse.submittedAt);
		}
		
		// Vykreslení statistik
		this.renderStatistics(formData);
		
		// Vykreslení odpovědí
		this.renderResponses(formData);
	}
	
	/**
	 * Renderuje statistiky odpovědí
	 * @param {Object} formData Data formuláře
	 */
	renderStatistics(formData) {
		if (!this.chartsContainer) return;
		this.chartsContainer.innerHTML = '';
		
		const responses = formData.responses || [];
		if (responses.length === 0) {
		this.chartsContainer.innerHTML = '<p style="text-align: center;">Pro tento formulář nejsou k dispozici žádné grafy.</p>';
		return;
		}
		
		// Vykreslení statistik pouze pro otázky s výběrem (radio, checkbox)
		const chartableQuestions = formData.questions.filter(q => 
		q.type === 'radio' || q.type === 'checkbox');
		
		if (chartableQuestions.length === 0) {
		this.chartsContainer.innerHTML = '<p style="text-align: center;">Pro tento formulář nejsou k dispozici žádné grafy.</p>';
		return;
		}
		
		// Zpracování otázek
		chartableQuestions.forEach(question => {
		const questionSection = document.createElement('div');
		questionSection.className = 'question-section';
		
		// Titulek otázky včetně počtu odpovědí
		questionSection.innerHTML = `
			<h3>${question.title}</h3>
			<p class="response-count">${responses.length} odpovědí</p>
		`;
		
		// Vytvoření statistik pro otázku
		const stats = this._calculateOptionStats(question, responses);
		
		// Vytvoření vizualizace pro každou možnost
		const optionsContainer = document.createElement('div');
		optionsContainer.className = 'options-stats';
		
		stats.forEach(stat => {
			// Vytvoření progress baru
			const optionBar = document.createElement('div');
			optionBar.className = 'option-stat-bar';
			
			optionBar.innerHTML = `
			<div class="option-text">${stat.option}</div>
			<div class="option-bar-container">
				<div class="option-progress" style="width: ${stat.percentage}%; background-color: var(--primary-color);"></div>
			</div>
			<div class="stat-values">${stat.percentage}% | ${stat.count} ${this._getResponseWord(stat.count)}</div>
			`;
			
			optionsContainer.appendChild(optionBar);
		});
		
		questionSection.appendChild(optionsContainer);
		this.chartsContainer.appendChild(questionSection);
		});
		
		// Přidání textových odpovědí
		const textQuestions = formData.questions.filter(q => q.type === 'text');
		
		if (textQuestions.length > 0) {
		const textSection = document.createElement('div');
		textSection.className = 'text-questions-section';
		
		textQuestions.forEach(question => {
			const questionSection = document.createElement('div');
			questionSection.className = 'question-section';
			
			// Titulek otázky
			questionSection.innerHTML = `
			<h3>${question.title}</h3>
			<p class="response-count">${responses.length} odpovědí</p>
			`;
			
			// Seznam textových odpovědí
			const textList = document.createElement('div');
			textList.className = 'text-responses';
			
			const answers = responses.map(response => {
			// V původní struktuře odpovědi byly v hlavním objektu
			if (response[question.id]) {
				return response[question.id];
			}
			
			// V nové struktuře jsou odpovědi v objektu answers
			if (response.answers && response.answers[question.id]) {
				return response.answers[question.id];
			}
			
			return '(bez odpovědi)';
			});
			
			answers.forEach(answer => {
			if (answer && answer.trim()) {
				textList.innerHTML += `<div class="text-response">${answer}</div>`;
			}
			});
			
			if (textList.children.length === 0) {
			textList.innerHTML = '<div class="text-response empty">Žádné textové odpovědi</div>';
			}
			
			questionSection.appendChild(textList);
			textSection.appendChild(questionSection);
		});
		
		this.chartsContainer.appendChild(textSection);
		}
	}
	
	/**
	 * Vrátí české slovo pro počet odpovědí (odpověď/odpovědi/odpovědí)
	 * @param {number} count Počet odpovědí
	 * @returns {string} Slovo v odpovídajícím tvaru
	 * @private
	 */
	_getResponseWord(count) {
		if (count === 1) return 'odpověď';
		if (count >= 2 && count <= 4) return 'odpovědi';
		return 'odpovědí';
	}
	
	/**
	 * Počítá statistiky pro jednotlivé možnosti
	 * @param {Object} question Otázka
	 * @param {Array} responses Odpovědi
	 * @returns {Array} Statistiky možností
	 * @private
	 */
	_calculateOptionStats(question, responses) {
		const stats = [];
		const totalResponses = responses.length;
		
		// Inicializace pro všechny možnosti
		question.options.forEach(option => {
		stats.push({
			option: option,
			count: 0,
			percentage: 0
		});
		});
		
		// Počítání odpovědí
		responses.forEach(response => {
		// Podpora pro původní i novou strukturu odpovědí
		const answer = response[question.id] || (response.answers ? response.answers[question.id] : null);
		
		if (question.type === 'radio') {
			// Pro radio je odpověď string
			if (answer) {
			const statItem = stats.find(stat => stat.option === answer);
			if (statItem) statItem.count++;
			}
		} else if (question.type === 'checkbox') {
			// Pro checkbox je odpověď pole
			if (Array.isArray(answer)) {
			answer.forEach(selectedOption => {
				const statItem = stats.find(stat => stat.option === selectedOption);
				if (statItem) statItem.count++;
			});
			}
		}
		});
		
		// Výpočet procent
		stats.forEach(stat => {
		stat.percentage = Math.round((stat.count / totalResponses) * 100) || 0;
		});
		
		// Seřazení dle počtu odpovědí (sestupně)
		return stats.sort((a, b) => b.count - a.count);
	}
	
	/**
	 * Renderuje seznam odpovědí
	 * @param {Object} formData Data formuláře
	 */
	renderResponses(formData) {
		if (!this.responsesContainer) return;
		this.responsesContainer.innerHTML = ''; // Vyčištění kontejneru
		
		const responses = formData.responses || [];
		if (responses.length === 0) {
		this.responsesContainer.innerHTML = '<div class="info-message">Zatím nebyly odeslány žádné odpovědi.</div>';
		return;
		}
		
		// Tabulka pro zobrazení odpovědí
		const table = document.createElement('table');
		table.className = 'responses-table';
		
		// Vytvoření hlavičky tabulky
		const thead = document.createElement('thead');
		let headerRow = '<tr>';
		headerRow += '<th>#</th>';
		headerRow += '<th>Datum</th>';
		formData.questions.forEach(question => {
		headerRow += `<th>${question.title}</th>`;
		});
		headerRow += '</tr>';
		thead.innerHTML = headerRow;
		table.appendChild(thead);
		
		// Vytvoření těla tabulky
		const tbody = document.createElement('tbody');
		responses.forEach((response, index) => {
		let row = document.createElement('tr');
		
		// Index odpovědi
		let indexCell = document.createElement('td');
		indexCell.textContent = index + 1;
		row.appendChild(indexCell);
		
		// Datum odpovědi
		let dateCell = document.createElement('td');
		dateCell.textContent = formatDate(response.submittedAt);
		row.appendChild(dateCell);
		
		// Odpovědi na jednotlivé otázky
		formData.questions.forEach(question => {
			let answerCell = document.createElement('td');
			
			// Podpora pro původní i novou strukturu odpovědí
			const questionResponse = response[question.id] || 
								(response.answers ? response.answers[question.id] : null);
								
			answerCell.innerHTML = this._formatResponse(questionResponse);
			row.appendChild(answerCell);
		});
		
		tbody.appendChild(row);
		});
		
		table.appendChild(tbody);
		this.responsesContainer.appendChild(table);
	}
	
	/**
	 * Formátuje odpověď pro zobrazení v tabulce
	 * @param {any} response Odpověď
	 * @returns {string} Formátovaná odpověď
	 * @private
	 */
	_formatResponse(response) {
		if (response === null || response === undefined) return '<em>Bez odpovědi</em>';
		if (Array.isArray(response)) {
		if (response.length === 0) return '<em>Bez odpovědi</em>';
		return response.join(', ');
		}
		return response;
	}
	
	/**
	 * Zobrazí obecnou chybu
	 * @param {string} title Titulek chyby
	 * @param {string} message Text chyby
	 */
	showError(title, message) {
		const container = document.querySelector('.container');
		if (!container) return;
		
		const html = `
		<div class="form-container" style="text-align: center; padding: 50px 20px; margin-top: 100px;">
			<i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f44336; margin-bottom: 20px;"></i>
			<h3>${title}</h3>
			<p>${message}</p>
		</div>
		`;
		
		container.innerHTML = html;
	}

	/**
	 * Vykreslí sloupcový graf jako SVG prvek uvnitř zadaného kontejneru.
	 * Každý sloupec reprezentuje jednu položku dat, přičemž jeho výška odpovídá hodnotě `percentage`.
	 * Graf obsahuje animace, popisky a procentuální hodnoty pro každý sloupec.
	 *
	 * @param {HTMLElement} container - DOM prvek, do kterého bude SVG graf připojen.
	 * @param {Array<Object>} data - Pole datových objektů, které mají být zobrazeny v grafu.
	 * @param {string} data[].option - Popisek sloupce, zobrazený pod ním.
	 * @param {number} data[].percentage - Výška sloupce, vyjádřená v procentech (0–100).
	 */
	_renderSvgChart(container, data) {
		const svgNS = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute("width", "100%");
		svg.setAttribute("height", "200");
		svg.setAttribute("viewBox", "0 0 300 100");
		
		// Definice barev
		const colors = ['#6c63ff', '#7d75ff', '#8e86ff', '#9f98ff', '#b0a9ff'];
		
		// Vytvoření grafu
		data.forEach((item, index) => {
			const bar = document.createElementNS(svgNS, "rect");
			bar.setAttribute("x", index * 60 + 10);
			bar.setAttribute("y", 100 - item.percentage);
			bar.setAttribute("width", 40);
			bar.setAttribute("height", item.percentage);
			bar.setAttribute("fill", colors[index % colors.length]);
			
			// Animace při načtení
			bar.style.transform = "scaleY(0)";
			bar.style.transformOrigin = "bottom";
			bar.style.transition = "transform 0.5s ease";
			
			svg.appendChild(bar);
			
			// Text s hodnotou
			const text = document.createElementNS(svgNS, "text");
			text.setAttribute("x", index * 60 + 30);
			text.setAttribute("y", 95 - item.percentage);
			text.setAttribute("text-anchor", "middle");
			text.setAttribute("fill", "#333");
			text.textContent = `${item.percentage}%`;
			svg.appendChild(text);
			
			// Label
			const label = document.createElementNS(svgNS, "text");
			label.setAttribute("x", index * 60 + 30);
			label.setAttribute("y", 115);
			label.setAttribute("text-anchor", "middle");
			label.setAttribute("fill", "#666");
			label.textContent = item.option.substring(0, 10);
			svg.appendChild(label);
		});
		
		container.appendChild(svg);
		
		// Spustit animaci
		setTimeout(() => {
			const bars = svg.querySelectorAll("rect");
			bars.forEach(bar => {
			bar.style.transform = "scaleY(1)";
			});
		}, 100);
	}
}