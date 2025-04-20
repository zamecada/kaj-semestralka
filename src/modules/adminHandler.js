import { getQueryParams, formatDate } from './utils.js';
import { getFormById } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const params = getQueryParams();
    const formId = params.id;

    if (!formId) {
        showError('Neplatný odkaz na formulář', 'Odkaz na administraci není platný. Zkontrolujte, zda jste použili správný odkaz.');
        return;
    }

    const formData = getFormById(formId);
    
    if (!formData) {
        showError('Formulář nebyl nalezen', 'Požadovaný formulář neexistuje nebo byl odstraněn.');
        return;
    }

    const pinLogin = document.getElementById('pin-login');
    const adminDashboard = document.getElementById('admin-dashboard');
    const pinSubmit = document.getElementById('pin-submit');
    const pinInput = document.getElementById('admin-pin-input');

    // Přidání event listeneru pro stisknutí klávesy Enter v PIN vstupu
    pinInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            pinSubmit.click();
        }
    });

    pinSubmit.addEventListener('click', () => {
        if (pinInput.value === formData.pin) {
            pinLogin.style.display = 'none';
            adminDashboard.style.display = 'block';
            
            // Nastavení titulku
            document.getElementById('form-title').textContent = formData.title;
            document.title = `Administrace: ${formData.title} | FormBuilder`;
            
            // Zobrazení počtu odpovědí
            const totalResponses = formData.responses ? formData.responses.length : 0;
            document.getElementById('total-responses').textContent = totalResponses;
            
            // Zobrazení data poslední odpovědi
            if (totalResponses > 0) {
                const lastResponse = formData.responses[totalResponses - 1];
                document.getElementById('last-response-date').textContent = 
                    formatDate(lastResponse.submittedAt);
            }
            
            // Vykreslení statistik
            if (totalResponses > 0) {
                renderStatistics(formData);
            } else {
                document.getElementById('chart-container').innerHTML = `
                    <h2>Přehled odpovědí</h2>
                    <p style="padding: 20px; text-align: center;">Zatím nebyly odeslány žádné odpovědi.</p>
                `;
            }
            
            // Vykreslení odpovědí
            renderResponses(formData);
            
            // Přidání funkcionality pro export odpovědí
            setupExportButton(formData);
        } else {
            // Zobrazení chyby při nesprávném PINu
            pinInput.classList.add('error');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Nesprávný PIN';
            errorMsg.style.color = '#f44336';
            errorMsg.style.fontSize = '0.9rem';
            errorMsg.style.marginTop = '5px';
            
            // Odstraní předchozí chybové zprávy pokud existují
            const existingError = pinInput.parentElement.querySelector('.error-message');
            if (existingError) existingError.remove();
            
            pinInput.parentElement.appendChild(errorMsg);
            
            // Reset stylů při novém zadání
            pinInput.addEventListener('input', function() {
                pinInput.classList.remove('error');
                const msg = pinInput.parentElement.querySelector('.error-message');
                if (msg) msg.remove();
            }, { once: true });
        }
    });
});

function showError(title, message) {
    const container = document.querySelector('.container');
    const html = `
        <div class="form-container" style="text-align: center; padding: 50px 20px; margin-top: 100px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f44336; margin-bottom: 20px;"></i>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
    
    // Vložení HTML do stránky
    if (container) {
        container.innerHTML = html;
    } else {
        document.body.innerHTML = html;
    }
}

function renderStatistics(formData) {
    const chartsContainer = document.getElementById('charts');
    chartsContainer.innerHTML = '';
    
    // Vykreslení statistik pouze pro otázky s výběrem (radio, checkbox)
    const chartableQuestions = formData.questions.filter(q => 
        q.type === 'radio' || q.type === 'checkbox');
    
    if (chartableQuestions.length === 0) {
        chartsContainer.innerHTML = '<p style="text-align: center;">Pro tento formulář nejsou k dispozici žádné grafy.</p>';
        return;
    }
    
    // Zpracování otázek
    chartableQuestions.forEach(question => {
        const questionSection = document.createElement('div');
        questionSection.className = 'question-section';
        
        // Titulek otázky včetně počtu odpovědí
        questionSection.innerHTML = `
            <h3>${question.title}</h3>
            <p class="response-count">${formData.responses.length} odpovědí</p>
        `;
        
        // Vytvoření statistik pro otázku
        const stats = calculateOptionStats(question, formData.responses);
        
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
                    <div class="option-progress" style="width: ${stat.percentage}%"></div>
                </div>
                <div class="stat-values">${stat.percentage}% | ${stat.count} ${stat.count === 1 ? 'odpověď' : (stat.count >= 2 && stat.count <= 4 ? 'odpovědi' : 'odpovědí')}</div>
            `;
            
            optionsContainer.appendChild(optionBar);
        });
        
        questionSection.appendChild(optionsContainer);
        chartsContainer.appendChild(questionSection);
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
                <p class="response-count">${formData.responses.length} odpovědí</p>
            `;
            
            // Seznam textových odpovědí
            const textList = document.createElement('div');
            textList.className = 'text-responses';
            
            const answers = formData.responses.map(response => response[question.id] || '(bez odpovědi)');
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
        
        chartsContainer.appendChild(textSection);
    }
}

// Funkce pro výpočet statistik pro jednotlivé možnosti
function calculateOptionStats(question, responses) {
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
        const answer = response[question.id];
        
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
        stat.percentage = Math.round((stat.count / totalResponses) * 100);
    });
    
    // Seřazení dle počtu odpovědí (sestupně)
    return stats.sort((a, b) => b.count - a.count);
}

function renderResponses(formData) {
    const responsesContainer = document.getElementById('responses-container');
    responsesContainer.innerHTML = ''; // Vyčištění kontejneru

    if (!formData.responses || formData.responses.length === 0) {
        responsesContainer.innerHTML = '<div class="info-message">Zatím nebyly odeslány žádné odpovědi.</div>';
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
    formData.responses.forEach((response, index) => {
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
            const questionResponse = response[question.id];
            answerCell.innerHTML = formatResponse(questionResponse);
            row.appendChild(answerCell);
        });
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    responsesContainer.appendChild(table);
}

function formatResponse(response) {
    if (response === null || response === undefined) return '<em>Bez odpovědi</em>';
    if (Array.isArray(response)) {
        if (response.length === 0) return '<em>Bez odpovědi</em>';
        return response.join(', ');
    }
    return response;
}

function setupExportButton(formData) {
    const exportBtn = document.getElementById('export-btn');
    
    exportBtn.addEventListener('click', () => {
        // Příprava dat pro export do CSV
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Přidání hlavičky CSV
        let header = ["#", "Datum"];
        formData.questions.forEach(question => {
            header.push(question.title);
        });
        csvContent += header.join(",") + "\r\n";
        
        // Přidání dat
        formData.responses.forEach((response, index) => {
            let row = [(index + 1), formatDate(response.submittedAt)];
            
            formData.questions.forEach(question => {
                const answer = response[question.id];
                if (answer === null || answer === undefined) {
                    row.push("");
                } else if (Array.isArray(answer)) {
                    row.push(`"${answer.join(', ')}"`);
                } else {
                    row.push(`"${answer}"`);
                }
            });
            
            csvContent += row.join(",") + "\r\n";
        });
        
        // Vytvoření odkazu pro stažení
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${formData.title}_odpovedi.csv`);
        document.body.appendChild(link);
        
        // Kliknutí na odkaz a jeho odstranění
        link.click();
        document.body.removeChild(link);
    });
}