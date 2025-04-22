/**
 * Správce grafů pro administrační dashboard
 * @module components/charts/ChartManager
 */
import { BarChart } from './BarChart.js';
import { PieChart } from './PieChart.js';

/**
 * Třída pro správu a vykreslování grafů v administračním dashboardu
 */
export class ChartManager {
  /**
   * Vytvoří instanci správce grafů
   * @param {Object} options - Nastavení pro grafy
   */
  constructor(options = {}) {
    // Inicializace grafů s přizpůsobeným nastavením
    this.barChart = new BarChart(options.barChart || {});
    this.pieChart = new PieChart(options.pieChart || {});
  }
  
  /**
   * Vykreslí grafy pro odpovědi na otázky
   * @param {HTMLElement} container - DOM prvek, do kterého budou grafy přidány
   * @param {Object} formData - Data formuláře včetně otázek a odpovědí
   */
  renderCharts(container, formData) {
    if (!container) return;
    
    // Vyčištění kontejneru
    container.innerHTML = '';
    
    const responses = formData.responses || [];
    if (responses.length === 0) {
      container.innerHTML = '<p style="text-align: center;">Pro tento formulář nejsou k dispozici žádné grafy.</p>';
      return;
    }
    
    // Vykreslení statistik pouze pro otázky s výběrem (radio, checkbox)
    const chartableQuestions = formData.questions.filter(q => 
      q.type === 'radio' || q.type === 'checkbox');
    
    if (chartableQuestions.length === 0) {
      container.innerHTML = '<p style="text-align: center;">Pro tento formulář nejsou k dispozici žádné grafy.</p>';
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
      
      // Přidáme div pro SVG graf
      const chartContainer = document.createElement('div');
      chartContainer.className = 'chart-container';
      chartContainer.style.marginBottom = '20px';
      questionSection.appendChild(chartContainer);
      
      // Vykreslíme graf podle typu otázky
      if (question.type === 'checkbox') {
        this.barChart.render(chartContainer, stats);
      } else if (question.type === 'radio') {
        this.pieChart.render(chartContainer, stats);
      }
      
      // Vytvoření textové vizualizace pro každou možnost (progress bary)
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
      container.appendChild(questionSection);
    });
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
   * Počítá statistiky pro jednotlivé možnosti otázky
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
      const answer = response[question.id] || 
                    (response.answers ? response.answers[question.id] : null);
      
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
}

// Export výchozí instance s defaultním nastavením
export default new ChartManager();