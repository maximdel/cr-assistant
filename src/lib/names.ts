// lib/names.ts
// Fuzzy name matching, for names that were typed, OCR'd or full of fancy characters.

// "ⓍⓄⓇⒼ" -> "xorg", "《☆》ᴿᶻbnzin" -> "rzbnzin", "Mnak-Áhr⁵⁰³" -> "mnakahr503"
export function simplify(name: string) {
  const s = name
    .normalize('NFKC') // fancy unicode letters -> normal ones
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // accents
    .toLowerCase();
  const lettersOnly = s.replace(/[^\p{L}\p{N}]/gu, '');
  // names made only of symbols (":)") keep their symbols
  return lettersOnly || s.replace(/\s/g, '');
}

function levenshtein(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

// 1 = same name, 0 = nothing in common
export function nameSimilarity(query: string, name: string) {
  const a = simplify(query);
  const b = simplify(name);
  if (!a || !b) return 0;
  if (a === b) return 1;
  // "ryu" in "ryu⚡fr": partial typing or extra decorations (not for 1-2 letter pieces)
  if (Math.min(a.length, b.length) >= 3 && (b.includes(a) || a.includes(b))) {
    return 0.7 + 0.25 * (Math.min(a.length, b.length) / Math.max(a.length, b.length));
  }
  // OCR mistakes ("Rvu" vs "Ryu")
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length);
}
