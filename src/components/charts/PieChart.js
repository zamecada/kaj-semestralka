/**
 * Modul pro vykreslování koláčových grafů
 * @module components/charts/PieChart
 */

/**
 * Třída pro vytváření koláčových grafů
 */
export class PieChart {
    /**
     * Vytvoří instanci koláčového grafu
     * @param {Object} options - Nastavení grafu
     * @param {Array} options.colors - Pole barev pro výseče grafu
     * @param {number} options.size - Velikost grafu v pixelech
     * @param {number} options.radius - Poloměr koláče v pixelech
     * @param {boolean} options.showLegend - Zda zobrazit legendu
     * @param {boolean} options.interactive - Zda mají výseče reagovat na hover efekty
     * @param {boolean} options.showTooltip - Zda zobrazit tooltip při najetí na výseč
     * @param {boolean} options.animation - Zda použít animace při vykreslení
     */
    constructor(options = {}) {
      // Nastavení výchozích hodnot
      this.options = {
        colors: [
          '#6c63ff', '#4caf50', '#ff9800', '#e91e63', 
          '#9c27b0', '#2196f3', '#607d8b', '#795548'
        ],
        size: 240,
        radius: 80,
        showLegend: true,
        interactive: true,
        showTooltip: true,
        animation: true,
        ...options
      };
      
      // Generování unikátních ID pro gradienty a filtry
      this.bgGradientId = `pie-bg-gradient-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      this.shadowId = `pie-shadow-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    /**
     * Vykreslí koláčový graf jako SVG prvek uvnitř zadaného kontejneru
     * @param {HTMLElement} container - DOM prvek, do kterého bude SVG graf připojen
     * @param {Array<Object>} data - Pole datových objektů, které mají být zobrazeny v grafu
     * @param {string} data[].option - Popisek výseče, zobrazený v legendě
     * @param {number} data[].percentage - Procentuální velikost výseče (0–100)
     * @param {number} data[].count - Počet odpovědí pro danou možnost
     * @returns {SVGElement} Vytvořené SVG s grafem
     */
    render(container, data) {
      // Filtrování nulových hodnot
      const filteredData = data.filter(item => item.percentage > 0);
      
      // Pokud nejsou žádná data, nezobrazujeme graf
      if (filteredData.length === 0) {
        const noDataMsg = document.createElement('p');
        noDataMsg.textContent = 'Nedostatek dat pro zobrazení grafu.';
        noDataMsg.style.textAlign = 'center';
        noDataMsg.style.fontStyle = 'italic';
        noDataMsg.style.color = '#999';
        container.appendChild(noDataMsg);
        return null;
      }
      
      // Vytvoření SVG elementu
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      
      // Výpočet rozměrů grafu
      const { size, radius, showLegend } = this.options;
      const chartWidth = size;
      const chartHeight = showLegend ? size + 30 : size; // Extra prostor pro legendu
      
      // Nastavení SVG atributů
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", chartHeight);
      svg.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
      svg.setAttribute("class", "pie-chart");
      
      // Přidání stínu pro 3D efekt
      const defs = document.createElementNS(svgNS, "defs");
      
      // Vytvoření gradientu pro pozadí
      const backgroundGradient = document.createElementNS(svgNS, "radialGradient");
      backgroundGradient.setAttribute("id", this.bgGradientId);
      
      const stop1 = document.createElementNS(svgNS, "stop");
      stop1.setAttribute("offset", "0%");
      stop1.setAttribute("stop-color", "#f9f9f9");
      
      const stop2 = document.createElementNS(svgNS, "stop");
      stop2.setAttribute("offset", "100%");
      stop2.setAttribute("stop-color", "#f0f0f0");
      
      backgroundGradient.appendChild(stop1);
      backgroundGradient.appendChild(stop2);
      defs.appendChild(backgroundGradient);
      
      // Vytvoření filtru pro stín
      const filter = document.createElementNS(svgNS, "filter");
      filter.setAttribute("id", this.shadowId);
      filter.setAttribute("x", "-20%");
      filter.setAttribute("y", "-20%");
      filter.setAttribute("width", "140%");
      filter.setAttribute("height", "140%");
      
      const feDropShadow = document.createElementNS(svgNS, "feDropShadow");
      feDropShadow.setAttribute("dx", "0");
      feDropShadow.setAttribute("dy", "3");
      feDropShadow.setAttribute("stdDeviation", "3");
      feDropShadow.setAttribute("flood-color", "rgba(0,0,0,0.2)");
      
      filter.appendChild(feDropShadow);
      defs.appendChild(filter);
      svg.appendChild(defs);
      
      // Vykreslení pozadí kruhu
      const background = document.createElementNS(svgNS, "circle");
      background.setAttribute("cx", chartWidth / 2);
      background.setAttribute("cy", size / 2);
      background.setAttribute("r", radius + 5); // Trochu větší než samotný koláč
      background.setAttribute("fill", `url(#${this.bgGradientId})`);
      svg.appendChild(background);
      
      // Výpočet celkového počtu pro kontrolu
      const total = filteredData.reduce((sum, item) => sum + item.percentage, 0);
      
      // Upravit procentuální hodnoty tak, aby celkový součet byl 100%
      const adjustedData = filteredData.map(item => ({
        ...item,
        adjustedPercentage: (item.percentage / total) * 100
      }));
      
      // Centrum koláče
      const centerX = chartWidth / 2;
      const centerY = size / 2;
      
      // Vytvoření koláčového grafu
      let currentAngle = 0;
      
      // Skupina pro všechny výseče
      const pieGroup = document.createElementNS(svgNS, "g");
      pieGroup.setAttribute("transform", `translate(${centerX}, ${centerY})`);
      
      adjustedData.forEach((item, index) => {
        // Výpočet úhlů pro výseč
        const angleSize = (item.adjustedPercentage / 100) * 360;
        const endAngle = currentAngle + angleSize;
        
        // Výpočet bodů pro SVG path
        const startX = Math.cos(currentAngle * Math.PI / 180) * radius;
        const startY = Math.sin(currentAngle * Math.PI / 180) * radius;
        
        const endX = Math.cos(endAngle * Math.PI / 180) * radius;
        const endY = Math.sin(endAngle * Math.PI / 180) * radius;
        
        // Určení, zda je výseč větší než 180 stupňů
        const largeArcFlag = angleSize > 180 ? 1 : 0;
        
        // Vytvoření SVG path pro výseč
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", `
          M 0 0
          L ${startX} ${startY}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
          Z
        `);
        
        // Přidání stylu
        path.setAttribute("fill", this.options.colors[index % this.options.colors.length]);
        path.setAttribute("stroke", "#fff");
        path.setAttribute("stroke-width", "1");
        path.setAttribute("filter", `url(#${this.shadowId})`);
        
        // Animace při načtení, pokud je povoleno
        if (this.options.animation) {
          path.style.opacity = "0";
          path.style.transform = "scale(0.8)";
          path.style.transformOrigin = "center";
          path.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        }
        
        // Přidání datových atributů pro interakci
        path.dataset.option = item.option;
        path.dataset.percentage = item.adjustedPercentage.toFixed(1);
        path.dataset.count = item.count;
        
        // Přidání interaktivity, pokud je povolena
        if (this.options.interactive) {
          path.addEventListener('mouseover', function() {
            this.style.transform = "scale(1.05)";
            this.style.stroke = "#fff";
            this.style.strokeWidth = "2px";
            
            // Zobrazení tooltip s informacemi, pokud je povoleno
            if (this.options && this.options.showTooltip) {
              const tooltip = document.getElementById('pie-tooltip') || document.createElement('div');
              if (!tooltip.id) {
                tooltip.id = 'pie-tooltip';
                tooltip.style.position = 'absolute';
                tooltip.style.background = 'rgba(0,0,0,0.8)';
                tooltip.style.color = '#fff';
                tooltip.style.padding = '5px 10px';
                tooltip.style.borderRadius = '4px';
                tooltip.style.fontSize = '12px';
                tooltip.style.pointerEvents = 'none';
                tooltip.style.zIndex = '1000';
                tooltip.style.transition = 'opacity 0.3s';
                document.body.appendChild(tooltip);
              }
              
              tooltip.innerHTML = `
                <div><strong>${this.dataset.option}</strong></div>
                <div>${this.dataset.percentage}% (${this.dataset.count})</div>
              `;
              
              tooltip.style.opacity = '1';
              
              // Pozice tooltip
              const svgRect = svg.getBoundingClientRect();
              const angle = currentAngle + (angleSize / 2);
              const tooltipX = svgRect.left + centerX + Math.cos(angle * Math.PI / 180) * (radius / 2);
              const tooltipY = svgRect.top + centerY + Math.sin(angle * Math.PI / 180) * (radius / 2);
              
              tooltip.style.left = `${tooltipX}px`;
              tooltip.style.top = `${tooltipY}px`;
              tooltip.style.transform = 'translate(-50%, -50%)';
            }
          }.bind({ ...path, options: this.options }));
          
          path.addEventListener('mouseout', function() {
            this.style.transform = "scale(1)";
            this.style.stroke = "#fff";
            this.style.strokeWidth = "1px";
            
            const tooltip = document.getElementById('pie-tooltip');
            if (tooltip) {
              tooltip.style.opacity = '0';
            }
          });
        }
        
        pieGroup.appendChild(path);
        
        // Přidání popisku pro větší výseče (více než 10%)
        if (item.adjustedPercentage >= 10) {
          const labelAngle = currentAngle + (angleSize / 2);
          const labelRadius = radius * 0.7; // Trochu blíže ke středu
          const labelX = Math.cos(labelAngle * Math.PI / 180) * labelRadius;
          const labelY = Math.sin(labelAngle * Math.PI / 180) * labelRadius;
          
          const label = document.createElementNS(svgNS, "text");
          label.setAttribute("x", labelX);
          label.setAttribute("y", labelY);
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("dominant-baseline", "middle");
          label.setAttribute("fill", "#fff");
          label.setAttribute("font-size", "11");
          label.setAttribute("font-weight", "bold");
          label.textContent = `${Math.round(item.adjustedPercentage)}%`;
          
          // Animace pro popisek, pokud je povoleno
          if (this.options.animation) {
            label.style.opacity = "0";
            label.style.transition = "opacity 0.5s ease 0.5s"; // Opožděná animace
          }
          
          pieGroup.appendChild(label);
          
          // Zobrazení popisku po animaci výsečí
          if (this.options.animation) {
            setTimeout(() => {
              label.style.opacity = "1";
            }, 800);
          }
        }
        
        // Aktualizace úhlu pro další výseč
        currentAngle = endAngle;
        
        // Postupné zobrazení výsečí, pokud je povoleno
        if (this.options.animation) {
          setTimeout(() => {
            path.style.opacity = "1";
            path.style.transform = "scale(1)";
          }, 100 + index * 80);
        }
      });
      
      svg.appendChild(pieGroup);
      
      // Přidání legendy, pokud je povoleno
      if (this.options.showLegend) {
        const legendGroup = document.createElementNS(svgNS, "g");
        legendGroup.setAttribute("transform", `translate(${centerX}, ${size + 20})`);
        
        // Vypočítáme pozice pro legendu
        const legendItems = Math.min(adjustedData.length, 8); // Omezíme počet položek v legendě
        const legendWidth = chartWidth - 40;
        const legendItemWidth = legendWidth / legendItems;
        
        adjustedData.slice(0, legendItems).forEach((item, index) => {
          const x = (index - legendItems / 2 + 0.5) * legendItemWidth;
          
          // Barevný obdélník
          const rect = document.createElementNS(svgNS, "rect");
          rect.setAttribute("x", x - 15);
          rect.setAttribute("y", -5);
          rect.setAttribute("width", 10);
          rect.setAttribute("height", 10);
          rect.setAttribute("fill", this.options.colors[index % this.options.colors.length]);
          rect.setAttribute("rx", "2");
          rect.setAttribute("ry", "2");
          legendGroup.appendChild(rect);
          
          // Popisek
          const label = document.createElementNS(svgNS, "text");
          label.setAttribute("x", x);
          label.setAttribute("y", 0);
          label.setAttribute("text-anchor", "start");
          label.setAttribute("fill", "#666");
          label.setAttribute("font-size", "10");
          
          // Zkrácení textu, pokud je příliš dlouhý
          const maxLength = Math.floor(legendItemWidth / 6);
          const labelText = item.option.length > maxLength ? 
            item.option.substring(0, maxLength - 2) + '...' : 
            item.option;
          
          label.textContent = labelText;
          legendGroup.appendChild(label);
        });
        
        svg.appendChild(legendGroup);
      }
      
      // Přidání SVG do kontejneru
      container.appendChild(svg);
      
      return svg;
    }
}

// Export výchozí instance s defaultním nastavením
export default PieChart;