import { getQueryParams } from './utils.js';
import { getFormById } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // Načtení dat formuláře pro náhled z sessionStorage
    const formData = JSON.parse(sessionStorage.getItem('form_preview'));
    
    if (!formData) {
        const container = document.querySelector('.form-container');
        container.innerHTML = `
            <div class="form-group" style="text-align: center; padding: 50px 0;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f44336; margin-bottom: 20px;"></i>
                <h3>Nepodařilo se načíst data formuláře</h3>
                <p>Zkuste se vrátit zpět a znovu zobrazit náhled.</p>
            </div>
        `;
        return;
    }

    // Nastavení titulku a popisu
    document.getElementById('form-title').textContent = formData.title;
    document.getElementById('form-description').textContent = formData.description || '';

    // Vykreslení otázek
    const questionsContainer = document.getElementById('questions-container');
    formData.questions.forEach(question => {
        const questionElement = createQuestionPreview(question);
        questionsContainer.appendChild(questionElement);
    });

    // Přidání tlačítka pro návrat do editoru
    document.getElementById('back-to-edit-btn').addEventListener('click', () => {
        window.close(); // Zavře okno s náhledem
    });
});

function createQuestionPreview(question) {
    const div = document.createElement('div');
    div.className = 'question-card';
    
    // Přidání hlavičky otázky
    const titleHtml = `<h3>${question.title} ${question.required ? '<span style="color: #f44336;">*</span>' : ''}</h3>`;
    div.innerHTML = `<div class="form-group">${titleHtml}`;

    // Vykreslení podle typu otázky
    switch(question.type) {
        case 'text':
            div.innerHTML += `
                <input type="text" class="form-control" disabled placeholder="Textová odpověď">
            `;
            break;
        case 'radio':
            let radioHtml = '<div class="radio-group">';
            question.options.forEach(option => {
                radioHtml += `
                    <div class="radio-option">
                        <input type="radio" disabled> 
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
                        <input type="checkbox" disabled> 
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