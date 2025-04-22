/**
 * Question templates - šablony pro různé typy otázek
 * @module templates/questionTemplates
 */

/**
 * Generuje unikátní ID pro otázku
 * @return {string} Unikátní ID
 */
const generateQuestionId = () => `question_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

/**
 * Vytvoří šablonu pro textovou otázku
 * @param {Object} options - Nastavení otázky
 * @param {string} [options.id] - ID otázky (pokud není zadáno, vygeneruje se)
 * @param {string} [options.title] - Text otázky
 * @param {boolean} [options.required] - Je otázka povinná?
 * @return {string} HTML kód otázky
 */
export const createTextQuestion = (options = {}) => {
  const { 
    id = generateQuestionId(), 
    title = '', 
    required = false 
  } = options;
  
  return `
    <div class="question-card" data-question-id="${id}" data-question-type="text">
        <div class="question-header">
            <h3 class="question-type-label">Textová odpověď</h3>
            <div class="question-actions">
                <button class="btn-icon delete-question"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        <div class="form-group">
            <label>Text otázky:</label>
            <input type="text" class="form-control question-title" placeholder="Např. Jaký je váš názor?" value="${title}">
        </div>
        <div class="form-group checkbox-group">
            <input type="checkbox" id="required_${id}" class="question-required" ${required ? 'checked' : ''}>
            <label for="required_${id}">Povinná otázka</label>
        </div>
    </div>
  `;
};

/**
 * Vytvoří šablonu pro otázku s výběrem jedné možnosti
 * @param {Object} options - Nastavení otázky
 * @param {string} [options.id] - ID otázky
 * @param {string} [options.title] - Text otázky
 * @param {Array<string>} [options.options] - Možnosti odpovědí
 * @param {boolean} [options.required] - Je otázka povinná?
 * @return {string} HTML kód otázky
 */
export const createRadioQuestion = (options = {}) => {
  const { 
    id = generateQuestionId(), 
    title = '', 
    options = ['', ''], 
    required = false 
  } = options;
  
  const optionsHtml = options.map(option => `
    <div class="option-item">
        <input type="text" class="form-control option-text" placeholder="Možnost" value="${option}">
        <button class="btn-icon delete-option"><i class="fas fa-times"></i></button>
    </div>
  `).join('');
  
  return `
    <div class="question-card" data-question-id="${id}" data-question-type="radio">
        <div class="question-header">
            <h3 class="question-type-label">Výběr jedné možnosti</h3>
            <div class="question-actions">
                <button class="btn-icon delete-question"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        <div class="form-group">
            <label>Text otázky:</label>
            <input type="text" class="form-control question-title" placeholder="Např. Vyberte jednu možnost" value="${title}">
        </div>
        <div class="options-container">
            ${optionsHtml}
        </div>
        <button class="btn btn-outline add-option-btn">
            <i class="fas fa-plus"></i> Přidat možnost
        </button>
        <div class="form-group checkbox-group">
            <input type="checkbox" id="required_${id}" class="question-required" ${required ? 'checked' : ''}>
            <label for="required_${id}">Povinná otázka</label>
        </div>
    </div>
  `;
};

/**
 * Vytvoří šablonu pro otázku s výběrem více možností
 * @param {Object} options - Nastavení otázky
 * @param {string} [options.id] - ID otázky
 * @param {string} [options.title] - Text otázky
 * @param {Array<string>} [options.options] - Možnosti odpovědí
 * @param {boolean} [options.required] - Je otázka povinná?
 * @return {string} HTML kód otázky
 */
export const createCheckboxQuestion = (options = {}) => {
  const { 
    id = generateQuestionId(), 
    title = '', 
    options = ['', ''], 
    required = false 
  } = options;
  
  const optionsHtml = options.map(option => `
    <div class="option-item">
        <input type="text" class="form-control option-text" placeholder="Možnost" value="${option}">
        <button class="btn-icon delete-option"><i class="fas fa-times"></i></button>
    </div>
  `).join('');
  
  return `
    <div class="question-card" data-question-id="${id}" data-question-type="checkbox">
        <div class="question-header">
            <h3 class="question-type-label">Zaškrtávací pole (více možností)</h3>
            <div class="question-actions">
                <button class="btn-icon delete-question"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        <div class="form-group">
            <label>Text otázky:</label>
            <input type="text" class="form-control question-title" placeholder="Např. Zaškrtněte všechny vyhovující možnosti" value="${title}">
        </div>
        <div class="options-container">
            ${optionsHtml}
        </div>
        <button class="btn btn-outline add-option-btn">
            <i class="fas fa-plus"></i> Přidat možnost
        </button>
        <div class="form-group checkbox-group">
            <input type="checkbox" id="required_${id}" class="question-required" ${required ? 'checked' : ''}>
            <label for="required_${id}">Povinná otázka</label>
        </div>
    </div>
  `;
};

export default {
  createTextQuestion,
  createRadioQuestion,
  createCheckboxQuestion
};