/**
 * Modul pro vykreslování sloupcových grafů
 * @module components/charts/BarChart
 */

/**
 * Třída pro vytváření sloupcových grafů
 */
export class BarChart {
    /**
     * Vytvoří instanci sloupcového grafu
     * @param {Object} options - Nastavení grafu
     * @param {Array} options.colors - Pole barev pro sloupce grafu
     * @param {number} options.barWidth - Šířka sloupce v pixelech
     * @param {number} options.barSpacing - Mezera mezi sloupci v pixelech
     * @param {number} options.chartPadding - Vnitřní odsazení grafu v pixelech
     * @param {number} options.chartHeight - Výška grafu v pixelech
     * @param {boolean} options.interactive - Zda mají sloupce reagovat na hover efekty
     */
    constructor(options = {}) {
      // Nastavení výchozích hodnot
      this.options = {
        colors: [
          '#6c63ff', '#7d75ff', '#8e86ff', '#9f98ff', '#b0a9ff',
          '#c1baff', '#d2cbff', '#e3dcff', '#f4edff'
        ],
        barWidth: 40,
        barSpacing: 20,
        chartPadding: 30,
        chartHeight: 220,
        interactive: true,
        ...options
      };
      
      // Generování unikátního ID pro filtry
      this.filterId = `bar-shadow-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    /**
     * Vykreslí sloupcový graf jako SVG prvek uvnitř zadaného kontejneru
     * @param {HTMLElement} container - DOM prvek, do kterého bude SVG graf připojen
     * @param {Array<Object>} data - Pole datových objektů, které mají být zobrazeny v grafu
     * @param {string} data[].option - Popisek sloupce, zobrazený pod ním
     * @param {number} data[].percentage - Výška sloupce, vyjádřená v procentech (0–100)
     * @param {number} data[].count - Počet odpovědí pro danou možnost
     * @returns {SVGElement} Vytvořené SVG s grafem
     */
    render(container, data) {
      // Vytvoření SVG elementu
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      
      // Omezení na 8 položek pro přehlednost
      const displayData = data.slice(0, 8);
      
      // Výpočet rozměrů grafu
      const { barWidth, barSpacing, chartPadding, chartHeight } = this.options;
      const chartWidth = (barWidth + barSpacing) * displayData.length + chartPadding * 2;
      
      // Nastavení SVG atributů
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", chartHeight);
      svg.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
      svg.setAttribute("class", "bar-chart");
      
      // Přidání stínu pro lepší vizuální vzhled
      const defs = document.createElementNS(svgNS, "defs");
      const filter = document.createElementNS(svgNS, "filter");
      filter.setAttribute("id", this.filterId);
      filter.setAttribute("x", "-20%");
      filter.setAttribute("y", "-20%");
      filter.setAttribute("width", "140%");
      filter.setAttribute("height", "140%");
      
      const feDropShadow = document.createElementNS(svgNS, "feDropShadow");
      feDropShadow.setAttribute("dx", "0");
      feDropShadow.setAttribute("dy", "4");
      feDropShadow.setAttribute("stdDeviation", "4");
      feDropShadow.setAttribute("flood-color", "rgba(0,0,0,0.2)");
      
      filter.appendChild(feDropShadow);
      defs.appendChild(filter);
      svg.appendChild(defs);
      
      // Přidání horizontálních linek (mřížky)
      for (let i = 1; i <= 5; i++) {
        const yPos = chartHeight - chartPadding - (i * 30);
        const gridLine = document.createElementNS(svgNS, "line");
        gridLine.setAttribute("x1", chartPadding);
        gridLine.setAttribute("y1", yPos);
        gridLine.setAttribute("x2", chartWidth - chartPadding);
        gridLine.setAttribute("y2", yPos);
        gridLine.setAttribute("stroke", "#e0e0e0");
        gridLine.setAttribute("stroke-width", "1");
        gridLine.setAttribute("stroke-dasharray", "3,3");
        svg.appendChild(gridLine);
        
        // Přidání popisku procentuální hodnoty pro mřížku
        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", chartPadding - 10);
        label.setAttribute("y", yPos + 5);
        label.setAttribute("text-anchor", "end");
        label.setAttribute("font-size", "10");
        label.setAttribute("fill", "#999");
        label.textContent = `${i * 20}%`;
        svg.appendChild(label);
      }
      
      // Vytvoření sloupců grafu
      displayData.forEach((item, index) => {
        const x = chartPadding + index * (barWidth + barSpacing);
        const barHeight = Math.min(item.percentage, 100) * 1.5; // Maximální výška pro 100%
        const y = chartHeight - chartPadding - barHeight;
        
        // Vytvoření sloupce
        const bar = document.createElementNS(svgNS, "rect");
        bar.setAttribute("x", x);
        bar.setAttribute("y", chartHeight - chartPadding); // Začíná na spodní straně
        bar.setAttribute("width", barWidth);
        bar.setAttribute("height", 0); // Začíná bez výšky
        bar.setAttribute("fill", this.options.colors[index % this.options.colors.length]);
        bar.setAttribute("rx", "4"); // Zaoblené rohy
        bar.setAttribute("ry", "4");
        bar.setAttribute("filter", `url(#${this.filterId})`);
        
        // Přidání animace při načtení
        bar.style.transition = "y 0.5s ease, height 0.5s ease";
        svg.appendChild(bar);
        
        // Přidání interaktivity, pokud je povolena
        if (this.options.interactive) {
          // Přidání hover efektu
          bar.addEventListener('mouseover', function() {
            this.setAttribute("fill-opacity", "0.9");
            this.style.transform = "scaleY(1.05)";
            this.style.transformOrigin = "bottom";
          });
          
          bar.addEventListener('mouseout', function() {
            this.setAttribute("fill-opacity", "1");
            this.style.transform = "scaleY(1)";
          });
        }
        
        // Nastavení animace pro postupné vykreslení sloupce
        setTimeout(() => {
          bar.setAttribute("y", y);
          bar.setAttribute("height", barHeight);
        }, 100 + index * 50);
        
        // Text s hodnotou nad sloupcem
        const valueText = document.createElementNS(svgNS, "text");
        valueText.setAttribute("x", x + barWidth / 2);
        valueText.setAttribute("y", y - 8);
        valueText.setAttribute("text-anchor", "middle");
        valueText.setAttribute("fill", "#333");
        valueText.setAttribute("font-size", "12");
        valueText.setAttribute("font-weight", "bold");
        valueText.textContent = `${item.percentage}%`;
        valueText.style.opacity = "0";
        valueText.style.transition = "opacity 0.3s ease";
        svg.appendChild(valueText);
        
        // Postupné zobrazení hodnoty
        setTimeout(() => {
          valueText.style.opacity = "1";
        }, 400 + index * 50);
        
        // Label pod sloupcem
        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", x + barWidth / 2);
        label.setAttribute("y", chartHeight - chartPadding + 20);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("fill", "#666");
        label.setAttribute("font-size", "11");
        
        // Omezení délky textu
        const labelText = item.option.length > 10 ? 
          item.option.substring(0, 9) + '...' : 
          item.option;
        
        label.textContent = labelText;
        label.setAttribute("title", item.option); // Pro zobrazení celého textu při najetí myši
        svg.appendChild(label);
        
        // Přidání počtu odpovědí
        const countText = document.createElementNS(svgNS, "text");
        countText.setAttribute("x", x + barWidth / 2);
        countText.setAttribute("y", chartHeight - chartPadding + 35);
        countText.setAttribute("text-anchor", "middle");
        countText.setAttribute("fill", "#999");
        countText.setAttribute("font-size", "10");
        countText.textContent = `(${item.count})`;
        svg.appendChild(countText);
      });
      
      // Přidání SVG do kontejneru
      container.appendChild(svg);
      
      return svg;
    }
}

// Export výchozí instance s defaultním nastavením
export default BarChart;