## **Editor pro popis pohybových dat (EMOD)**

**Uživatelská dokumentace**

 ![][dancer]

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

Vkládání dat do aplikace je dvoustupňové. V prvním stupni komponenta EMOD umožňuje vkládání datových objektů do aplikace, kdy jsou připraveny pro následné zpracování (zařazení a anotace). Vkládání datového objektu v prvním stupni probíhá po jedné komponentě nebo na úrovni serveru hromadně.  Druhý stupeň probíhá po jednotlivých datových objektech, které je nutné zařadit a popsat.

**Vyhledávání**

Vyhledávání dat probíhá na základě dotazů vytvořených pomocí hesel zadávaných do formuláře a porovnávaných s již vytvořenými metadaty.

**Vytvoření pohledu**

Vytvoření pohledu spočívá ve výběru vyhledaných datových objektů a jejich skupin a jejich rozmístění na pracovní ploše. Pohled je pak možné uložit.

**Vytvoření skupiny digitálních objektů**

Skupina digitálních objektů vznikne sdružením alespoň dvou objektů stejného typu (fotografie, video apod.) a jejich pojmenováním. Uživatel tak získá možnost pracovat např. se skupinou několika fotografií jako s jedním objektem.

**Definice anotace**

Každý objekt v pohledu lze popsat textovou formou vytvořením anotace. Tuto anotaci lze přiřadit u časově závislých médií (pohybová data, video) konkrétnímu okamžiku. Anotace se pak zobrazuje v průběhu prohlížení.



**Postupy k jednotlivým scénářům**

**Vstup do aplikace**

Do aplikace lze vstoupit zadáním příslušné adresy (URL) do webového prohlížeče. Kliknutím na ikonu v levém horním rohu okna je vyvoláno menu a výběrem některé z položek lze realizovat zamýšlenou operaci.



 ![][START]

Položky v menu nabízí několik způsobů nahlížení na data a metadata spravovaná aplikací EMOD. Zároveň se zde lze přihlásit do aplikace a získat vyšší stupeň oprávnění pro práci s daty.

 ![][MENU]

**Vkládání nových dat**

Kliknutím na nabídku v levém horním roku a jejím rozbalením se dostanete do menu, ve kterém stisknete volbu _Digital items_. Otevře se stránka s nadpisem a tlačítky Reload data, Import a Upload. Pod nimi je řádek s nadpisem _Filter items_ pro vyhledávání položek.

Pro nahrání nových položek z počítače (vašeho zařízení) stisknete tlačítko _Upload_. Tímto se dostanete do vyhledávače zařízení, na kterém vyberete zvolené soubory a tlačítkem _OK_ potvrdíte jejich nahrání. Nahrané soubory se zobrazí v seznamu pod tlačítky _Reload data_, _Import_ a _Upload_.

Pro nahrání dat z lokálního úložiště slouží tlačítko _Import_. Soubory se nahrají po kliknutí na tlačítko Import po vybrání označených položek a potvrzení importu tlačítkem _OK_.

Importem se ze souborů stávají datové objekty. Ty lze po nahrání pojmenovávat, a dále popsat pomocí metadatových záznamů (tagů), a podle nich s nimi následně pracovat.

Popisování datových objektů je velmi flexibilní. Každý digitální objekt lze popsat libovolnou sadou dvojic _název:hodnota,_ kde název je identifikace záznamu a hodnota je jejím obsahem (např: dvojice &quot;autor&quot; : &quot;Josef Svoboda&quot;). Aplikace při zakládání nového datového objektu nejprve automaticky nastaví několik povinných záznamů a dále vyžaduje povinný záznam pro identifikaci. Rovněž nabízí sadu již definovaných záznamů použitých v minulosti. Lze také doplnit nový metadatový záznam vytvořením jeho jména a hodnoty.



Ve výpisu datových objektů kliknutím na ikonu tužky lze přejít do režimu editace metadat přiřazených vybranému datovému objektu. Tam lze pak jednotlivé záznamy měnit a vytvářet

nové stiskem tlačítka Add metadata.

 ![][DI]

**Vyhledávání**

Položky je možné vyhledávat prostřednictvím řádku _Filter items_. Vyhledávání je možné podle různých kritérií - názvů, metadat, data vytvoření, atd.

Po zadání požadavku vyhledávání se položky, které obsahují požadovaný řetězec objeví v seznamu pod vyhledávacím řádkem.

 ![][VIEW]

**Vytvoření pohledu**

Kliknutím na menu a položku _Views_ otevřeme stránku s uloženými pohledy nebo vytvoříme nový pohled kliknutím na volbu _Add view_.

Pohledy je možno pojmenovat, aby je mohl uživatel vyhledávat stejně jako jednotlivé soubory. Seznam pohledů se zobrazuje na stránce _Views_ pod nápisem _Description_. Filtrovat/vyhledávat pohledy lze stejně jako soubory zadáním hesla v řádku _Filter items_.

Pohled lze editovat přidáváním a odebíráním položek. Přidávat lze položky nebo celé skupiny položek pomocí tlačítka _Add item / group_ v levém horním rohu. Vybrané položky pohledu se zobrazí v levém postranním menu.

Pohled se ukládá automaticky.

Do těla pohledu vkládáme položky nebo skupiny přetažením myší nebo označením a stisknutím tlačítka +. V pohledu s položkami můžeme pohybovat přidržením tlačítka CTRL a pohybem myši. Podržením CTRL tak přepneme pohled do editačního režimu, v němž je možné jednotlivé kontejnery po ploše pohledu přemisťovat.

**Vytvoření skupiny digitálních objektů**

Skupinu položek vytvoříme kliknutím na _Menu_ a tlačítko _Digital Items Groups_ a zakliknutím tlačítka + _Add new group_. Po kliknutí se na stránce zobrazí dialogové okno, do kterého vepíšeme description - tj. název skupiny. Zároveň můžeme kliknutím na _Add metadata_ přidat položky pro vyhledávání. Ty se potom budou zobrazovat u všech nahraných souborů/items. Vytvoření nové skupiny dokončíme tlačítkem _Create_.

**Definice anotace**

Jednotlivé položky můžeme popisovat tak, že klikneme na danou položku v pohledu a při přidržení _CTRL_ se nám zobrazí fialové okno s ikonou Tužky - opravy nebo Koše - odstranit položku.

Kliknutím na ikonu tužky se nám otevře okno s položkami. Volbou _Annotate_ můžeme editovat položku Anotace - zejména čas (u videí; u fotek je čas 0) a text - pro poznámky. Anotaci uložíme stiskutím tlačítka Save, zrušíme stisknutím _Cancel_.

Pro zobrazení anotace musíme vytvořit &quot;anotační kontejner&quot; - okno s anotací, které se zobrazí v těle pohledu. Kontejner vytvoříme přidržením tlačítka _CTRL_, kliknutím na Tužku a zakliknutím volby _Create annotation container_. Kontejner se pak zobrazí v těle pohledu.

 ![][EDITVIEW]

© 2018 ČVUT FEL, Katedra počítačové grafiky a interakce


[dancer]: /frontend/lm-naki/doc/dancer01_emboss.jpg
[DI]: /frontend/lm-naki/doc/emod-DIs.jpg
[EDITVIEW]: /frontend/lm-naki/doc/emod-edit-view.jpg
[MENU]: /frontend/lm-naki/doc/emod-menu.jpg
[START]: /frontend/lm-naki/doc/emod-start.jpg
[VIEW]: /frontend/lm-naki/doc/emod-view.jpg
