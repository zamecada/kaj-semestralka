# FormBuilder - Postup vývoje

## Evoluční přístup k vývoji aplikace

Vývoj aplikace FormBuilder probíhal v několika fázích, které odrážejí postupný přechod od jednoduché struktury k pokročilé MVC architektuře. Tento dokument popisuje skutečný průběh vývoje, výzvy a zásadní rozhodnutí.

## Fáze 1: Počáteční vývoj (10. - 16. března 2025)

Na začátku projektu byla struktura velmi jednoduchá:

- Vytvoření základního README.md s popisem projektu
- Implementace landing page s jednoduchým HTML a CSS
- Základní komponenty pro header a footer

Již v této fázi jsem měl jasnou představu o funkcionalitě aplikace, ale architektura byla velmi přímočará a nestrukturovaná.

```
kaj-semestralka/
├─ index.html               # Hlavní stránka
├─ README.md                # Dokumentace projektu
└─ src/
   ├─ components/           # Jednoduché komponenty
   │  ├─ footer.js
   │  └─ header.js
   └─ css/                  # Jeden velký CSS soubor
      └─ styles.css
```

## Fáze 2: Experimentální přístup (16. března 2025)

V další fázi jsem začal implementovat první verzi funkčnosti pro vytváření formulářů. V této fázi jsem experimentoval s různými přístupy, což je vidět na vzniku více verzí některých souborů:

- Vytvoření různých verzí aplikační logiky (App.js, app2.js)
- Implementace modulů pro generování formulářů (formGenerator.js, formGenerator2.js)
- Různé přístupy k ukládání dat (storage.js, storage2.js)
- Vytvoření základních utilit a šablon pro otázky

Tato fáze byla charakteristická experimentováním a hledáním nejlepšího řešení. Struktura kódu byla stále monolitická a chybělo jasné oddělení zodpovědností.

```
kaj-semestralka/
├─ index.html
├─ README.md
└─ src/
   ├─ App.js                        # První verze aplikační logiky
   ├─ app2.js                       # Alternativní verze
   ├─ components/
   ├─ modules/                      # Experimentální moduly
   │  ├─ formGenerator.js
   │  ├─ formGenerator2.js
   │  ├─ storage.js
   │  ├─ storage2.js
   │  └─ utils.js
   ├─ templates/
   │  └─ questionTemplates.js
   └─ views/
      └─ create.html
```

## Fáze 3: Rozšíření funkčnosti a reorganizace (20. dubna 2025)

Po několika týdnech jsem projekt reorganizoval a rozšířil o další pohledy a funkčnosti:

### Reorganizace CSS
Velký monolitický CSS soubor byl rozdělen do logických modulů:
- base.css - základní reset a proměnné
- buttons.css - styly tlačítek
- dashboard.css - styly pro administrační dashboard
- dialog.css - styly pro modální okna
- form-builder.css - styly pro editor formulářů
- landing-page.css - styly úvodní stránky
- layouts.css - základní layouty
- responsivity.css - media queries

### Přidání nových pohledů
Byly implementovány další klíčové pohledy aplikace:
- admin.html + adminHandler.js - správa a analýza formulářů
- preview.html + previewHandler.js - náhled formuláře před publikací
- form.html + formHandler.js - vyplňování formuláře respondentem

Stále jsem však používal monolitický přístup, kde každý handler obsahoval veškerou logiku pro danou stránku, což vedlo k:
- Duplicitnímu kódu napříč handlery
- Obtížné testovatelnosti
- Provázání datové logiky, logiky zobrazení a zpracování akcí

## Fáze 4: Počátek refaktoringu na MVC (20. dubna 2025)

V této fázi jsem si uvědomil limity původní architektury a rozhodl se pro kompletní refaktoring na MVC (Model-View-Controller) architekturu:

- Vytvoření prvních modelů (Form.js, Question.js)
- Implementace FormController.js - první controller
- Začátek vývoje služeb (EventBus.js, StorageService.js)
- Vytvoření prvního pohledu v objektově orientovaném stylu (FormView.js)
- Implementace AppModule.js jako centrálního modulu aplikace

V této fázi existovaly paralelně dvě implementace - původní monolitická a nová MVC architektura.

## Fáze 5: Kompletní přechod na MVC (21. dubna 2025)

V rámci Fáze 5 jsem konečně celý projekt úspěšně překlopil do plně objektově orientované MVC architektury a zbavil jsem se původní monolitické implementace:

- Odstranění všech původních handlerů (adminHandler.js, formHandler.js, atd.)
- Vytvoření kompletní sady kontrolerů (AdminController.js, FormResponseController.js, FormPreviewController.js)
- Implementace odpovídajících pohledů (AdminView.js, FormResponseView.js, FormPreviewView.js)
- Přidání OfflineNotification.js komponenty
- Úprava hlavního App.js pro dynamické načítání modulů podle aktuální stránky

Zásadní změny v architektuře:
1. **Čistý MVC přístup** - oddělení dat, business logiky a UI
2. **Modularita** - každá komponenta má jednu zodpovědnost
3. **Dependency Injection** - předávání závislostí přes konstruktory
4. **Event-driven komunikace** - použití EventBus pro komunikaci mezi komponentami

```
kaj-semestralka/
├─ index.html
├─ README.md
└─ src/
   ├─ App.js                         # Inicializace aplikace
   ├─ AppModule.js                   # Hlavní modul (Singleton)
   ├─ components/
   │  └─ OfflineNotification.js
   ├─ controllers/                   # MVC kontrolery
   │  ├─ AdminController.js
   │  ├─ FormController.js
   │  ├─ FormPreviewController.js
   │  └─ FormResponseController.js
   ├─ css/                           # Modulární CSS
   ├─ models/                        # MVC modely
   │  ├─ Form.js
   │  └─ Question.js
   ├─ services/                      # Služby
   │  ├─ EventBus.js
   │  ├─ StorageService.js
   │  └─ Utils.js
   └─ views/                         # MVC pohledy
      ├─ admin.html
      ├─ AdminView.js
      ├─ create.html
      ├─ form.html
      ├─ FormPreviewView.js
      ├─ FormResponseView.js
      ├─ FormView.js
      └─ preview.html
```

## Fáze 6: Implementace pokročilých funkcí - SVG grafy (22. dubna 2025)

Po úspěšném přechodu na MVC architekturu jsem se zaměřil na implementaci pokročilých funkcí splňujících požadavky zadání - vlastní SVG grafy:

- Implementace BarChart.js - sloupcový graf pro zobrazení dat z multiple-choice otázek
- Implementace PieChart.js - koláčový graf pro zobrazení dat z single-choice otázek
- Vytvoření ChartManager.js pro správu a renderování grafů
- Úprava AdminView.js pro využití grafů

Vytvoření vlastních SVG grafů namísto použití externí knihovny bylo důležitým rozhodnutím, které:
1. Eliminovalo externí závislosti
2. Umožnilo plnou kontrolu nad vzhledem a chováním grafů
3. Demonstrovalo pokročilé použití SVG a JavaScript APIs

## Fáze 7: Finální úpravy a optimalizace (22. dubna 2025)

V poslední fázi vývoje jsem se zaměřil na:
- Opravy drobných chyb
- Zlepšení uživatelského zážitku
- Optimalizaci kódu
- Finalizaci dokumentace