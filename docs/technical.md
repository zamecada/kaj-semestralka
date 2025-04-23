# FormBuilder - Technická dokumentace

## Obsah
- [Architektura aplikace](#architektura-aplikace)
- [Struktura projektu](#struktura-projektu)
- [Klíčové komponenty](#klíčové-komponenty)
- [Datový model](#datový-model)
- [Použité technologie a API](#použité-technologie-a-api)
- [Responzivní design](#responzivní-design)
- [Offline funkcionalita](#offline-funkcionalita)
- [SVG grafy](#svg-grafy)
- [Výkonnostní optimalizace](#výkonnostní-optimalizace)
- [Rozšiřitelnost a údržba](#rozšiřitelnost-a-údržba)

## Architektura aplikace

FormBuilder je postaven na modifikované architektuře **Model-View-Controller (MVC)** spolu s několika návrhovými vzory, které zajišťují modularitu, udržitelnost a rozšiřitelnost kódu.

### Návrhové vzory

1. **Singleton**
   - Implementován v `AppModule.js` pro zajištění jediné instance hlavního modulu aplikace
   - Poskytuje globální přístup ke sdíleným službám

   ```javascript
   class AppModule {
     static getInstance() {
       if (!AppModule.instance) {
         AppModule.instance = new AppModule();
       }
       return AppModule.instance;
     }
   }
   
   export const App = AppModule.getInstance();
   ```

2. **Observer (Pub/Sub)**
   - Implementován v `EventBus.js` pro komunikaci mezi komponentami
   - Umožňuje volně vázané komponenty, které spolu komunikují prostřednictvím publikování a odběru událostí

   ```javascript
   // Publikování události
   App.eventBus.publish('form:saved', formData);
   
   // Odběr události
   App.eventBus.subscribe('form:saved', (data) => {
     console.log('Formulář byl uložen:', data);
   });
   ```

3. **Factory**
   - Implementován v `Question.js` pro vytváření různých typů otázek
   - Zjednodušuje vytváření specifických typů otázek prostřednictvím statických metod

   ```javascript
   // Vytvoření otázky pomocí factory metody
   const textQuestion = Question.createText({ title: 'Textová otázka' });
   const radioQuestion = Question.createRadio({ title: 'Výběrová otázka' });
   ```

## Struktura projektu

```
kaj-semestralka
├─ index.html
├─ README.md
└─ src
   ├─ App.js
   ├─ AppModule.js
   ├─ components
   │  ├─ charts
   │  │  ├─ BarChart.js
   │  │  ├─ ChartManager.js
   │  │  └─ PieChart.js
   │  ├─ Footer.js
   │  ├─ Header.js
   │  ├─ Init.js
   │  └─ OfflineNotification.js
   ├─ controllers
   │  ├─ AdminController.js
   │  ├─ FormController.js
   │  ├─ FormPreviewController.js
   │  └─ FormResponseController.js
   ├─ css
   │  ├─ base.css
   │  ├─ buttons.css
   │  ├─ dashboard.css
   │  ├─ dialog.css
   │  ├─ form-builder.css
   │  ├─ landing-page.css
   │  ├─ layouts.css
   │  ├─ responsivity.css
   │  └─ styles.css
   ├─ models
   │  ├─ Form.js
   │  ├─ Question.js
   │  └─ QuestionTemplates.js
   ├─ services
   │  ├─ EventBus.js
   │  ├─ StorageService.js
   │  └─ Utils.js
   └─ views
      ├─ admin.html
      ├─ AdminView.js
      ├─ create.html
      ├─ form.html
      ├─ FormPreviewView.js
      ├─ FormResponseView.js
      ├─ FormView.js
      └─ preview.html
```

### Vrstva "models"

Modely reprezentují datové struktury a business logiku aplikace:

- `Form.js` - Reprezentuje formulář s metodami pro manipulaci s otázkami a validaci
- `Question.js` - Reprezentuje jednotlivé otázky s různými typy (text, radio, checkbox)
- `QuestionTemplates.js` - Poskytuje šablony HTML pro různé typy otázek

### Vrstva "views"

Pohledy jsou zodpovědné za uživatelské rozhraní a prezentaci dat:

- `FormView.js` - Pohled pro vytváření a úpravu formuláře
- `FormResponseView.js` - Pohled pro zobrazení a vyplnění formuláře
- `FormPreviewView.js` - Pohled pro náhled formuláře
- `AdminView.js` - Pohled pro administraci a zobrazení statistik

### Vrstva "controllers"

Kontrolery propojují modely a pohledy a zpracovávají uživatelské akce:

- `FormController.js` - Řídí vytváření a úpravu formuláře
- `FormResponseController.js` - Řídí vyplňování formuláře
- `FormPreviewController.js` - Řídí náhled formuláře
- `AdminController.js` - Řídí administraci a zobrazení statistik

### Vrstva "Services"

Služby poskytují funkce sdílené napříč aplikací:

- `StorageService.js` - Správa ukládání dat (localStorage)
- `EventBus.js` - Komunikace mezi komponentami
- `Utils.js` - Pomocné funkce pro celou aplikaci

## Klíčové komponenty

App.js

- Vstupní bod JavaScript aplikace, který řídí inicializaci celého systému
- Detekuje aktuálně zobrazenou stránku a dynamicky načítá příslušné moduly
- Implementuje "lazy loading" pro optimalizaci výkonu (načítá pouze potřebné komponenty)
- Propojuje kontrolery s odpovídajícími pohledy podle aktuálního kontextu
- Publikuje události o stavu aplikace prostřednictvím EventBus

AppModule.js

- Centrální modul aplikace implementující návrhový vzor Singleton
- Poskytuje globální přístup ke sdíleným službám pro všechny komponenty
- Inicializuje a spravuje všechny klíčové služby (EventBus, StorageService)
- Uchovává reference na aktivní kontrolery pro snadný přístup
- Zajišťuje konzistentní přístup k datům napříč aplikací

EventBus.js

- Implementace návrhového vzoru Observer (Pub/Sub) pro komunikaci mezi komponentami
- Umožňuje volné vázání komponent bez vytváření přímých závislostí
- Poskytuje metody pro publikování událostí a přihlášení k odběru
- Každá komponenta může publikovat události nebo reagovat na události z jiných částí aplikace
- Zlepšuje modularitu a testovatelnost díky oddělení komunikační logiky

StorageService.js

- Služba pro ukládání a načítání dat s využitím localStorage API
- Implementuje detekci online/offline stavu a poskytuje odpovídající notifikace
- Organizuje data pro efektivní přístup (ukládá formuláře jednotlivě i v seznamu)
- Poskytuje metody pro načítání formulářů, ukládání odpovědí a manipulaci s daty
- Abstrahuje přístup k úložišti za jednotné rozhraní pro snadnou možnou budoucí změnu implementace

## Datový model

### Formulář (Form.js)

Reprezentace formuláře s otázkami a odpověďmi:

```javascript
{
  id: "unique_id_123",
  title: "Zpětná vazba na událost",
  description: "Prosím, vyplňte formulář s vaší zpětnou vazbou.",
  questions: [
    {
      id: "q1",
      type: "text",
      title: "Vaše jméno",
      required: true,
      options: []
    },
    {
      id: "q2",
      type: "radio",
      title: "Jak hodnotíte událost?",
      required: true,
      options: ["Výborná", "Dobrá", "Průměrná", "Špatná"]
    },
    {
      id: "q3",
      type: "checkbox",
      title: "Co se vám líbilo?",
      required: false,
      options: ["Organizace", "Témata", "Přednášející", "Občerstvení"]
    }
  ],
  createdAt: "2023-04-15T14:30:00.000Z",
  pin: "1234",
  responses: [
    {
      answers: {
        "q1": "Jan Novák",
        "q2": "Výborná",
        "q3": ["Organizace", "Témata"]
      },
      submittedAt: "2023-04-16T10:15:00.000Z"
    }
  ]
}
```

### Otázka (Question.js)

Reprezentace jednotlivých otázek:

```javascript
export class Question {
  constructor(type, data = {}) {
    this.id = data.id || generateID();
    this.type = type;
    this.title = data.title || '';
    this.required = data.required || false;
    
    // Nastavení výchozích možností podle typu
    if (type === 'text') {
      this.options = data.options || [];
    } else {
      // Pro radio a checkbox, defaultně dvě prázdné možnosti
      this.options = data.options || ['', ''];
    }
  }
  
  // Metody pro práci s otázkou
  addOption() { /* ... */ }
  removeOption(index) { /* ... */ }
  updateOption(index, text) { /* ... */ }
  validate() { /* ... */ }
  toJSON() { /* ... */ }
  
  // Statické factory metody
  static createText(data = {}) { /* ... */ }
  static createRadio(data = {}) { /* ... */ }
  static createCheckbox(data = {}) { /* ... */ }
}
```

## Použité technologie a API

### HTML5 API

- **Sémantické elementy**: `<header>`, `<footer>`, `<nav>`, `<main>`, `<section>`, `<article>`
- **Formulářové prvky**: Různé typy vstupů, validace
- **SVG**: Implementace interaktivních grafů
- **Data atributy**: Pro ukládání metadat k DOM elementům

### CSS3

- **Flexbox**: Pro jednorozměrné layouty
- **Grid**: Pro komplexní dvourozměrné layouty
- **Proměnné (CSS Variables)**: Pro konzistentní barvy a hodnoty
- **Transformace a přechody**: Pro animace a efekty
- **Media Queries**: Pro responzivní design

### JavaScript API

- **ES6+ funkce**: Arrow funkce, třídy, moduly, async/await
- **Web Storage API**: localStorage pro ukládání dat
- **SVG DOM API**: Pro programovou manipulaci s grafy
- **Online/Offline API**: Detekce stavu připojení
- **History API**: Pro správu navigace

## Responzivní design

Aplikace implementuje responzivní design pomocí následujících technik:

1. **Media Queries**
   ```css
   @media (max-width: 768px) {
     .hero .container {
       flex-direction: column;
       text-align: center;
     }
   }
   
   @media (max-width: 480px) {
     header .container {
       flex-direction: column;
       gap: 15px;
     }
   }
   ```

2. **Flexbox & Grid Layouts**
   ```css
   .features-grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
     gap: 30px;
   }
   ```

3. **Relativní jednotky**
   - Použití `rem`, `em`, `%` a `vh`/`vw` místo pevných pixelových hodnot
   - Použití `max-width` pro omezení šířky na větších obrazovkách

4. **Přizpůsobení obsahu**
   - Pro mobilní zařízení jsou některé prvky skryty nebo zobrazeny jinak
   - Upravená velikost fontů a spacing pro různé velikosti obrazovek

## Offline funkcionalita

Aplikace podporuje offline režim pomocí následujících technik:

1. **Detekce stavu připojení**
   ```javascript
   window.addEventListener('online', handleOnline);
   window.addEventListener('offline', handleOffline);
   ```

2. **Notifikace o stavu připojení**
   ```javascript
   export class OfflineNotification {
     constructor() {
       this.element = null;
       this.visible = false;
       this.storageService = App.storageService;
       
       this._init();
     }
     
     _init() {
       // Vytvoření notifikačního elementu
       // ...
       
       // Přidání posluchačů pro stav připojení
       this.removeListeners = this.storageService.addConnectionListeners(
         () => this.hide(),
         () => this.show()
       );
     }
   }
   ```

3. **Lokální ukládání dat**
   - Veškerá data jsou ukládána v localStorage
   - Při offline režimu jsou data stále dostupná a aktualizovatelná
   - Po obnovení připojení není potřeba žádná synchronizace (vše je lokální)

## SVG grafy

Aplikace implementuje vlastní SVG grafy pro vizualizaci dat:

### BarChart.js (Sloupcový graf)

```javascript
export class BarChart {
  constructor(options = {}) {
    this.options = {
      colors: ['#6c63ff', '#7d75ff', /* další barvy */],
      barWidth: 40,
      barSpacing: 20,
      chartPadding: 30,
      chartHeight: 220,
      interactive: true,
      ...options
    };
  }
  
  render(container, data) {
    // Vytvoření SVG elementu
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    
    // Nastavení rozměrů
    const { barWidth, barSpacing, chartPadding, chartHeight } = this.options;
    const chartWidth = (barWidth + barSpacing) * data.length + chartPadding * 2;
    
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", chartHeight);
    svg.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
    
    // Animace sloupců
    data.forEach((item, index) => {
      // ...
      setTimeout(() => {
        bar.setAttribute("y", y);
        bar.setAttribute("height", barHeight);
      }, 100 + index * 50);
    });
    
    return svg;
  }
}
```

### PieChart.js (Koláčový graf)

```javascript
export class PieChart {
  constructor(options = {}) {
    this.options = {
      colors: ['#6c63ff', '#4caf50', /* další barvy */],
      size: 240,
      radius: 80,
      showLegend: true,
      interactive: true,
      showTooltip: true,
      animation: true,
      ...options
    };
  }
  
  render(container, data) {
    // Vytvoření SVG elementu
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    
    // Výpočet úhlů a vytvoření výsečí
    let currentAngle = 0;
    
    data.forEach((item, index) => {
      const angleSize = (item.percentage / 100) * 360;
      const endAngle = currentAngle + angleSize;
      
      // Vytvoření SVG path pro výseč
      const path = document.createElementNS(svgNS, "path");
      // ...
      
      // Animace při načtení
      setTimeout(() => {
        path.style.opacity = "1";
        path.style.transform = "scale(1)";
      }, 100 + index * 80);
      
      currentAngle = endAngle;
    });
    
    return svg;
  }
}
```

## Výkonnostní optimalizace

Aplikace implementuje několik optimalizací pro zajištění rychlého a plynulého uživatelského zážitku:

1. **Lazy loading komponent**
   ```javascript
   // Načtení pouze potřebných modulů podle aktuální stránky
   if (currentPagePath.includes('/src/views/create.html')) {
     const { FormView } = await import('./views/FormView.js');
     const { FormController } = await import('./controllers/FormController.js');
     // ...
   }
   ```

2. **Efektivní práce s DOM**
   - Používání `DocumentFragment` pro hromadné operace s DOM
   - Minimalizace reflow a repaint operací
   - Optimalizované manipulace s SVG elementy

3. **Animace optimalizované pro výkon**
   - CSS transformace a opacity místo změn rozměrů nebo pozice
   - Využití hardware akcelerace pomocí `transform: translateZ(0)`
   - Postupné animace pro snížení zatížení při vykreslování

4. **Optimalizace localStorage**
   - Ukládání jednotlivých formulářů samostatně pro rychlejší přístup
   - Minimalizace četnosti operací zápisu do localStorage

## Rozšiřitelnost a údržba

Aplikace je navržena s ohledem na snadnou rozšiřitelnost a údržbu:

1. **Modulární architektura**
   - Každá funkce je izolována ve vlastním modulu
   - Jasně definované rozhraní mezi komponentami

2. **Návrhové vzory**
   - Singleton pro globální přístup ke službám
   - Observer pro volně vázanou komunikaci
   - Factory pro snadné vytváření nových typů objektů

3. **Konzistentní kódový styl**
   - Používání ES6+ syntaxe
   - Komentáře dokumentující funkce a třídy
   - Dodržování konvencí pojmenování

4. **Rozšiřitelnost**
   - Snadné přidání nových typů otázek
   - Modulární systém umožňující přidávání nových funkcí
   - Jasné API pro implementaci dalších typů grafů nebo exportních formátů

## Závěr

FormBuilder demonstruje robustní implementaci moderní webové aplikace využívající nejnovější HTML5, CSS3 a JavaScript technologie. Díky důrazu na modularitu, výkon a uživatelskou zkušenost poskytuje solidní základ pro další vývoj a rozšiřování funkcionality.