## **Editor pro popis pohybových dat (EMOD)**

**Uživatelská dokumentace**

 ![][dancer]

**Obsah**

1. Obecný popis a definice pojmů
2. Struktura uložených dat
3. Uživatelské role
4. Typické scénáře použití aplikace
    1. Vkládání nových dat
    2. Vyhledávání
    3. Vytvoření pohledu
    4. Vytváření struktury v datech
    5. Definice odkazu a anotace
 5. Postupy k jednotlivým scénářům
    1. Vstup do aplikace
    2. Vkládání nových dat
       1. Vkládání jednotlivých datových objektů
       2. Hromadný import dat
       3. Ruční zadávání metadat
       4. Import metadat ze souboru
    3. Vyhledávání
    4. Vytvoření pohledu
    5. Vytvoření skupiny digitálních objektů
    6. Vytvoření datové sady k představení
    7. Definice odkazu
    8. Definice anotace v pohledu
    9. Export balíčku SIP
    10. Specifikace digitálních objektů pro export
    11. Export
 
 ***
 
**Obecný popis a definice pojmů**

EMOD je serverová komponenta s webovým uživatelským rozhraním, která slouží k anotaci pohybových a dalších multimediálních dat tvořících součásti multimediálních a tanečních představení nebo části dokumentace těchto představení. EMOD poskytuje webové rozhraní umožňující provádět klasifikaci a popis vkládaných dat. Součástí aplikace je 
báze uchovávající metadata popisující vlastní pohybová data a další související multimediální obsah. Tato dokumentace popisuje postupy prováděné uživateli při tvorbě, správě a prohlížení dokumentace uložených představení.

**Struktura uložených dat**

Pohybová a multimediální data jsou v databázi strukturována do tří úrovní. Základním prvkem je **digitální objekt** (Digital Item - DI). Jedná se o libovolný datový element, uložený v samostatném souboru (obrázek, fotografie, video, zvukový záznam, text, dokument, nebo pohybový záznam). Jde o základní stavební prvek všech ostatních datových struktur, který lze anotovat a spojovat s ostatními digitálními objekty.

Dva a více digitálních objektů lze sdružit do **skupiny digitálních objektů** (Group of Digital Items - GDI). Jde například o skupinu fotografií, které se vážou ke stejné akci nebo popisují stejný děj. GDI představuje druhou úroveň struktury datového modelu databáze.

Několik GDI lze sdružit do **datové sady** (Data Set - DS), která pak reprezentuje celé představení nebo jeho část a zahrnuje datové objekty vážící se k danému představení.

**Uživatelské role**

Uživatel přistupuje k dokumentaci v jedné ze tří rolí: návštěvník (visitor), badatel (researcher) a správce záznamů (editor). Každá z těchto rolí je specifická svým účelem a z toho plynoucími oprávněními:

**Návštěvník** je role která neumožňuje uživateli provádět žádné změny v obsahu uložených dat. Tato role slouží pouze pro prohlížení obsahu pohybových a ostatních multimediálních dat a zpřístupněných informací o těchto datech. V dalších plánovaných komponentách je tato role zamýšlena pro návštěvníky prezentačních akcí paměťové instituce, například v rámci výstav.

**Badatel** je role umožňující aktivní vyhledávání v metadatech, tvorbu anotací k obsahu a vyznačování vazeb mezi datovými objekty nebo skupinami datových objektů. Badatel může vytvářet tzv. **pohledy** a zpřístupňovat je uživatelům v roli správcePohled je výběr datových objektů a jejich skupin, se kterými badatel v daný okamžik pracuje. Pohled slouží jako anotační nástroj, umožňující navíc vytváření linků mezi jednotlivými datovými objekty.

**Správce záznamů (Editor)** je kategorie uživatele, která je oprávněná měnit stávající obsah uložených dat a přidávat nový obsah. Zpravidla v celém systému existuje pouze jeden správce, který rozhoduje o zpřístupnění obsahu pro všechny ostatní role.

**Typické scénáře použití aplikace**

**Vkládání nových dat**

Vkládání dat do aplikace je dvoustupňové. V prvním stupni komponenta EMOD umožňuje vkládání datových objektů do aplikace, kde jsou připraveny pro následné zpracování (zařazení a anotace). Vkládání datového objektu v prvním stupni probíhá po jedné komponentě (ručně) nebo na úrovni serveru hromadně.  Druhý stupeň probíhá po jednotlivých datových objektech, protože je nutné je postupně zařadit a popsat.
Do aplikace lze dále vkládat metadata popisující jednotlivé datové objekty. To lze provést opět ručně vyplňováním jednotlivých metadatových klíčů, případně definováním a vyplněním nových klíčů. Metadata lze importovat i ze souboru poloautomaticky pro více datových objektů najednou.


**Vyhledávání**

Vyhledávání dat probíhá na základě dotazů vytvořených pomocí hesel zadávaných do formuláře a porovnávaných s již vytvořenými metadaty.

**Vytvoření pohledu**

“Pohled” je výběr datových objektů uspořádaných na ploše. Uživatel si takové pohledy může vytvářet, upravovat, vyhledávat k nim další souvislosti  a anotovat je. Vytvoření pohledu spočívá ve výběru vyhledaných datových objektů a jejich skupin a jejich rozmístění na pracovní ploše. Pohled je pak možné uložit.


**Vytváření struktury v datech**

Fyzická data jsou reprezentována Datovými objekty - základními elementy dokumentujícími představení a mají formu některého datového souboru (obrázek, video, dokument, text, nebo pohybová data). Datové objekty je možné sdružovat do skupin, které popisují některou konkrétní fázi procesu zpracování představení (fotografie vážící se k představení, fotografie z procesu rekonstrukce, videa z představení, pohybová data, texty, texty k rekonstrukci atd.). 
Skupina digitálních objektů vznikne sdružením alespoň dvou objektů stejného typu (fotografie, video apod.) a jejich pojmenováním. Uživatel tak získá možnost pracovat např. se skupinou několika fotografií jako s jedním objektem.
Skupiny datových objektů je dále nutné sdružit do Datových sad, kde jedna sada reprezentuje představení nebo jeho část. Tím vzniká struktura, která umožňuje udržovat vztah mezi daty popisujících jedno představení a zároveň pracovat pouze se samotným  datovým objektem na nejnižší úrovni.


**Definice odkazu a anotace**

Mezi datovými objekty lze vytvářet (zaznamenávat) vztahy pomocí odkazů a jednotlivé datové objekty může opatřit anotacemi. Odkazy si uživatel v aplikaci definuje sám.

Anotaci k datovému objektu lze vytvořit i v pohledu (view). Každý objekt v pohledu lze popsat textovou formou vytvořením anotace. Tuto anotaci lze přiřadit u časově závislých médií (pohybová data, video) konkrétnímu okamžiku. Anotace se pak zobrazuje v průběhu prohlížení. 

**Export balíčku SIP**

Za účelem dlouhodobého uložení EMOD může vyexportovat vybraná data, která doplní metadaty strukturovanými v XML standardů METS/MODS. Výstupem je pak archivní balíček ve formátu ZIP, který může být předán k dlouhodobému uložení.


**Postupy k jednotlivým scénářům**

**Vstup do aplikace**

Do aplikace lze vstoupit zadáním příslušné adresy (URL) do webového prohlížeče. Kliknutím na ikonu v levém horním rohu okna je vyvoláno menu a výběrem některé z položek lze realizovat zamýšlenou operaci.


 ![][START]

Položky v menu nabízí několik způsobů nahlížení na data a metadata spravovaná aplikací EMOD. Zároveň se zde lze přihlásit do aplikace a získat vyšší stupeň oprávnění pro práci s daty.

 ![][MENU]

**Vkládání nových dat**

***Vkládání jednotlivých datových objektů***

Kliknutím na nabídku v levém horním roku a jejím rozbalením se dostanete do menu, ve kterém stisknete volbu _Digital items_. Otevře se stránka s nadpisem a tlačítky _Reload data_, _Import_ a _Upload_. Pod nimi je řádek s nadpisem _Filter items_ pro vyhledávání položek.
Pro nahrání nových položek z počítače (vašeho zařízení) stisknete tlačítko _Upload_. Tímto se dostanete do vyhledávače zařízení, na kterém vyberete zvolené soubory a tlačítkem _OK_ potvrdíte jejich nahrání. Nahrané soubory se zobrazí v seznamu pod tlačítky _Reload data_, _Import_ a _Upload_.

***Hromadný import dat***

Pro nahrání dat z lokálního úložiště slouží tlačítko _Import_. Soubory se nahrají po kliknutí na tlačítko _Import_ po vybrání označených položek a potvrzení importu tlačítkem _OK_.
Importem se ze souborů stávají datové objekty. Ty lze po nahrání pojmenovávat, a dále popsat pomocí metadatových záznamů (tagů), a podle nich s nimi následně pracovat. 

***Ruční zadávání metadat***

Popisování datových objektů je velmi flexibilní. Každý digitální objekt lze popsat libovolnou sadou dvojic _název:hodnota,_ kde název je identifikace záznamu a hodnota je jejím obsahem (např: dvojice &quot;autor&quot; : &quot;Josef Svoboda&quot;). Aplikace při zakládání nového datového objektu nejprve automaticky nastaví několik povinných záznamů a dále vyžaduje povinný záznam pro identifikaci. Rovněž nabízí sadu již definovaných záznamů použitých v minulosti. Lze také doplnit nový metadatový záznam vytvořením jeho jména a hodnoty.

***Editace a ruční přidávání metadatových záznamů***

V aplikaci EMOD vlevo nahoře otevřete menu a z něho vyberte položku Digital Items (Datové objekty). Ve výpisu datových objektů kliknutím na ikonu tužky lze přejít do režimu editace metadat přiřazených vybranému datovému objektu. Rozbalením nabídky Metadata se zpřístupní jednotlivé metadatové záznamy, které pak lze měnit a vytvářet. Nový metadatový záznam lze přidat stiskem tlačítka Add metadata.


 ![][DI]

***Import metadat ze souboru***

Import metadat ze souboru lze provést opět ze seznamu Datových objektů, který vyvoláte výběrem položky Digital Items v hlavním menu (ikonka menu vlevo nahoře). Ve výpisu datových objektů kliknutím na ikonu tužky lze opět přejít do režimu editace metadat přiřazených vybranému datovému objektu. Rozbalením položky Metadata a výběrem tlačítka Load MODS lze otevřít dialog pro výběr souboru s XML popisem vybraného datového objektu. 

**Vyhledávání**

Položky je možné vyhledávat prostřednictvím řádku _Filter items_. Vyhledávání je možné podle různých kritérií - názvů, metadat, data vytvoření, atd.
Po zadání požadavku vyhledávání se položky, které obsahují požadovaný řetězec objeví v seznamu pod vyhledávacím řádkem.

 ![][VIEW]

**Vytvoření pohledu**

Kliknutím na menu a položku _Views_ otevřeme stránku s uloženými pohledy nebo vytvoříme nový pohled kliknutím na volbu _Add view_.

Pohledy je možno pojmenovat, aby je mohl uživatel vyhledávat stejně jako jednotlivé soubory. Seznam pohledů se zobrazuje na stránce _Views_ pod nápisem _Description_. Filtrovat/vyhledávat pohledy lze stejně jako soubory zadáním hesla v řádku _Filter items_.

Pohled lze editovat přidáváním a odebíráním položek. Přidávat lze položky nebo celé skupiny položek pomocí tlačítka _Add item / group_ v levém horním rohu. Vybrané položky pohledu se zobrazí v levém postranním menu.

Pohled se ukládá automaticky.

Do těla pohledu vkládáme položky nebo skupiny přetažením myší nebo označením a stisknutím tlačítka +. V pohledu s položkami můžeme pohybovat přidržením tlačítka _CTRL_ a pohybem myši. Podržením _CTRL_ tak přepneme pohled do editačního režimu, v němž je možné jednotlivé kontejnery po ploše pohledu přemisťovat.

**Vytvoření skupiny digitálních objektů**

Skupinu položek vytvoříme kliknutím na _Menu_ a tlačítko _Digital Items Groups_ a zakliknutím tlačítka _+ Add new group_. Po kliknutí se na stránce zobrazí dialogové okno, do kterého vepíšeme description - tj. název skupiny. Zároveň můžeme kliknutím na _Add metadata_ přidat položky pro vyhledávání. Ty se potom budou zobrazovat u všech nahraných souborů/items. Vytvoření nové skupiny dokončíme tlačítkem _Create_.

**Vytvoření datové sady k představení**

Datovou sadu k představení vytvoříme otevřením hlavního menu a výběrem položky _Digital Item Sets_. Stiskem tlačítka _+ Add new_ set vyvoláme dialog, v němž je možné nastavit metadatové záznamy. Stiskem tlačítka Save je Datová sada uložena. Doporučujeme nastavit alespoň metadatové záznamy description a part_name i když to EMOD bezprostředně nevyžaduje.

**Definice odkazu**

EMOD umožňuje vytvořit 4 různé typy odkazů pro každý Datový objekt: 


1. **Annotation** - krátký text, poznámka, 
2. **Data** - odkaz na soubor datového objektu, 
3. **Link** - odkaz na jiný datový objekt, 
4. **Preview** - odkaz na soubor s náhledem. 


Odkaz lze vytvořit ze seznamu datových objektů (v levém horním rohu hlavní menu, položka _Digital Items_). Kliknutím na tlačítko tužky u vybraného datového objektu a rozbalením položky _Links_ se otevře dialog. V tomto dialogu lze definovat odkazy vedené z vybraného datového objektu. Pomocí tlačítka _Add link_ lze vytvořit nový odkaz, pro který je potřeba nastavit typ odkazu (viz 4 typy výše) a typ cílového objektu. Zde je možné volit opět ze čtyř typů obsahu cílového objektu:


1. **text** - data typu text,
2. **storage** - typ cesta k souboru,
3. **digital item** - datový objekt,
4. **digital group** - skupina datových objektů.


Ze všech možných kombinací typu odkazu a typu cílového objektu mají smysl jen některé. (např. annotation-text, data-storage, link-digital item, preview-digital item).

**Definice anotace v pohledu**

**poznámka:** Otevření pohledu - vyberte v hlavním menu položku Views. Zobrazí se seznam pohledů kliknutím na jméno některého z nich pak tento pohled otevřete.

Jednotlivé položky můžeme anotovat přímo na pracovní ploše v pohledu tak, že stiskneme klávesu _CTRL_ a všechny kontejnery v pohledu se zvýrazní a v záhlaví každého kontejneru se objeví nástroj pro editaci (tužka) a křížek pro vymazání kontejneru z plochy. 

Kliknutím na ikonu tužky se otevře editační menu. Volbou Annotate můžeme editovat položku Anotace, kde lze kromě textu vložit také čas a dobu platnosti textu u časově závislých médií, jako je video nebo pohybová data. Anotaci uložíme stiskutím tlačítka _Save_, zrušíme stisknutím _Cancel_.

Pro zobrazení anotace musíme vytvořit **“anotační kontejner”** - okno s anotací. Kontejner vytvoříme přidržením tlačítka _CTRL_, kliknutím na Tužku a zakliknutím volby _Create annotation container_. Kontejner se pak zobrazí v těle pohledu.

 ![][EDITVIEW]

**Export balíčku SIP**

Pro účely dlouhodobého ukládání dokumentace přestavení je možné vyexportovat balíček (tzv. _informační objekt_). Ten je reprezentován v EMODu _Datovou sadou_ (viz. Struktura uložených dat) a doplněný popisem vytvořeným z metadatových záznamů k příslušným datovým objektům.

**Specifikace digitálních objektů pro export**

Před exportem je možné zkontrolovat/nastavit výběr datových objektů, které budou exportovány. To je možné udělat v seznamu datových objektů (hlavní menu vlevo nahoře, položka Digital Items) zatržením příslušného checkboxu nalevo od názvu příslušného datového objektu.

**Export**

Vlastní export je spuštěn stiskem tlačítka  _Export SIP package_. EMOD vygeneruje _SIP_ (Submission Information Package) balíček obsahující vlastní data, metadata ve formátu XML a zakóduje ho do ZIP archivu. Hotový balíček je uložen v úložišti na cestě specifikované administrátorem v konfiguraci EMOD aplikace v průběhu instalace.


***
© 2018 ČVUT FEL, Katedra počítačové grafiky a interakce


[dancer]: /frontend/lm-naki/doc/dancer01_emboss.jpg
[DI]: /frontend/lm-naki/doc/emod-DIs.jpg
[EDITVIEW]: /frontend/lm-naki/doc/emod-edit-view.jpg
[MENU]: /frontend/lm-naki/doc/emod-menu.jpg
[START]: /frontend/lm-naki/doc/emod-start.jpg
[VIEW]: /frontend/lm-naki/doc/emod-view.jpg
