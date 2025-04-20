import { getQueryParams, sanitizeInput } from './utils.js';
import { getFormById, saveResponse } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const params = getQueryParams();
    const formId = params.id;

    if (!formId) {
        showError('Neplatný odkaz na formulář', 'Odkaz na tento formulář není platný. Zkontrolujte, zda jste použili správný odkaz.');
        return;
    }

    const formData = getFormById(formId);
    
    if (!formData) {
        showError('Formulář nebyl nalezen', 'Požadovaný formulář neexistuje nebo byl odstraněn.');
        return;
    }

    // Nastavení titulku a popisu
    document.getElementById('form-title').textContent = formData.title;
    document.getElementById('form-description').textContent = formData.description || '';
    document.title = `${formData.title} | FormBuilder`;

    // Vykreslení otázek
    const form = document.getElementById('response-form');
    const questionsContainer = document.getElementById('questions-container');
    
    formData.questions.forEach(question => {
        const questionElement = createQuestionInput(question);
        questionsContainer.appendChild(questionElement);
    });

    // Obsluha odeslání formuláře
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validace formuláře
        if (!validateForm(formData.questions)) {
            return;
        }
        
        const responses = collectResponses(formData.questions);
        
        if (saveResponse(formId, responses)) {
            // Zobrazení dialogu o úspěchu
            const dialog = document.getElementById('form-submitted-dialog');
            dialog.style.display = 'flex';
            
            // Přidání událostí tlačítkům v dialogu
            document.getElementById('submit-another-btn').addEventListener('click', () => {
                dialog.style.display = 'none';
                form.reset();
            });
            
            document.getElementById('close-dialog-btn').addEventListener('click', () => {
                dialog.style.display = 'none';
            });
        } else {
            alert('Nepodařilo se odeslat formulář. Zkuste to prosím znovu.');
        }
    });
});

function showError(title, message) {
    const container = document.querySelector('.form-container');
    container.innerHTML = `
        <div class="form-group" style="text-align: center; padding: 50px 0;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f44336; margin-bottom: 20px;"></i>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}

function createQuestionInput(question) {
    const div = document.createElement('div');
    div.className = 'question-card';
    
    // Přidání hlavičky otázky
    const titleHtml = `<h3>${question.title} ${question.required ? '<span style="color: #f44336;">*</span>' : ''}</h3>`;
    div.innerHTML = `<div class="form-group">${titleHtml}`;

    // Vykreslení podle typu otázky
    switch(question.type) {
        case 'text':
            div.innerHTML += `
                <input 
                    type="text" 
                    class="form-control"
                    name="${question.id}" 
                    placeholder="Vaše odpověď"
                    ${question.required ? 'required' : ''}
                >
            `;
            break;
        case 'radio':
            let radioHtml = '<div class="radio-group">';
            question.options.forEach(option => {
                radioHtml += `
                    <div class="radio-option">
                        <input 
                            type="radio" 
                            name="${question.id}" 
                            value="${sanitizeInput(option)}"
                            ${question.required ? 'required' : ''}
                        > 
                        <span>${option}</span>
                    </div>
                `;
            });
            radioHtml += '</div>';
            div.innerHTML += radioHtml;
            break;
        case 'checkbox':
            let checkboxHtml = '<div class="checkbox-group" style="display: block;">';
            question.options.forEach(option => {
                checkboxHtml += `
                    <div class="checkbox-option" style="margin-bottom: 10px;">
                        <input 
                            type="checkbox" 
                            name="${question.id}" 
                            value="${sanitizeInput(option)}"
                        > 
                        <span>${option}</span>
                    </div>
                `;
            });
            checkboxHtml += '</div>';
            div.innerHTML += checkboxHtml;
            break;
    }

    div.innerHTML += '</div>'; // Uzavření form-group
    return div;
}

function validateForm(questions) {
    let isValid = true;
    
    questions.forEach(question => {
        if (question.required) {
            const inputs = document.querySelectorAll(`[name="${question.id}"]`);
            
            if (question.type === 'text') {
                if (!inputs[0].value.trim()) {
                    isValid = false;
                    highlightError(inputs[0], 'Toto pole je povinné');
                }
            } else if (question.type === 'radio' || question.type === 'checkbox') {
                const checked = Array.from(inputs).some(input => input.checked);
                if (!checked) {
                    isValid = false;
                    const questionDiv = inputs[0].closest('.question-card');
                    highlightError(questionDiv, 'Vyberte prosím alespoň jednu možnost');
                }
            }
        }
    });
    
    return isValid;
}

function highlightError(element, message) {
    // Přidat třídu pro zvýraznění chyby
    element.classList.add('error');
    
    // Přidat zprávu o chybě
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = '#f44336';
    errorMessage.style.fontSize = '0.9rem';
    errorMessage.style.marginTop = '5px';
    
    // Vložit zprávu po elementu
    const parent = element.closest('.form-group');
    if (parent && !parent.querySelector('.error-message')) {
        parent.appendChild(errorMessage);
    }
    
    // Odstranit zvýraznění po změně hodnoty
    element.addEventListener('input', function() {
        element.classList.remove('error');
        const msg = parent.querySelector('.error-message');
        if (msg) parent.removeChild(msg);
    });
}

function collectResponses(questions) {
    const responses = {};
    
    questions.forEach(question => {
        const inputs = document.querySelectorAll(`[name="${question.id}"]`);
        
        if (question.type === 'text') {
            responses[question.id] = sanitizeInput(inputs[0].value.trim());
        } else if (question.type === 'radio') {
            const selected = Array.from(inputs).find(input => input.checked);
            responses[question.id] = selected ? selected.value : null;
        } else if (question.type === 'checkbox') {
            responses[question.id] = Array.from(inputs)
                .filter(input => input.checked)
                .map(input => input.value);
        }
    });

    return {
        answers: responses,
        submittedAt: new Date().toISOString()
    };
}