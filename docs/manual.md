# FormBuilder - Uživatelský manuál

## Obsah
- [Úvod](#úvod)
- [Hlavní funkce](#hlavní-funkce)
- [Jak začít?](#jak-začít)
- [Vytváření formulářů](#vytváření-formulářů)
- [Sdílení formuláře](#sdílení-formuláře)
- [Vyplňování formuláře](#vyplňování-formuláře)
- [Administrace a statistiky](#administrace-a-statistiky)

## Úvod

FormBuilder je webová aplikace, která vám umožňuje snadno vytvářet, sdílet a spravovat online formuláře. Na rozdíl od většiny obdobných nástrojů, FormBuilder uchovává všechna data lokálně ve vašem prohlížeči, takže nepotřebujete ani registraci, ani internetové připojení pro práci s aplikací (pokud jej máte stažený na svém počítači).

## Hlavní funkce:

- Vytváření formulářů s různými typy otázek (text, jednoduchý výběr, vícenásobný výběr)
- Okamžité sdílení formulářů pomocí odkazu
- Sběr a správa odpovědí
- Vizualizace statistik pomocí interaktivních grafů
- Export dat do CSV formátu

## Jak začít?

1. Otevřete webovou aplikaci FormBuilder ve vašem prohlížeči.
2. Na úvodní stránce najdete stručný přehled funkcí a možností.
3. Pro zahájení tvorby formuláře klikněte na tlačítko "Vytvořit nový formulář".

## Vytváření formulářů

### Základní informace o formuláři

1. Zadejte název formuláře do pole "Název formuláře". Toto je povinné pole.
2. Můžete přidat volitelný popis formuláře, který pomůže respondentům pochopit účel.

### Přidávání otázek

1. Klikněte na tlačítko "Přidat otázku" ve spodní části formuláře.
2. Vyberte typ otázky z následujících možností:
   - **Textová odpověď**: Pro otevřené odpovědi respondentů
   - **Výběr jedné možnosti**: Pro výběr jedné z předdefinovaných možností (radio button)
   - **Zaškrtávací pole**: Pro možnost výběru více odpovědí (checkbox)

### Nastavení otázky

Po přidání otázky můžete upravit její vlastnosti:

1. **Text otázky**: Zadejte jasný a srozumitelný text otázky.
2. **Povinná otázka**: Zaškrtněte toto pole, pokud chcete, aby respondent musel na otázku odpovědět.
3. **Možnosti odpovědí** (pro výběrové otázky):
   - Předvyplněny jsou dvě možnosti
   - Kliknutím na "Přidat možnost" přidáte další možnost
   - Pomocí ikony "×" můžete nepotřebnou možnost odstranit (minimum jsou dvě možnosti)
   - Kliknutím do textového pole můžete upravit text možnosti

### Úprava a odstranění otázek

- Kliknutím na ikonu koše v pravém horním rohu otázky můžete celou otázku odstranit
- Všechny nastavení otázky můžete kdykoli změnit

### Náhled formuláře

Před finálním uložením formuláře si můžete zobrazit jeho náhled:

1. Klikněte na tlačítko "Náhled formuláře"
2. Otevře se nové okno s náhledem, jak bude formulář vypadat pro respondenty
3. Zavřete náhled a pokračujte v úpravách, nebo formulář uložte

### Uložení formuláře

1. Po dokončení úprav klikněte na tlačítko "Dokončit a uložit formulář"
2. Zobrazí se vám dialogové okno s důležitými informacemi:
   - **Odkaz pro respondenty**: URL, které můžete sdílet s lidmi, aby vyplnili váš formulář
   - **Odkaz pro administraci**: URL pro přístup k výsledkům a statistikám
   - **PIN pro přístup**: Číselný kód potřebný pro zobrazení administračního rozhraní

**DŮLEŽITÉ**: Zkopírujte a bezpečně uschovejte všechny tři informace. Bez nich nebudete mít přístup k výsledkům! (ačkoliv zkušený uživatel si může data najít v LocalStorage)

## Sdílení formuláře

Pro sdílení formuláře s respondenty máte následující možnosti:

1. **Přímo z dialogu po vytvoření**:
   - Použijte tlačítko "kopírovat" vedle odkazu pro respondenty
   - Sdílejte zkopírovaný odkaz prostřednictvím e-mailu, chatu nebo sociálních sítí

2. **Pomocí administračního rozhraní**:
   - Přejděte na odkaz pro administraci
   - Zadejte svůj PIN
   - Odkaz pro respondenty najdete v horní části dashboardu

## Vyplňování formuláře

Jako respondent je vyplnění formuláře jednoduché:

1. Otevřete odkaz, který jste obdrželi
2. Vyplňte jednotlivé otázky podle pokynů
   - Otázky označené hvězdičkou (*) jsou povinné
   - U otázek s výběrem jedné možnosti vyberte právě jednu odpověď
   - U zaškrtávacích polí můžete vybrat libovolný počet odpovědí
3. Klikněte na tlačítko "Odeslat odpověď"
4. Po úspěšném odeslání se zobrazí potvrzení
5. Můžete zavřít okno nebo vyplnit formulář znovu (pokud je to povoleno)

## Administrace a statistiky

### Přístup k administraci

1. Otevřete odkaz pro administraci, který jste dostali při vytvoření formuláře
2. Zadejte 4-místný PIN
3. Klikněte na "Odemknout administraci"

### Přehled statistik

Po přihlášení uvidíte:

1. **Přehled odpovědí**:
   - Celkový počet přijatých odpovědí
   - Datum poslední přijaté odpovědi

2. **Grafy pro jednotlivé otázky**:
   - Pro otázky s výběrem jedné možnosti se zobrazuje koláčový graf
   - Pro otázky s více možnostmi se zobrazuje sloupcový graf
   - Pro textové otázky se zobrazuje seznam všech odpovědí

3. **Tabulku všech odpovědí**:
   - Přehledná tabulka s jednotlivými odpověďmi
   - Řazení podle data odeslání

### Export dat

Pro analytické zpracování můžete data exportovat:

1. Klikněte na tlačítko "Exportovat odpovědi"
2. CSV soubor se automaticky stáhne do vašeho zařízení
3. Soubor můžete otevřít v tabulkovém procesoru (MS Excel, Google Sheets, apod.)