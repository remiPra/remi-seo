/**
 * Détecteur de contenu IA — 15 signaux heuristiques
 * Aucune dépendance externe, fonctionne en Node.js et navigateur
 */

import {
  AI_WORDS_EN, AI_WORDS_FR, AI_PHRASES_EN, AI_PHRASES_FR,
  FORMAL_TRANSITIONS_EN, FORMAL_TRANSITIONS_FR,
  HEDGING_EN, HEDGING_FR,
  CONCLUSION_STARTERS_EN, CONCLUSION_STARTERS_FR,
} from "./ai-wordlists.js";

// ─── UTILS ──────────────────────────────────────────────────────────────────

function tokenize(text) {
  return text.toLowerCase().match(/[\p{L}\p{N}'-]+/gu) || [];
}

function sentences(text) {
  return text.split(/(?<=[.!?…])\s+/).filter(s => s.trim().length > 5);
}

function paragraphs(text) {
  return text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
}

function stddev(arr) {
  if (arr.length < 2) return 0;
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((sum, v) => sum + (v - avg) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function coefficientOfVariation(arr) {
  if (arr.length < 2) return 0;
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  if (avg === 0) return 0;
  return stddev(arr) / avg;
}

function detectLanguage(text) {
  const frWords = ["le", "la", "les", "de", "des", "un", "une", "du", "et", "est", "en", "que", "qui", "dans", "pour", "sur", "avec", "sont", "pas", "nous", "vous", "cette", "ses", "aux"];
  const words = tokenize(text).slice(0, 200);
  const frCount = words.filter(w => frWords.includes(w)).length;
  return frCount > words.length * 0.08 ? "fr" : "en";
}

// ─── 15 SIGNAUX ─────────────────────────────────────────────────────────────

/**
 * Signal 1 : Mots IA (liste noire)
 * Poids : 9%
 */
function analyzeAIWords(text, lang) {
  const words = tokenize(text);
  const totalWords = words.length;
  if (totalWords === 0) return { score: 0, details: [], count: 0 };

  const wordList = lang === "fr" ? AI_WORDS_FR : AI_WORDS_EN;
  const textLower = text.toLowerCase();
  const found = [];

  for (const aiWord of wordList) {
    const regex = new RegExp(`\\b${aiWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "gi");
    const matches = textLower.match(regex);
    if (matches) {
      found.push({ word: aiWord, count: matches.length });
    }
  }

  const totalHits = found.reduce((sum, f) => sum + f.count, 0);
  const density = totalHits / totalWords;
  // > 3% de mots IA = très suspect
  const score = Math.min(1, density / 0.03);

  return { score, details: found.slice(0, 10), count: totalHits, density: (density * 100).toFixed(2) };
}

/**
 * Signal 2 : Phrases IA (liste noire)
 * Poids : 9%
 */
function analyzeAIPhrases(text, lang) {
  const textLower = text.toLowerCase();
  const phraseList = lang === "fr" ? AI_PHRASES_FR : AI_PHRASES_EN;
  const found = [];

  for (const phrase of phraseList) {
    const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\.\.\./g, '.*?');
    const regex = new RegExp(escapedPhrase, "gi");
    const matches = textLower.match(regex);
    if (matches) {
      found.push({ phrase, count: matches.length });
    }
  }

  const totalHits = found.reduce((sum, f) => sum + f.count, 0);
  const sentCount = sentences(text).length;
  const ratio = sentCount > 0 ? totalHits / sentCount : 0;
  // > 1 phrase IA par 10 phrases = suspect
  const score = Math.min(1, ratio / 0.1);

  return { score, details: found.slice(0, 10), count: totalHits };
}

/**
 * Signal 3 : Tirets cadratins (em dash)
 * Poids : 8%
 */
function analyzeEmDash(text) {
  const emDashCount = (text.match(/[—–]/g) || []).length;
  const sentCount = sentences(text).length;
  if (sentCount === 0) return { score: 0, count: 0 };

  const ratio = emDashCount / sentCount;
  // > 0.15 em dash par phrase = très suspect (humains ~ 0.02)
  const score = Math.min(1, ratio / 0.15);

  return { score, count: emDashCount, ratio: ratio.toFixed(3) };
}

/**
 * Signal 4 : Transitions formelles en début de phrase
 * Poids : 7%
 */
function analyzeFormalTransitions(text, lang) {
  const sents = sentences(text);
  if (sents.length === 0) return { score: 0, count: 0 };

  const transitions = lang === "fr" ? FORMAL_TRANSITIONS_FR : FORMAL_TRANSITIONS_EN;
  let count = 0;
  const found = [];

  for (const sent of sents) {
    const sentLower = sent.toLowerCase().trim();
    for (const t of transitions) {
      if (sentLower.startsWith(t)) {
        count++;
        found.push(t);
        break;
      }
    }
  }

  const ratio = count / sents.length;
  // > 15% de phrases commençant par une transition formelle = suspect
  const score = Math.min(1, ratio / 0.15);

  return { score, count, ratio: (ratio * 100).toFixed(1), details: found.slice(0, 10) };
}

/**
 * Signal 5 : Hedging épistémique
 * Poids : 8%
 */
function analyzeHedging(text, lang) {
  const textLower = text.toLowerCase();
  const hedges = lang === "fr" ? HEDGING_FR : HEDGING_EN;
  let count = 0;
  const found = [];

  for (const hedge of hedges) {
    const regex = new RegExp(hedge.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
    const matches = textLower.match(regex);
    if (matches) {
      count += matches.length;
      found.push(hedge);
    }
  }

  const sentCount = sentences(text).length;
  const ratio = sentCount > 0 ? count / sentCount : 0;
  const score = Math.min(1, ratio / 0.08);

  return { score, count, details: found };
}

/**
 * Signal 6 : Burstiness (variance longueur phrases)
 * Poids : 10%
 */
function analyzeBurstiness(text) {
  const sents = sentences(text);
  if (sents.length < 3) return { score: 0, cv: 0 };

  const lengths = sents.map(s => tokenize(s).length);
  const cv = coefficientOfVariation(lengths);

  // CV < 0.3 = très uniforme (IA), CV > 0.6 = très varié (humain)
  const score = cv < 0.3 ? 1 : cv > 0.6 ? 0 : 1 - ((cv - 0.3) / 0.3);

  return { score, cv: cv.toFixed(3), avgLength: (lengths.reduce((a, b) => a + b, 0) / lengths.length).toFixed(1) };
}

/**
 * Signal 7 : Uniformité des paragraphes
 * Poids : 7%
 */
function analyzeParagraphUniformity(text) {
  const paras = paragraphs(text);
  if (paras.length < 3) return { score: 0, cv: 0 };

  const lengths = paras.map(p => tokenize(p).length);
  const cv = coefficientOfVariation(lengths);

  // CV < 0.25 = paragraphes très uniformes (IA)
  const score = cv < 0.25 ? 1 : cv > 0.5 ? 0 : 1 - ((cv - 0.25) / 0.25);

  return { score, cv: cv.toFixed(3), paragraphCount: paras.length };
}

/**
 * Signal 8 : Richesse vocabulaire (Type-Token Ratio)
 * Poids : 6%
 */
function analyzeVocabularyRichness(text) {
  const words = tokenize(text);
  if (words.length < 50) return { score: 0, ttr: 0 };

  const uniqueWords = new Set(words);
  // Root TTR pour normaliser par la taille du texte
  const rootTTR = uniqueWords.size / Math.sqrt(words.length);

  // Root TTR < 5 = vocabulaire pauvre (IA), > 8 = riche (humain)
  const score = rootTTR < 5 ? 1 : rootTTR > 8 ? 0 : 1 - ((rootTTR - 5) / 3);

  return { score, ttr: rootTTR.toFixed(2), uniqueWords: uniqueWords.size, totalWords: words.length };
}

/**
 * Signal 9 : Densité de listes
 * Poids : 6%
 */
function analyzeListDensity(text) {
  const lines = text.split("\n");
  const totalLines = lines.length;
  if (totalLines < 3) return { score: 0, count: 0 };

  const listLines = lines.filter(l => /^\s*[-•*]\s|^\s*\d+[.)]\s/.test(l)).length;
  const ratio = listLines / totalLines;

  // > 30% de lignes en liste = suspect
  const score = Math.min(1, ratio / 0.3);

  return { score, count: listLines, ratio: (ratio * 100).toFixed(1) };
}

/**
 * Signal 10 : Diversité de ponctuation
 * Poids : 5%
 */
function analyzePunctuationDiversity(text) {
  const marks = text.match(/[.!?;:…()[\]]/g) || [];
  if (marks.length < 5) return { score: 0 };

  const counts = {};
  for (const m of marks) counts[m] = (counts[m] || 0) + 1;

  const total = marks.length;
  const periodRatio = (counts["."] || 0) / total;

  // Si > 80% de points (monotone), score IA élevé
  const score = periodRatio > 0.8 ? 0.8 : periodRatio > 0.6 ? 0.4 : 0;
  const uniqueMarks = Object.keys(counts).length;

  // Peu de types de ponctuation = IA
  const diversityScore = uniqueMarks < 3 ? 0.7 : uniqueMarks < 5 ? 0.3 : 0;

  return { score: Math.max(score, diversityScore), uniqueMarks, periodRatio: (periodRatio * 100).toFixed(1) };
}

/**
 * Signal 11 : Hapax legomena (mots uniques)
 * Poids : 5%
 */
function analyzeHapaxLegomena(text) {
  const words = tokenize(text);
  if (words.length < 50) return { score: 0, ratio: 0 };

  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;

  const hapax = Object.values(freq).filter(c => c === 1).length;
  const ratio = hapax / Object.keys(freq).length;

  // Ratio hapax < 0.4 = peu de mots uniques (IA), > 0.6 = normal (humain)
  const score = ratio < 0.4 ? 1 : ratio > 0.6 ? 0 : 1 - ((ratio - 0.4) / 0.2);

  return { score, hapaxCount: hapax, ratio: (ratio * 100).toFixed(1) };
}

/**
 * Signal 12 : Répétition n-grammes (bigrammes)
 * Poids : 5%
 */
function analyzeNgramRepetition(text) {
  const words = tokenize(text);
  if (words.length < 20) return { score: 0, ratio: 0 };

  const bigrams = {};
  for (let i = 0; i < words.length - 1; i++) {
    const bg = `${words[i]} ${words[i + 1]}`;
    bigrams[bg] = (bigrams[bg] || 0) + 1;
  }

  const total = Object.keys(bigrams).length;
  const repeated = Object.values(bigrams).filter(c => c > 2).length;
  const ratio = total > 0 ? repeated / total : 0;

  // > 10% de bigrammes répétés 3+ fois = suspect
  const score = Math.min(1, ratio / 0.1);

  return { score, repeatedBigrams: repeated, totalBigrams: total };
}

/**
 * Signal 13 : Pattern de conclusion
 * Poids : 5%
 */
function analyzeConclusionPattern(text, lang) {
  const paras = paragraphs(text);
  if (paras.length < 2) return { score: 0, found: false };

  const lastPara = paras[paras.length - 1].toLowerCase();
  const starters = lang === "fr" ? CONCLUSION_STARTERS_FR : CONCLUSION_STARTERS_EN;
  const allParaWords = paras.map(p => tokenize(p).length);
  const avgLen = allParaWords.reduce((a, b) => a + b, 0) / allParaWords.length;
  const lastLen = allParaWords[allParaWords.length - 1];

  let hasStarter = false;
  for (const s of starters) {
    if (lastPara.includes(s)) { hasStarter = true; break; }
  }

  // Conclusion trop longue (> 1.5x la moyenne) + starter classique = IA
  const tooLong = lastLen > avgLen * 1.5 ? 0.5 : 0;
  const starterScore = hasStarter ? 0.5 : 0;

  return { score: Math.min(1, tooLong + starterScore), found: hasStarter, lastParaLength: lastLen };
}

/**
 * Signal 14 : Longueur moyenne des phrases trop uniforme
 * Poids : 5%
 */
function analyzeSentenceLengthUniformity(text) {
  const sents = sentences(text);
  if (sents.length < 5) return { score: 0 };

  const lengths = sents.map(s => tokenize(s).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;

  // Compter les phrases dans une bande de ±30% de la moyenne
  const inBand = lengths.filter(l => Math.abs(l - avg) < avg * 0.3).length;
  const ratio = inBand / lengths.length;

  // Si > 70% des phrases sont dans la bande = trop uniforme
  const score = ratio > 0.7 ? 1 : ratio > 0.5 ? (ratio - 0.5) / 0.2 : 0;

  return { score, uniformRatio: (ratio * 100).toFixed(1), avgLength: avg.toFixed(1) };
}

/**
 * Signal 15 : Formalité excessive
 * Poids : 5%
 */
function analyzeExcessiveFormality(text, lang) {
  const words = tokenize(text);
  if (words.length < 50) return { score: 0 };

  let informalCount = 0;

  if (lang === "fr") {
    // Contractions orales, registre familier
    const informal = /\b(c'est|j'ai|j'suis|t'as|y'a|qu'est-ce|voilà|bref|bon|ben|hein|quoi|genre|truc|machin|bah|ouais|nan|perso|sympa|cool|top|super|mdr|lol)\b/gi;
    informalCount = (text.match(informal) || []).length;
  } else {
    const informal = /\b(don't|can't|won't|it's|I'm|you're|they're|we're|gonna|wanna|gotta|kinda|sorta|yeah|nope|cool|awesome|stuff|thing|guy|ok|okay|lol|btw)\b/gi;
    informalCount = (text.match(informal) || []).length;
  }

  const ratio = informalCount / words.length;
  // < 1% de mots informels = trop formel (IA)
  const score = ratio < 0.005 ? 1 : ratio < 0.02 ? 1 - ((ratio - 0.005) / 0.015) : 0;

  return { score, informalCount, ratio: (ratio * 100).toFixed(2) };
}

// ─── ORCHESTRATEUR ──────────────────────────────────────────────────────────

const SIGNALS = [
  { name: "Mots IA", nameEn: "AI Words", key: "aiWords", weight: 9, fn: analyzeAIWords, needsLang: true },
  { name: "Phrases IA", nameEn: "AI Phrases", key: "aiPhrases", weight: 9, fn: analyzeAIPhrases, needsLang: true },
  { name: "Tirets cadratins", nameEn: "Em Dashes", key: "emDash", weight: 8, fn: analyzeEmDash, needsLang: false },
  { name: "Transitions formelles", nameEn: "Formal Transitions", key: "formalTransitions", weight: 7, fn: analyzeFormalTransitions, needsLang: true },
  { name: "Hedging épistémique", nameEn: "Epistemic Hedging", key: "hedging", weight: 8, fn: analyzeHedging, needsLang: true },
  { name: "Burstiness", nameEn: "Burstiness", key: "burstiness", weight: 10, fn: analyzeBurstiness, needsLang: false },
  { name: "Uniformité paragraphes", nameEn: "Paragraph Uniformity", key: "paragraphUniformity", weight: 7, fn: analyzeParagraphUniformity, needsLang: false },
  { name: "Richesse vocabulaire", nameEn: "Vocabulary Richness", key: "vocabularyRichness", weight: 6, fn: analyzeVocabularyRichness, needsLang: false },
  { name: "Densité de listes", nameEn: "List Density", key: "listDensity", weight: 6, fn: analyzeListDensity, needsLang: false },
  { name: "Diversité ponctuation", nameEn: "Punctuation Diversity", key: "punctuationDiversity", weight: 5, fn: analyzePunctuationDiversity, needsLang: false },
  { name: "Hapax legomena", nameEn: "Hapax Legomena", key: "hapaxLegomena", weight: 5, fn: analyzeHapaxLegomena, needsLang: false },
  { name: "Répétition n-grammes", nameEn: "N-gram Repetition", key: "ngramRepetition", weight: 5, fn: analyzeNgramRepetition, needsLang: false },
  { name: "Pattern conclusion", nameEn: "Conclusion Pattern", key: "conclusionPattern", weight: 5, fn: analyzeConclusionPattern, needsLang: true },
  { name: "Uniformité longueur phrases", nameEn: "Sentence Length Uniformity", key: "sentenceLengthUniformity", weight: 5, fn: analyzeSentenceLengthUniformity, needsLang: false },
  { name: "Formalité excessive", nameEn: "Excessive Formality", key: "excessiveFormality", weight: 5, fn: analyzeExcessiveFormality, needsLang: true },
];

/**
 * Analyse complète d'un texte
 * @param {string} text - Le texte à analyser
 * @returns {{ score: number, label: string, lang: string, signals: object[], wordCount: number }}
 */
export function analyzeText(text) {
  if (!text || text.trim().length < 100) {
    return { score: 0, label: "Texte trop court", lang: "unknown", signals: [], wordCount: 0 };
  }

  const lang = detectLanguage(text);
  const wordCount = tokenize(text).length;

  let totalWeightedScore = 0;
  let totalWeight = 0;
  const signalResults = [];

  for (const signal of SIGNALS) {
    const result = signal.needsLang ? signal.fn(text, lang) : signal.fn(text);
    totalWeightedScore += result.score * signal.weight;
    totalWeight += signal.weight;

    signalResults.push({
      name: signal.name,
      nameEn: signal.nameEn,
      key: signal.key,
      weight: signal.weight,
      score: Math.round(result.score * 100),
      ...result,
    });
  }

  const finalScore = Math.round((totalWeightedScore / totalWeight) * 100);

  let label;
  if (finalScore <= 25) label = "Probablement humain";
  else if (finalScore <= 50) label = "Mixte / IA légère";
  else if (finalScore <= 75) label = "Probablement IA";
  else label = "Très probablement IA";

  return {
    score: finalScore,
    label,
    lang,
    wordCount,
    signals: signalResults,
  };
}
