/**
 * Listes noires de mots et phrases typiquement IA
 * Sources : Pangram Labs, Twixify, LAID, ai-text-detector, deep research 25/03/2026
 */

// ─── MOTS IA — ANGLAIS ──────────────────────────────────────────────────────
export const AI_WORDS_EN = [
  "delve", "tapestry", "landscape", "realm", "journey", "beacon", "symphony",
  "interplay", "nuance", "paradigm", "facet", "kaleidoscope", "testament",
  "endeavor", "roadmap", "toolkit", "cornerstone", "catalyst", "synergy",
  "ecosystem", "framework", "blueprint", "leverage", "harness", "navigate",
  "foster", "elevate", "illuminate", "embark", "transcend", "unravel",
  "unleash", "underscore", "showcase", "streamline", "revolutionize",
  "reimagine", "spearhead", "empower", "optimize", "curate", "craft",
  "robust", "comprehensive", "pivotal", "nuanced", "intricate",
  "groundbreaking", "cutting-edge", "seamless", "meticulous", "paramount",
  "vibrant", "transformative", "holistic", "multifaceted", "dynamic",
  "innovative", "unprecedented", "seamlessly", "meticulously", "notably",
  "importantly", "significantly", "ultimately", "fundamentally", "profoundly",
  "remarkably", "tirelessly", "underpinning", "underscoring", "spearheading",
  "endeavoring", "poignant", "indelible", "unwavering", "unyielding",
  "relentless", "game-changer", "deep-dive", "actionable", "synergize",
  "operationalize", "incentivize", "contextualize", "architecting",
];

// ─── MOTS IA — FRANÇAIS ─────────────────────────────────────────────────────
export const AI_WORDS_FR = [
  "notamment", "en effet", "par ailleurs", "de surcroît", "en outre",
  "primordial", "fondamental", "incontournable", "indéniable", "remarquable",
  "exceptionnel", "considérable", "substantiel", "prépondérant", "crucial",
  "essentiel", "capital", "majeur", "déterminant", "significatif",
  "appréhender", "cerner", "décrypter", "explorer", "naviguer",
  "transcender", "incarner", "témoigner", "illustrer", "souligner",
  "mettre en lumière", "force est de constater", "il convient de",
  "il est intéressant de noter", "paysage", "écosystème", "paradigme",
  "synergie", "levier", "catalyseur", "pilier", "socle", "fer de lance",
  "porte-étendard", "fleuron", "joyau", "pépite", "tremplin", "passerelle",
  "clé de voûte", "pierre angulaire", "épine dorsale", "colonne vertébrale",
  "fer de lance", "vent de fraîcheur", "bouffée d'oxygène", "coup d'accélérateur",
  "holistique", "disruptif", "innovant", "novateur", "avant-gardiste",
  "précurseur", "visionnaire", "emblématique", "phare", "référence",
];

// ─── PHRASES IA — ANGLAIS ───────────────────────────────────────────────────
export const AI_PHRASES_EN = [
  "it's worth noting",
  "it's important to note",
  "in today's digital landscape",
  "in today's fast-paced world",
  "in today's ever-changing",
  "let's dive in",
  "let's delve into",
  "at the end of the day",
  "this is a testament to",
  "stands as a testament",
  "not only... but also",
  "in a world where",
  "pave the way for",
  "push the boundaries",
  "unlock the potential",
  "at the forefront of",
  "a game-changer",
  "here are some",
  "in conclusion",
  "in summary",
  "to sum up",
  "overall, this",
  "it is essential to",
  "it is crucial to",
  "it is important to understand",
  "serves as a reminder",
  "shed light on",
  "the question isn't",
  "when it comes to",
  "at its core",
];

// ─── PHRASES IA — FRANÇAIS ──────────────────────────────────────────────────
export const AI_PHRASES_FR = [
  "il convient de noter",
  "il est important de souligner",
  "il est essentiel de",
  "il est intéressant de noter",
  "dans le paysage actuel",
  "dans le paysage numérique",
  "à l'ère du numérique",
  "à l'ère de",
  "dans un monde où",
  "dans un contexte où",
  "force est de constater",
  "cela témoigne de",
  "cela illustre parfaitement",
  "non seulement... mais aussi",
  "non seulement... mais également",
  "en conclusion",
  "en résumé",
  "pour conclure",
  "en somme",
  "au cœur de cette démarche",
  "au cœur de cette problématique",
  "il ne fait aucun doute",
  "il va sans dire",
  "en définitive",
  "tout compte fait",
  "dans cette optique",
  "à cet égard",
  "en ce qui concerne",
  "s'inscrit dans une démarche",
  "joue un rôle crucial",
  "joue un rôle déterminant",
  "occupe une place de choix",
  "revêt une importance particulière",
  "constitue un atout majeur",
  "représente un enjeu majeur",
];

// ─── TRANSITIONS FORMELLES ──────────────────────────────────────────────────
export const FORMAL_TRANSITIONS_EN = [
  "moreover", "furthermore", "additionally", "consequently", "nevertheless",
  "nonetheless", "subsequently", "accordingly", "hence", "thus",
  "therefore", "conversely", "alternatively", "specifically", "notably",
  "importantly", "significantly", "interestingly", "remarkably",
  "undoubtedly", "undeniably", "evidently",
];

export const FORMAL_TRANSITIONS_FR = [
  "de plus", "en outre", "par ailleurs", "de surcroît", "qui plus est",
  "néanmoins", "toutefois", "cependant", "en revanche", "par conséquent",
  "en conséquence", "ainsi", "dès lors", "c'est pourquoi", "en définitive",
  "effectivement", "assurément", "indubitablement", "manifestement",
  "incontestablement", "fondamentalement", "substantiellement",
];

// ─── HEDGING / EPISTEMIC MARKERS ────────────────────────────────────────────
export const HEDGING_EN = [
  "it's worth noting", "it's important to note", "it should be noted",
  "arguably", "it bears mentioning", "one could argue",
  "it's worth mentioning", "it's crucial to understand",
  "it's essential to recognize", "it must be emphasized",
];

export const HEDGING_FR = [
  "il convient de noter", "il est important de souligner",
  "il faut souligner", "il est à noter", "notons que",
  "soulignons que", "il est intéressant de constater",
  "on peut affirmer que", "il est légitime de penser",
  "il serait judicieux de", "il apparaît que", "il s'avère que",
];

// ─── CONCLUSION STARTERS ────────────────────────────────────────────────────
export const CONCLUSION_STARTERS_EN = [
  "in conclusion", "in summary", "to sum up", "overall",
  "to conclude", "in closing", "ultimately", "all in all",
  "in the final analysis", "to summarize",
];

export const CONCLUSION_STARTERS_FR = [
  "en conclusion", "en résumé", "pour conclure", "en somme",
  "en définitive", "pour résumer", "en fin de compte",
  "tout compte fait", "au final", "en dernière analyse",
];
