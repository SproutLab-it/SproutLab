import type { Locale } from "./i18n";
import type { SupplementData, Pairing } from "@/types";

// Italian overrides for supplement display strings (name + dosage). English
// stays canonical in supplements.json; this overlay is merged in when the
// visitor locale is "it". Longer prose (description, evidence summary,
// caution notes, pairing reasons) is still English-only for now.
type SupplementText = { name: string; dosage: string };

export const SUPPLEMENT_IT: Record<string, SupplementText> = {
  "omega-3": { name: "Omega-3 (EPA/DHA)", dosage: "1000-2000mg di EPA/DHA combinati al giorno" },
  "vitamin-d3": { name: "Vitamina D3", dosage: "1000-2000 UI al giorno (dosi più alte richiedono esami)" },
  "vitamin-b12": { name: "Vitamina B12", dosage: "500-1000mcg al giorno (metilcobalamina preferibile)" },
  "vitamin-c": { name: "Vitamina C", dosage: "500-1000mg al giorno" },
  "zinc": { name: "Zinco", dosage: "15-30mg al giorno" },
  "creatine": { name: "Creatina Monoidrato", dosage: "3-5g al giorno" },
  "melatonin": { name: "Melatonina", dosage: "0,5-3mg, 30-60 minuti prima di dormire" },
  "iron": { name: "Ferro", dosage: "18-27mg al giorno (solo se carente)" },
  "ashwagandha": { name: "Ashwagandha", dosage: "300-600mg al giorno (estratto di radice standardizzato)" },
  "vitamin-k2": { name: "Vitamina K2 (MK-7)", dosage: "100-200mcg al giorno" },
  "l-theanine": { name: "L-Teanina", dosage: "100-200mg al giorno" },
  "rhodiola": { name: "Rodiola Rosea", dosage: "200-400mg al giorno (standardizzato al 3% di rosavine)" },
  "coq10": { name: "Coenzima Q10 (CoQ10)", dosage: "100-200mg al giorno (forma ubiquinolo preferibile)" },
  "vitamin-a": { name: "Vitamina A", dosage: "700-900mcg RAE al giorno" },
  "vitamin-e": { name: "Vitamina E", dosage: "15mg (22 UI) al giorno" },
  "biotin": { name: "Biotina (B7)", dosage: "2,5-5mg al giorno" },
  "probiotics": { name: "Probiotici", dosage: "10-50 miliardi di CFU al giorno (multi-ceppo)" },
  "collagen": { name: "Peptidi di Collagene", dosage: "10-15g al giorno" },
  "turmeric": { name: "Curcuma (Curcumina)", dosage: "500-1000mg di curcumina al giorno con piperina" },
  "nac": { name: "NAC (N-Acetil Cisteina)", dosage: "600-1200mg al giorno" },
  "lions-mane": { name: "Hericium (Lion's Mane)", dosage: "500-1000mg al giorno (estratto di corpo fruttifero)" },
  "spirulina": { name: "Spirulina", dosage: "3-10g al giorno" },
  "maca": { name: "Maca", dosage: "1,5-3g al giorno" },
  "magnesium": { name: "Magnesio", dosage: "300-400mg al giorno (forma glicinato o citrato preferibile)" },
  "cordyceps": { name: "Cordyceps", dosage: "1000-3000mg al giorno" },
  "reishi": { name: "Reishi", dosage: "1000-3000mg di estratto al giorno" },
  "tremella": { name: "Tremella", dosage: "500-1500mg di estratto al giorno" },
  "astaxanthin": { name: "Astaxantina", dosage: "4-12mg al giorno" },
  "vitamin-b6": { name: "Vitamina B6", dosage: "1,3-50mg al giorno (RDA: 1,3-1,7mg; terapeutico: 10-50mg)" },
  "potassium": { name: "Potassio", dosage: "99-400mg al giorno (apporto alimentare preferibile)" },
  "electrolytes": { name: "Elettroliti", dosage: "1 dose al giorno, o al bisogno intorno all'attività fisica" },
};

export function localizeSupplementText<T extends { slug: string; name: string; dosage: string }>(
  item: T,
  locale: Locale,
): T {
  if (locale !== "it") return item;
  const it = SUPPLEMENT_IT[item.slug];
  return it ? { ...item, name: it.name, dosage: it.dosage } : item;
}

// --- Full detail-page overlay (description, evidence summary, caution note,
// diet notes, and pairing "reason" text keyed by the English partner name).
// Research citation titles are intentionally NOT translated. ---

type SupplementDetailIT = {
  description: string;
  evidenceSummary: string;
  cautionNote?: string;
  diet?: { vegetarian?: string; vegan?: string };
  reasons?: Record<string, string>;
};

// Italian names for pairing partners referenced across supplements.
export const PAIR_ITEM_IT: Record<string, string> = {
  "Vitamin D3": "Vitamina D3",
  "Vitamin E": "Vitamina E",
  "Vitamin K2": "Vitamina K2",
  "Vitamin C": "Vitamina C",
  "Vitamin B12": "Vitamina B12",
  "Vitamin A": "Vitamina A",
  "Magnesium": "Magnesio",
  "Iron": "Ferro",
  "Zinc": "Zinco",
  "Calcium": "Calcio",
  "Copper": "Rame",
  "Folate": "Folati",
  "Caffeine": "Caffeina",
  "Carbohydrates": "Carboidrati",
  "Coffee/Tea": "Caffè/Tè",
  "Antibiotics": "Antibiotici",
  "Rhodiola Rosea": "Rodiola Rosea",
  "Lion's Mane": "Lion's Mane",
  "Collagen Peptides": "Peptidi di Collagene",
  "Omega-3": "Omega-3",
  "Omega-3 (EPA/DHA)": "Omega-3 (EPA/DHA)",
  "Anticoagulants (e.g. warfarin)": "Anticoagulanti (es. warfarin)",
};

export const SUPPLEMENT_IT_DETAIL: Record<string, SupplementDetailIT> = {
  "omega-3": {
    description: "Acidi grassi essenziali che supportano la funzione cerebrale, la salute del cuore e riducono l'infiammazione. EPA e DHA sono le forme attive presenti nell'olio di pesce.",
    evidenceSummary: "Evidenze solide per i benefici cardiovascolari e il supporto cognitivo. Le meta-analisi mostrano benefici costanti nella riduzione dei trigliceridi e negli effetti antinfiammatori.",
    reasons: {
      "Vitamin D3": "Entrambi sono liposolubili e si assorbono meglio insieme ai grassi alimentari",
      "Vitamin E": "La vitamina E può aiutare a prevenire l'ossidazione degli acidi grassi omega-3",
    },
  },
  "vitamin-d3": {
    description: "Vitamina essenziale prodotta dall'esposizione al sole, fondamentale per la salute delle ossa, la funzione immunitaria e la regolazione dell'umore. La maggior parte degli adulti è carente.",
    evidenceSummary: "Evidenze solide per la salute delle ossa, la funzione immunitaria e il miglioramento dell'umore legato a carenze. La carenza diffusa rende la supplementazione utile per la maggior parte degli adulti.",
    reasons: {
      "Vitamin K2": "La K2 aiuta a indirizzare verso le ossa, anziché verso le arterie, il calcio mobilitato dalla D3",
      "Magnesium": "Il magnesio è necessario per il metabolismo e l'attivazione della vitamina D",
    },
  },
  "vitamin-b12": {
    description: "Vitamina essenziale per la funzione nervosa, la sintesi del DNA e la formazione dei globuli rossi. La carenza è comune in vegetariani, vegani e anziani.",
    evidenceSummary: "Essenziale per vegani e vegetariani che non riescono ad assumere abbastanza B12 dalla dieta. Evidenze solide nella prevenzione dei problemi neurologici legati a carenze.",
    diet: {
      vegetarian: "Consigliata perché la B12 alimentare è limitata senza carne",
      vegan: "Essenziale perché gli alimenti vegetali non contengono fonti affidabili di B12",
    },
    reasons: {
      "Folate": "B12 e folati lavorano insieme nelle vie di metilazione",
      "Vitamin C": "Alte dosi di vitamina C possono ridurre l'assorbimento della B12",
    },
  },
  "vitamin-c": {
    description: "Potente antiossidante che supporta la funzione immunitaria, la sintesi del collagene e l'assorbimento del ferro. Vitamina idrosolubile che richiede un apporto regolare.",
    evidenceSummary: "Evidenze solide per il supporto immunitario e la funzione antiossidante. Evidenze modeste nel ridurre la durata del raffreddore se assunta regolarmente.",
    reasons: {
      "Iron": "La vitamina C aumenta notevolmente l'assorbimento del ferro non-eme",
      "Vitamin E": "La vitamina C rigenera la vitamina E, potenziando la protezione antiossidante",
      "Vitamin B12": "Dosi elevate possono ridurre l'assorbimento della B12",
    },
  },
  "zinc": {
    description: "Minerale essenziale per la funzione immunitaria, la guarigione delle ferite, la sintesi proteica e le reazioni enzimatiche. Importante per la produzione di testosterone.",
    evidenceSummary: "Evidenze solide per la funzione immunitaria ed evidenze modeste nel ridurre la durata del raffreddore se assunto subito. Essenziale per chi ha un apporto alimentare inadeguato.",
    reasons: {
      "Iron": "Zinco e ferro competono per l'assorbimento se assunti insieme",
      "Copper": "Un apporto elevato di zinco può ridurre il rame nel tempo",
      "Magnesium": "Dosi elevate possono interferire con l'assorbimento reciproco",
    },
  },
  "creatine": {
    description: "Uno degli integratori sportivi più studiati. Supporta forza muscolare, potenza e può avere benefici cognitivi.",
    evidenceSummary: "Estremamente studiata, con evidenze solide per forza e potenza muscolare. Evidenze emergenti per benefici cognitivi, soprattutto in caso di privazione del sonno.",
    reasons: {
      "Carbohydrates": "Il picco di insulina dai carboidrati può migliorare l'assorbimento della creatina nei muscoli",
      "Caffeine": "La caffeina potrebbe ridurre i benefici ergogenici della creatina, anche se le evidenze sono contrastanti",
    },
  },
  "melatonin": {
    description: "Ormone naturale che regola il ciclo sonno-veglia. Utile per jet lag, lavoro su turni e difficoltà ad addormentarsi. Inizia con la dose minima efficace.",
    evidenceSummary: "Evidenze solide per jet lag e disturbi del ritmo circadiano. Evidenze moderate per l'addormentamento in generale. Dosi basse (0,5-1mg) spesso efficaci quanto quelle più alte.",
    cautionNote: "Usa la dose minima efficace. Non indicata per l'uso quotidiano a lungo termine senza controllo medico. A dosi elevate può causare intontimento al risveglio.",
    reasons: {
      "Magnesium": "Entrambi favoriscono rilassamento e qualità del sonno con meccanismi diversi",
      "Caffeine": "La caffeina sopprime la produzione naturale di melatonina e ne contrasta gli effetti",
    },
  },
  "iron": {
    description: "Minerale essenziale per il trasporto dell'ossigeno nel sangue. La carenza causa stanchezza e anemia. Integra solo se carente. Il ferro in eccesso è dannoso.",
    evidenceSummary: "Utile solo per chi ha una carenza documentata. Una supplementazione non necessaria può causare stress ossidativo. Donne in età fertile e vegetariani/vegani hanno un rischio maggiore di carenza.",
    cautionNote: "Integra solo se hai una carenza di ferro confermata. Il ferro in eccesso causa danni ossidativi. Consulta un medico e fai gli esami prima di integrare.",
    diet: {
      vegetarian: "Rischio maggiore di carenza; il ferro vegetale è meno biodisponibile",
      vegan: "Rischio di carenza molto più alto; valuta di controllare i livelli",
    },
    reasons: {
      "Vitamin C": "Migliora nettamente l'assorbimento del ferro non-eme",
      "Calcium": "Il calcio inibisce in modo significativo l'assorbimento del ferro",
      "Coffee/Tea": "Tannini e polifenoli riducono l'assorbimento del ferro fino al 60%",
      "Zinc": "I due minerali competono per l'assorbimento",
    },
  },
  "ashwagandha": {
    description: "Pianta adattogena tradizionalmente usata nell'Ayurveda. Può aiutare a ridurre il cortisolo, sostenere la resistenza allo stress e migliorare la qualità del sonno.",
    evidenceSummary: "Evidenze moderate per la riduzione di stress e cortisolo. Alcune evidenze per il miglioramento del sonno e la riduzione dell'ansia. Gli effetti possono richiedere diverse settimane.",
    cautionNote: "Può interagire con i farmaci per la tiroide. Sconsigliata in gravidanza. Sospendere 2 settimane prima di un intervento chirurgico.",
  },
  "vitamin-k2": {
    description: "Vitamina liposolubile che indirizza il calcio verso ossa e denti prevenendo la calcificazione arteriosa. La forma MK-7 ha un'emivita più lunga.",
    evidenceSummary: "Evidenze solide per la salute delle ossa se abbinata alla vitamina D. Evidenze emergenti per la protezione cardiovascolare grazie alla riduzione della calcificazione arteriosa.",
    cautionNote: "Se assumi anticoagulanti (warfarin/coumadin), consulta il medico. La K2 influisce sui fattori della coagulazione.",
    reasons: {
      "Vitamin D3": "La K2 fa sì che il calcio mobilitato dalla D3 vada alle ossa, non alle arterie",
      "Calcium": "La K2 aiuta a indirizzare il calcio verso i tessuti giusti",
    },
  },
  "l-theanine": {
    description: "Amminoacido presente nel tè che favorisce il rilassamento senza sedazione. Spesso abbinato alla caffeina per una calma concentrata.",
    evidenceSummary: "Buone evidenze nel favorire rilassamento e concentrazione se abbinata alla caffeina. Può aiutare la qualità del sonno se assunta la sera.",
    reasons: {
      "Caffeine": "La L-teanina attenua gli effetti stimolanti della caffeina, riducendo il nervosismo senza perdere la concentrazione",
    },
  },
  "rhodiola": {
    description: "Pianta adattogena che può aiutare contro la fatica fisica e mentale. Tradizionalmente usata per la resistenza allo stress e l'endurance.",
    evidenceSummary: "Evidenze moderate nel ridurre la fatica e migliorare la resistenza allo stress. Può essere lievemente stimolante, quindi è preferibile l'uso mattutino.",
    cautionNote: "Può avere lievi effetti stimolanti. Evita di assumerla a fine giornata. Sconsigliata a chi soffre di disturbo bipolare.",
  },
  "coq10": {
    description: "Antiossidante prodotto naturalmente dall'organismo che supporta la produzione di energia cellulare. I livelli calano con l'età e con l'uso di statine.",
    evidenceSummary: "Buone evidenze nel supportare la funzione mitocondriale e ridurre i sintomi muscolari legati alle statine. Può sostenere la salute cardiovascolare.",
    reasons: {
      "Omega-3": "Entrambi sono liposolubili e supportano la salute cardiovascolare",
    },
  },
  "vitamin-a": {
    description: "Vitamina liposolubile essenziale per la vista, la funzione immunitaria e il rinnovamento delle cellule della pelle.",
    evidenceSummary: "Nutriente essenziale con evidenze solide per il supporto immunitario e la salute della pelle. La carenza è comune nelle diete a basso contenuto di grassi.",
    reasons: {
      "Zinc": "Lo zinco è necessario per il metabolismo e il trasporto della vitamina A",
    },
  },
  "vitamin-e": {
    description: "Potente antiossidante liposolubile che protegge le cellule dallo stress ossidativo e supporta la salute della pelle.",
    evidenceSummary: "Antiossidante potente con evidenze per la protezione della pelle e il supporto immunitario.",
    reasons: {
      "Vitamin C": "La vitamina C rigenera la vitamina E dopo che ha neutralizzato i radicali liberi",
    },
  },
  "biotin": {
    description: "Vitamina del gruppo B che supporta la produzione di cheratina, essenziale per la robustezza di capelli, pelle e unghie.",
    evidenceSummary: "Evidenze moderate nel migliorare la robustezza di capelli e unghie. Più efficace nei soggetti carenti.",
  },
  "probiotics": {
    description: "Batteri benefici vivi che sostengono l'equilibrio del microbiota intestinale, la digestione e la funzione immunitaria.",
    evidenceSummary: "Evidenze solide nel migliorare la salute intestinale, i sintomi dell'IBS e la modulazione immunitaria.",
    reasons: {
      "Antibiotics": "Gli antibiotici uccidono i batteri probiotici, distanziali di almeno 2 ore",
    },
  },
  "collagen": {
    description: "Collagene idrolizzato che supporta l'elasticità della pelle, la salute delle articolazioni e la riparazione del tessuto connettivo.",
    evidenceSummary: "Evidenze crescenti per l'idratazione e l'elasticità della pelle e per la riduzione del dolore articolare.",
    reasons: {
      "Vitamin C": "La vitamina C è essenziale per la sintesi del collagene",
    },
  },
  "turmeric": {
    description: "Potente composto antinfiammatorio dalla radice di curcuma. Si assorbe meglio con il pepe nero (piperina).",
    evidenceSummary: "Evidenze antinfiammatorie solide. La biodisponibilità è nettamente aumentata dalla co-somministrazione con piperina.",
    reasons: {
      "Omega-3 (EPA/DHA)": "Entrambi hanno meccanismi antinfiammatori complementari",
    },
  },
  "nac": {
    description: "Precursore del glutatione, l'antiossidante principale dell'organismo. Supporta la detossificazione epatica e la salute respiratoria.",
    evidenceSummary: "Ben consolidato per la protezione del fegato e il ripristino del glutatione. Evidenze emergenti per il supporto dell'umore e cognitivo.",
  },
  "lions-mane": {
    description: "Fungo medicinale che stimola il fattore di crescita nervoso (NGF), sostenendo la funzione cognitiva e la neuroplasticità.",
    evidenceSummary: "Evidenze promettenti per funzione cognitiva, memoria e lieve riduzione dell'ansia.",
  },
  "spirulina": {
    description: "Alga verde-azzurra ricca di proteine, ferro, vitamine del gruppo B e antiossidanti. Popolare superfood di origine vegetale.",
    evidenceSummary: "Evidenze moderate per supporto immunitario, attività antiossidante e riduzione del colesterolo.",
    diet: {
      vegetarian: "Buona fonte di proteine e ferro di origine vegetale",
      vegan: "Ottima fonte vegetale di proteine complete e vitamine del gruppo B",
    },
  },
  "maca": {
    description: "Radice adattogena del Perù che supporta energia, equilibrio ormonale e salute sessuale.",
    evidenceSummary: "Evidenze moderate nel migliorare energia, libido e umore. Adattogeno ben tollerato.",
  },
  "magnesium": {
    description: "Minerale essenziale coinvolto in oltre 300 reazioni enzimatiche. Supporta rilassamento muscolare, sonno, produzione di energia e risposta allo stress.",
    evidenceSummary: "Evidenze elevate per qualità del sonno, recupero muscolare e riduzione dello stress. Una delle carenze più comuni nelle diete occidentali.",
    reasons: {
      "Vitamin D3": "Il magnesio è necessario per attivare la vitamina D3",
      "Zinc": "Dosi elevate di zinco possono interferire con l'assorbimento del magnesio",
    },
  },
  "cordyceps": {
    description: "Fungo medicinale usato nella medicina tradizionale cinese per aumentare energia, resistenza e utilizzo dell'ossigeno. Cordyceps militaris e sinensis sono le specie più studiate per il supporto atletico e metabolico.",
    evidenceSummary: "Gli studi clinici mostrano miglioramenti nel VO2 max e nel tempo di esaurimento sia in adulti anziani sia attivi. Le evidenze sono moderate, con risultati coerenti in diversi piccoli RCT.",
    diet: {
      vegetarian: "Il Cordyceps militaris è adatto ai vegetariani.",
      vegan: "Il Cordyceps militaris è coltivato su substrati vegetali ed è adatto ai vegani.",
    },
    reasons: {
      "Rhodiola Rosea": "Adattogeni complementari, entrambi supportano l'endurance e riducono la fatica da esercizio",
    },
  },
  "reishi": {
    description: "Ganoderma lucidum, noto come il 'fungo dell'immortalità', è uno dei funghi medicinali più studiati. Supporta la regolazione immunitaria, la qualità del sonno e la resistenza allo stress.",
    evidenceSummary: "Studi randomizzati mostrano miglioramenti nelle popolazioni di cellule immunitarie, nella fatica legata al cancro e nella durata del sonno. Beta-glucani e triterpeni sono i principali composti attivi.",
    cautionNote: "Può interagire con farmaci anticoagulanti e immunosoppressori. Consulta un medico se assumi warfarin o immunoterapia.",
    diet: {
      vegetarian: "L'estratto di reishi è adatto ai vegetariani.",
      vegan: "L'estratto di reishi è adatto ai vegani.",
    },
    reasons: {
      "Lion's Mane": "Funghi complementari: il reishi modula l'immunità mentre il Lion's Mane supporta la funzione neurologica",
      "Anticoagulants (e.g. warfarin)": "Il reishi può avere lievi effetti antipiastrinici che potrebbero aumentare il rischio di sanguinamento",
    },
  },
  "tremella": {
    description: "La Tremella fuciformis, o fungo delle nevi, è ricca di polisaccaridi bioattivi che imitano l'acido ialuronico. Si usa per l'idratazione della pelle, l'anti-invecchiamento e il supporto immunitario.",
    evidenceSummary: "Le evidenze precliniche mostrano che i polisaccaridi della Tremella favoriscono la produzione di acido ialuronico, migliorano l'idratazione della pelle ed esercitano effetti antinfiammatori. I dati di studi clinici sull'uomo sono limitati.",
    diet: {
      vegetarian: "L'estratto di Tremella è adatto ai vegetariani.",
      vegan: "L'estratto di Tremella è adatto ai vegani.",
    },
    reasons: {
      "Collagen Peptides": "Collagene e polisaccaridi della Tremella agiscono con meccanismi di idratazione della pelle diversi ma complementari",
      "Vitamin C": "La vitamina C supporta la sintesi del collagene e potenzia gli effetti antiossidanti dei polisaccaridi della Tremella",
    },
  },
  "astaxanthin": {
    description: "Potente antiossidante carotenoide prodotto dalle microalghe. È uno degli antiossidanti più potenti conosciuti, con benefici particolari per la fotoprotezione della pelle, la riduzione dell'infiammazione e il recupero dall'esercizio.",
    evidenceSummary: "RCT in doppio cieco mostrano che l'astaxantina riduce i danni cutanei da raggi UV, migliora idratazione ed elasticità della pelle e riduce i marcatori di stress ossidativo. Va assunta con i grassi per un assorbimento ottimale.",
    cautionNote: "Si assorbe meglio con un pasto contenente grassi. A dosi molto elevate può causare un ingiallimento della pelle.",
    diet: {
      vegetarian: "L'astaxantina derivata da alghe è adatta ai vegetariani.",
      vegan: "Cerca astaxantina derivata da alghe (es. da Haematococcus pluvialis) per garantire un'origine vegana.",
    },
    reasons: {
      "Omega-3 (EPA/DHA)": "Entrambi sono liposolubili e si assorbono bene insieme durante un pasto; effetti antinfiammatori complementari",
      "Vitamin E": "Attività antiossidante sinergica: astaxantina e vitamina E proteggono le membrane lipidiche dall'ossidazione",
    },
  },
  "vitamin-b6": {
    description: "La piridossina è essenziale per il metabolismo degli amminoacidi, la sintesi dei neurotrasmettitori (serotonina, dopamina, GABA) e la funzione immunitaria. Spesso carente in chi è sotto stress cronico.",
    evidenceSummary: "Ruolo ben consolidato nel metabolismo energetico e nella sintesi dei neurotrasmettitori. Gli RCT mostrano che la B6 ad alte dosi riduce significativamente ansia e depressione. La carenza è comune in persone stressate, anziane e che consumano alcol.",
    cautionNote: "Dosi superiori a 100mg/giorno a lungo termine possono causare neuropatia periferica. Resta entro gli intervalli terapeutici consigliati.",
    diet: {
      vegetarian: "La B6 è disponibile da fonti vegetali, ma la supplementazione può essere utile.",
      vegan: "I vegani possono avere un rischio maggiore di carenza di B6; fonti vegetali includono lievito alimentare e ceci.",
    },
    reasons: {
      "Magnesium": "Magnesio e B6 agiscono in sinergia per ridurre stress e ansia; l'assunzione combinata è più efficace di ciascuno da solo",
      "Vitamin B12": "Le vitamine del gruppo B lavorano insieme nella metilazione e nel metabolismo energetico; la co-supplementazione è pratica comune",
    },
  },
  "potassium": {
    description: "Minerale elettrolita essenziale che regola l'equilibrio dei liquidi, i segnali nervosi e le contrazioni muscolari. Sostiene il ritmo cardiaco e la pressione sanguigna.",
    evidenceSummary: "Ruolo ben consolidato nella salute cardiovascolare e nella funzione muscolare. Un elevato apporto di potassio con la dieta è costantemente associato a una pressione più bassa e a un minor rischio di ictus.",
    cautionNote: "Gli integratori di potassio ad alte dosi possono essere dannosi per chi ha una malattia renale o assume ACE-inibitori/sartani. Consulta un medico prima di integrare oltre i 99mg.",
    reasons: {
      "Magnesium": "Il magnesio aiuta a mantenere i livelli di potassio intracellulare; la co-carenza è comune",
    },
  },
  "electrolytes": {
    description: "Miscela di minerali (di solito sodio, potassio, magnesio e cloruro) che regolano idratazione, funzione nervosa e prestazione muscolare.",
    evidenceSummary: "Evidenze solide nel prevenire e correggere le perdite di elettroliti indotte dall'esercizio. Particolarmente importante per atleti di endurance, per chi vive in climi caldi o segue un protocollo low-carb o di digiuno.",
    cautionNote: "Scegli formulazioni a basso contenuto di zucchero. Chi ha malattie renali o ipertensione deve monitorare con attenzione l'apporto di sodio.",
    reasons: {
      "Magnesium": "Il magnesio è spesso sottorappresentato nelle miscele di elettroliti; abbinarlo garantisce una copertura minerale completa",
    },
  },
};

function localizePairs(arr: Pairing[], reasons?: Record<string, string>): Pairing[] {
  return arr.map((p) => ({
    ...p,
    item: PAIR_ITEM_IT[p.item] ?? p.item,
    reason: reasons?.[p.item] ?? p.reason,
  }));
}

// Return a copy of the supplement with Italian text merged in (name, dosage,
// description, evidence summary, caution note, diet notes, pairing reasons).
export function localizeSupplementData(s: SupplementData, locale: Locale): SupplementData {
  if (locale !== "it") return s;
  const t = SUPPLEMENT_IT[s.slug];
  const d = SUPPLEMENT_IT_DETAIL[s.slug];
  return {
    ...s,
    name: t?.name ?? s.name,
    dosageRange: t?.dosage ?? s.dosageRange,
    description: d?.description ?? s.description,
    evidenceSummary: d?.evidenceSummary ?? s.evidenceSummary,
    cautionNote: d?.cautionNote ?? s.cautionNote,
    dietRelevance: s.dietRelevance
      ? {
          vegetarian: d?.diet?.vegetarian ?? s.dietRelevance.vegetarian,
          vegan: d?.diet?.vegan ?? s.dietRelevance.vegan,
        }
      : s.dietRelevance,
    pairWith: localizePairs(s.pairWith, d?.reasons),
    avoidWith: localizePairs(s.avoidWith, d?.reasons),
    separateFrom: localizePairs(s.separateFrom, d?.reasons),
  };
}
