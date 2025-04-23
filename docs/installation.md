# FormBuilder - Návod k instalaci a spuštění

## Obsah
- [Požadavky](#požadavky)
- [Instalace](#instalace)
- [Spuštění aplikace](#spuštění-aplikace)
- [Vývoj a testování](#vývoj-a-testování)
- [Řešení problémů](#řešení-problémů)

## Požadavky

Pro spuštění aplikace FormBuilder potřebujete:

- Webový prohlížeč (doporučené nejnovější verze):
  - Google Chrome
  - Mozilla Firefox
  - Microsoft Edge
  - Safari
- Pro vývoj a testování:
  - Libovolný textový editor nebo IDE (doporučené: Visual Studio Code, WebStorm)
  - Základní znalost HTML, CSS a JavaScript
  - Node.js 14+ (volitelné, pro využití lokálního vývojového serveru)

## Instalace

FormBuilder je čistě klientská webová aplikace, která nepoužívá žádné externí knihovny vyžadující instalaci pomocí npm nebo jiných nástrojů. Veškerý kód je přímo součástí staženého projektu.

### Stažení projektu

1. Stáhněte si zdrojový kód aplikace FormBuilder jednou z následujících metod:

   **Metoda 1: Stažení ZIP archivu**
   - Přejděte na stránku s projektem
   - Klikněte na tlačítko "Download ZIP"
   - Rozbalte stažený archiv do požadovaného adresáře

   **Metoda 2: Klonování Git repozitáře** (vyžaduje Git)
   ```bash
   git clone https://github.com/your-username/kaj-semestralka.git
   cd kaj-semestralka
   ```

2. Po rozbalení/klonování projektu budete mít následující strukturu:
   ```
   kaj-semestralka/
   ├─ index.html            # Hlavní stránka
   ├─ README.md             # Dokumentace projektu
   └─ src/                  # Zdrojové soubory
      ├─ App.js
      ├─ AppModule.js
      ├─ components/
      ├─ controllers/
      ├─ css/
      ├─ models/
      ├─ services/
      └─ views/
   ```

## Spuštění aplikace

### Metoda 1: Přímé otevření v prohlížeči

Nejjednodušší způsob spuštění aplikace FormBuilder:

1. Otevřete soubor `index.html` ve vašem webovém prohlížeči
   - Dvojklikem na soubor v průzkumníku souborů
   - Nebo přetažením souboru do okna prohlížeče

**POZNÁMKA**: Při přímém otevírání HTML souborů z disku mohou být některé funkce aplikace omezené kvůli bezpečnostním omezením prohlížečů. Pro plnou funkčnost doporučujeme použít lokální server (viz níže).

### Metoda 2: Použití lokálního vývojového serveru

Pro plnou funkčnost a správnou činnost aplikace důrazně doporučujeme spustit ji na lokálním webovém serveru:

#### Použití Live Server ve Visual Studio Code (doporučeno)
1. Nainstalujte rozšíření "Live Server" z marketplace VS Code:
   - Otevřete VS Code
   - Klikněte na ikonu rozšíření v levém panelu nebo stiskněte Ctrl+Shift+X
   - Vyhledejte "Live Server" (od Ritwick Dey)
   - Klikněte na "Install"

2. Spuštění aplikace:
   - Otevřete složku projektu ve VS Code
   - Klikněte pravým tlačítkem na soubor `index.html` v průzkumníku souborů
   - Vyberte "Open with Live Server"
   - Aplikace se automaticky otevře v prohlížeči na adrese `http://localhost:5500` (nebo podobné)

#### Alternativní možnosti pro jiné editory

Mnoho moderních kódových editorů nabízí podobné rozšíření pro lokální server:
- **Atom**: "atom-live-server" rozšíření
- **Sublime Text**: "SublimeServer" balíček
- **WebStorm/PhpStorm**: mají vestavěný webový server

#### Použití Python SimpleHTTPServer (pokud nemáte výše uvedené možnosti)
Pro Python 3:
```bash
cd kaj-semestralka
python -m http.server
# Otevřete prohlížeč na http://localhost:8000
```

## Vývoj a testování

### Struktura projektu pro vývoj

Při úpravách aplikace mějte na paměti následující strukturu:

- `index.html` - Hlavní vstupní bod aplikace
- `src/css/` - CSS styly, `styles.css` importuje ostatní soubory
- `src/models/` - Datové modely (Form.js, Question.js)
- `src/views/` - Pohledy pro různé obrazovky (HTML + JS)
- `src/controllers/` - Kontrolery s logikou aplikace
- `src/components/` - Znovupoužitelné komponenty
- `src/services/` - Sdílené služby (StorageService, EventBus, Utils)