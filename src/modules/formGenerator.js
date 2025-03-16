// Module for generating forms, handling question creation and form saving
import { saveData, getData } from './storage.js';
import { generateID, copyToClipboard, sanitizeInput } from './utils.js';

// Main class for form generation
class FormGenerator {
    constructor() {
        this.formData = {
            id: generateID(),
            title: '',
            description: '',
            questions: [],
            createdAt: new Date().toISOString(),
            pin: this.generatePIN(),
            responses: []
        };
        
        this.initEventListeners();
    }
    
    // Initialize all event listeners
    initEventListeners() {
        // Form title and description
        document.getElementById('form-title').addEventListener('input', (e) => {
            this.formData.title = sanitizeInput(e.target.value);
        });
        
        document.getElementById('form-description').addEventListener('input', (e) => {
            this.formData.description = sanitizeInput(e.target.value);
        });
        
        // Add question button
        const addQuestionBtn = document.getElementById('add-question-btn');
        const questionTypesMenu = document.getElementById('question-types-menu');
        
        addQuestionBtn.addEventListener('click', () => {
            questionTypesMenu.style.display = questionTypesMenu.style.display === 'none' ? 'block' : 'none';
        });
        
        // Hide menu when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#add-question-btn') && !e.target.closest('#question-types-menu')) {
                questionTypesMenu.style.display = 'none';
            }
        });
        
        // Question type selection
        const questionTypes = document.querySelectorAll('.question-type');
        questionTypes.forEach(type => {
            type.addEventListener('click', () => {
                const questionType = type.dataset.type;
                this.addQuestion(questionType);
                questionTypesMenu.style.display = 'none';
            });
        });
        
        // Save form button
        document.getElementById('save-form-btn').addEventListener('click', () => {
            this.saveForm();
        });
        
        // Preview form button
        document.getElementById('preview-form-btn').addEventListener('click', () => {
            this.previewForm();
        });
        
        // Copy buttons in the dialog
        const copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.target;
                const textToCopy = document.getElementById(targetId).value;
                copyToClipboard(textToCopy);
                
                // Show feedback
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            });
        });
        
        // Buttons in the success dialog
        document.getElementById('go-to-form-btn').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = document.getElementById('respondent-link').value;
        });
        
        document.getElementById('go-to-admin-btn').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = document.getElementById('admin-link').value;
        });
    }
    
    // Generate a random PIN for admin access
    generatePIN() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
    
    // Add a new question to the form
    addQuestion(type) {
        const questionId = generateID();
        const questionsContainer = document.getElementById('questions-container');
        
        // Clone the appropriate template
        const template = document.getElementById(`${type}-question-template`);
        const questionElement = template.content.cloneNode(true);
        
        // Set question ID
        const questionCard = questionElement.querySelector('.question-card');
        questionCard.dataset.questionId = questionId;
        
        // Set unique ID for the required checkbox
        const requiredCheckbox = questionElement.querySelector('.question-required');
        const requiredLabel = questionElement.querySelector('.question-required + label');
        const checkboxId = `required-${questionId}`;
        requiredCheckbox.id = checkboxId;
        requiredLabel.htmlFor = checkboxId;
        
        // Add to DOM
        questionsContainer.appendChild(questionElement);
        
        // Add delete question handler
        const deleteBtn = questionsContainer.querySelector(`[data-question-id="${questionId}"] .delete-question`);
        deleteBtn.addEventListener('click', () => {
            this.deleteQuestion(questionId);
        });
        
        // Add handlers for option-based questions (radio, checkbox)
        if (type === 'radio' || type === 'checkbox') {
            // Add option button
            const addOptionBtn = questionsContainer.querySelector(`[data-question-id="${questionId}"] .add-option-btn`);
            addOptionBtn.addEventListener('click', () => {
                this.addOption(questionId);
            });
            
            // Delete option buttons
            const deleteOptionBtns = questionsContainer.querySelectorAll(`[data-question-id="${questionId}"] .delete-option`);
            deleteOptionBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.deleteOption(questionId, e.target.closest('.option-item'));
                });
            });
        }
        
        // Add question to formData
        const questionData = {
            id: questionId,
            type: type,
            title: '',
            required: false,
            options: type === 'text' ? [] : ['', ''] // Default empty options for radio/checkbox
        };
        
        this.formData.questions.push(questionData);
        
        // Add change listeners for this question
        this.addQuestionChangeListeners(questionId, type);
    }
    
    // Delete a question
    deleteQuestion(questionId) {
        // Remove from DOM
        const questionElement = document.querySelector(`[data-question-id="${questionId}"]`);
        questionElement.remove();
        
        // Remove from formData
        this.formData.questions = this.formData.questions.filter(q => q.id !== questionId);
    }
    
    // Add a new option to a multiple choice question
    addOption(questionId) {
        const optionsContainer = document.querySelector(`[data-question-id="${questionId}"] .options-container`);
        
        // Create new option
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.innerHTML = `
            <input type="text" class="form-control option-text" placeholder="Nová možnost">
            <button class="btn-icon delete-option"><i class="fas fa-times"></i></button>
        `;
        
        optionsContainer.appendChild(optionItem);
        
        // Add delete handler
        const deleteBtn = optionItem.querySelector('.delete-option');
        deleteBtn.addEventListener('click', () => {
            this.deleteOption(questionId, optionItem);
        });
        
        // Add change listener
        const inputField = optionItem.querySelector('.option-text');
        inputField.addEventListener('input', () => {
            this.updateQuestionOptions(questionId);
        });
        
        // Update formData
        const questionIndex = this.formData.questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            this.formData.questions[questionIndex].options.push('');
        }
    }
    
    // Delete an option
    deleteOption(questionId, optionElement) {
        // Don't allow less than 2 options
        const optionsContainer = document.querySelector(`[data-question-id="${questionId}"] .options-container`);
        if (optionsContainer.children.length <= 2) {
            alert('Otázka musí obsahovat alespoň dvě možnosti.');
            return;
        }
        
        // Get the index of this option
        const optionIndex = Array.from(optionsContainer.children).indexOf(optionElement);
        
        // Remove from DOM
        optionElement.remove();
        
        // Update formData
        const questionIndex = this.formData.questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1 && optionIndex !== -1) {
            this.formData.questions[questionIndex].options.splice(optionIndex, 1);
        }
    }
    
    // Add change listeners to question fields
    addQuestionChangeListeners(questionId, type) {
        // Question title
        const titleInput = document.querySelector(`[data-question-id="${questionId}"] .question-title`);
        titleInput.addEventListener('input', (e) => {
            const questionIndex = this.formData.questions.findIndex(q => q.id === questionId);
            if (questionIndex !== -1) {
                this.formData.questions[questionIndex].title = sanitizeInput(e.target.value);
            }
        });
        
        // Required checkbox
        const requiredCheckbox = document.querySelector(`[data-question-id="${questionId}"] .question-required`);
        requiredCheckbox.addEventListener('change', (e) => {
            const questionIndex = this.formData.questions.findIndex(q => q.id === questionId);
            if (questionIndex !== -1) {
                this.formData.questions[questionIndex].required = e.target.checked;
            }
        });
        
        // Options for radio/checkbox
        if (type === 'radio' || type === 'checkbox') {
            const optionInputs = document.querySelectorAll(`[data-question-id="${questionId}"] .option-text`);
            optionInputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.updateQuestionOptions(questionId);
                });
            });
        }
    }
    
    // Update options in formData when they change
    updateQuestionOptions(questionId) {
        const optionInputs = document.querySelectorAll(`[data-question-id="${questionId}"] .option-text`);
        const options = Array.from(optionInputs).map(input => sanitizeInput(input.value));
        
        const questionIndex = this.formData.questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            this.formData.questions[questionIndex].options = options;
        }
    }
    
    // Validate the form before saving
    validateForm() {
        if (!this.formData.title.trim()) {
            alert('Prosím, zadejte název formuláře.');
            return false;
        }
        
        if (this.formData.questions.length === 0) {
            alert('Formulář musí obsahovat alespoň jednu otázku.');
            return false;
        }
        
        for (const question of this.formData.questions) {
            if (!question.title.trim()) {
                alert('Všechny otázky musí mít vyplněný text.');
                return false;
            }
            
            if ((question.type === 'radio' || question.type === 'checkbox') && 
                question.options.some(opt => !opt.trim())) {
                alert('Všechny možnosti musí být vyplněné.');
                return false;
            }
        }
        
        return true;
    }
    
    // Save the form
    saveForm() {
        if (!this.validateForm()) {
            return;
        }
        
        // Get all forms data
        let forms = getData('forms') || [];
        
        // Save this form
        forms.push(this.formData);
        saveData('forms', forms);
        
        // Save form individually for easier access
        saveData(`form_${this.formData.id}`, this.formData);
        
        // Show success dialog and fill links
        const respondentLink = `${window.location.origin}/src/views/form.html?id=${this.formData.id}`;
        const adminLink = `${window.location.origin}/src/views/admin.html?id=${this.formData.id}`;
        
        document.getElementById('respondent-link').value = respondentLink;
        document.getElementById('admin-link').value = adminLink;
        document.getElementById('admin-pin').value = this.formData.pin;
        
        // Show the dialog
        document.getElementById('form-created-dialog').style.display = 'flex';
    }
    
    // Preview the form
    previewForm() {
        if (!this.validateForm()) {
            return;
        }
        
        // Store current form data in sessionStorage for preview
        sessionStorage.setItem('form_preview', JSON.stringify(this.formData));
        
        // Open preview in new tab
        window.open(`/src/views/preview.html`, '_blank');
    }
}

// Initialize the form generator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const formGenerator = new FormGenerator();
    window.formGenerator = formGenerator; // For debugging
});