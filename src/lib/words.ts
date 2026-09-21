export const ENGLISH_200 = [
  "the", "be", "of", "and", "a", "to", "in", "he", "have", "it",
  "that", "for", "they", "I", "with", "as", "not", "on", "she", "at",
  "by", "this", "we", "you", "do", "but", "from", "or", "which", "one",
  "would", "all", "will", "there", "say", "who", "make", "when", "can", "more",
  "if", "no", "man", "out", "other", "so", "what", "time", "up", "go",
  "about", "than", "into", "could", "state", "only", "new", "year", "some", "take",
  "come", "these", "know", "see", "use", "get", "like", "then", "first", "any",
  "work", "now", "may", "such", "give", "over", "think", "most", "even", "find",
  "day", "also", "after", "way", "many", "must", "look", "before", "great", "back",
  "through", "long", "where", "much", "should", "well", "people", "down", "own", "just",
  "because", "good", "each", "those", "feel", "seem", "how", "high", "too", "place",
  "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write",
  "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop",
  "under", "last", "right", "move", "thing", "general", "school", "never", "same", "another",
  "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point",
  "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home",
  "interest", "large", "person", "end", "open", "public", "follow", "during", "present", "without",
  "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem",
  "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face",
  "fact", "group", "play", "stand", "increase", "early", "course", "change", "help", "line"
];

export const ENGLISH_1K = [
  ...ENGLISH_200,
  "ability", "able", "aboard", "about", "above", "accept", "accident", "according", "account", "accurate",
  "acres", "across", "act", "action", "active", "activity", "actual", "actually", "add", "addition",
  "additional", "address", "adult", "adventure", "advice", "affect", "afraid", "afternoon", "ahead", "aid",
  "air", "airplane", "alike", "alive", "allow", "almost", "alone", "along", "aloud", "alphabet",
  "already", "although", "am", "among", "amount", "ancient", "angle", "angry", "animal", "announced",
  "annual", "answer", "ants", "anybody", "anyhow", "anyone", "anyway", "anywhere", "apartment", "apparent",
  "appear", "applause", "apple", "apply", "appropriate", "approve", "arch", "arctic", "area", "arm",
  "army", "around", "arrange", "arrangement", "arrive", "arrow", "art", "article", "aside", "asleep",
  "atomic", "attach", "attack", "attempt", "attention", "audience", "author", "automobile", "available", "average",
  "avoid", "aware", "away", "baby", "bad", "badly", "bag", "balance", "ball", "balloon",
  "band", "bank", "bar", "bare", "bark", "barn", "base", "baseball", "basic", "basis",
  "basket", "bat", "battle", "bay", "beak", "beam", "bean", "bear", "beat", "beautiful",
  "beauty", "became", "bed", "bedroom", "bee", "beef", "been", "beer", "began", "begin",
  "bell", "belong", "below", "belt", "bend", "beneath", "bent", "beside", "best", "better",
  "beyond", "bicycle", "bigger", "biggest", "bill", "birds", "birth", "birthday", "bit", "bite",
  "black", "blank", "blanket", "blew", "blind", "block", "blood", "blow", "blue", "board",
  "boat", "body", "bone", "book", "border", "born", "bottle", "bottom", "bound", "bow",
  "bowl", "box", "boy", "brain", "branch", "brass", "brave", "bread", "break", "breakfast",
  "breath", "breathe", "breathing", "breeze", "brick", "bridge", "brief", "bright", "bring", "broad",
  "broke", "broken", "brother", "brought", "brown", "brush", "buffalo", "build", "building", "built",
  "buried", "burn", "burst", "bus", "bush", "business", "busy", "butter", "button", "cabin",
  "cage", "cake", "calendar", "calm", "camera", "camp", "canal", "cannot", "cap", "capital",
  "captain", "captured", "car", "carbon", "card", "care", "careful", "carefully", "carriage", "carry"
];

export const CODE_JAVASCRIPT = [
  "const", "let", "function", "return", "import", "export", "default", "async", "await", "Promise",
  "then", "catch", "finally", "class", "constructor", "extends", "super", "this", "new", "typeof",
  "instanceof", "interface", "type", "string", "number", "boolean", "any", "void", "null", "undefined",
  "Array", "Object", "map", "filter", "reduce", "forEach", "find", "some", "every", "includes",
  "push", "pop", "shift", "slice", "splice", "concat", "split", "join", "indexOf", "length",
  "try", "throw", "Error", "if", "else", "switch", "case", "break", "continue", "while",
  "for", "of", "in", "true", "false", "console.log", "JSON.stringify", "JSON.parse", "Math.max", "Math.floor",
  "document.querySelector", "addEventListener", "setTimeout", "setInterval", "clearTimeout", "fetch", "Response", "Headers", "window", "localStorage"
];

export const CODE_PYTHON = [
  "def", "return", "import", "from", "as", "class", "self", "__init__", "None", "True",
  "False", "and", "or", "not", "is", "in", "lambda", "yield", "raise", "try",
  "except", "finally", "with", "open", "print", "len", "range", "enumerate", "zip", "map",
  "filter", "list", "dict", "set", "tuple", "str", "int", "float", "bool", "isinstance",
  "append", "extend", "pop", "remove", "keys", "values", "items", "get", "update", "split",
  "join", "strip", "replace", "format", "sorted", "reversed", "sum", "min", "max", "all",
  "any", "if", "elif", "else", "for", "while", "break", "continue", "pass", "global"
];

export type WordListType = "english" | "english_1k" | "code_javascript" | "code_python";

export function getWordList(type: WordListType): string[] {
  switch (type) {
    case "english_1k":
      return ENGLISH_1K;
    case "code_javascript":
      return CODE_JAVASCRIPT;
    case "code_python":
      return CODE_PYTHON;
    case "english":
    default:
      return ENGLISH_200;
  }
}

export function generateWords(
  count: number,
  options: {
    language?: WordListType;
    punctuation?: boolean;
    numbers?: boolean;
  } = {}
): string[] {
  const { language = "english", punctuation = false, numbers = false } = options;
  const list = getWordList(language);
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    // Inject number roughly 1 in 10 if numbers enabled
    if (numbers && Math.random() < 0.12) {
      result.push(String(Math.floor(Math.random() * 900) + 10));
      continue;
    }

    const randomIndex = Math.floor(Math.random() * list.length);
    let word = list[randomIndex];

    if (punctuation && language.startsWith("english")) {
      // Capitalize first letter of sentence
      if (i === 0 || result[i - 1]?.endsWith(".") || result[i - 1]?.endsWith("!") || result[i - 1]?.endsWith("?")) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }

      // Add punctuation mark occasionally
      const roll = Math.random();
      if (roll < 0.1) {
        word += ".";
      } else if (roll < 0.17) {
        word += ",";
      } else if (roll < 0.20) {
        word = `"${word}"`;
      } else if (roll < 0.22) {
        word += ";";
      } else if (roll < 0.24) {
        word += "?";
      }
    }

    result.push(word);
  }

  // Ensure last word has period if punctuation enabled
  if (punctuation && result.length > 0) {
    const last = result[result.length - 1];
    if (!last.endsWith(".") && !last.endsWith("!") && !last.endsWith("?")) {
      result[result.length - 1] = last.replace(/[",;]/g, "") + ".";
    }
  }

  return result;
}
