const KEYWORDS = {
  javascript: new Set('as async await break case catch class const continue debugger default delete do else export extends finally for from function get if import in instanceof let new of return set static super switch this throw try typeof var void while with yield'.split(' ')),
  python: new Set('and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' ')),
  java: new Set('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while var record yield'.split(' ')),
  kotlin: new Set('as break by catch class companion const constructor continue data delegate do else enum false field file finally for fun get if import in infix init inline inner interface internal is lateinit noinline object open operator out override package private protected public reified return sealed set suspend super tailrec this throw true try typealias val var when where'.split(' ')),
  csharp: new Set('abstract as async await base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach get goto if implicit in init int interface internal is lock long namespace new object operator out override params private protected public readonly record ref return sbyte sealed set short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using var virtual void volatile while where'.split(' ')),
  sql: new Set('all alter and any array as asc begin between by cascade case cast check coalesce column commit constraint create cross current_date current_timestamp database date default delete desc distinct drop else end exists explain extract false fetch filter for foreign from full function group having if in index inner insert intersect interval into is join jsonb key left like limit merge not null nulls offset on or order outer over partition primary references recursive returning right rollback row row_number select sequence table then ties transaction true truncate union unique update using values varchar view when where window with'.split(' ')),
};

const LITERALS = new Set(['true', 'false', 'null', 'undefined', 'None', 'True', 'False']);
const BUILT_INS = {
  javascript: new Set('Array BigInt Boolean Date Error JSON Map Math Number Object Promise RegExp Set String Symbol console'.split(' ')),
  python: new Set('abs all any dict enumerate filter float int len list map max min print range reversed set sorted str sum tuple type zip'.split(' ')),
  java: new Set('ArrayList Arrays Collection Collections HashMap HashSet Integer List Map Math Objects Optional Set String System'.split(' ')),
  kotlin: new Set('println listOf mutableListOf mapOf mutableMapOf setOf mutableSetOf sequenceOf'.split(' ')),
  csharp: new Set('Console String Math DateTime Task Enumerable List Dictionary HashSet CancellationToken ArgumentNullException Results'.split(' ')),
  sql: new Set('avg count date_part date_trunc dense_rank jsonb_build_object lag lead lower max min now rank row_number round string_agg sum upper'.split(' ')),
};

function languageFor(label) {
  const name = String(label ?? '').toLocaleLowerCase('en');
  if (name.includes('sql') || name.includes('postgres')) return 'sql';
  if (name.includes('kotlin')) return 'kotlin';
  if (name === 'c#' || name.includes('csharp') || name.includes('.net')) return 'csharp';
  if (name.includes('python') || name.includes('fastapi')) return 'python';
  if (name === 'java' || name.includes('spring')) return 'java';
  if (name.includes('javascript') || name.includes('typescript') || name === 'js' || name.includes('react') || name.includes('next.js')) return 'javascript';
  return '';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function isIdentifierStart(character) {
  return /[A-Za-z_$]/.test(character);
}

function isIdentifierPart(character) {
  return /[\w$]/.test(character);
}

function readQuoted(source, start, quote, triple = false) {
  const delimiter = triple ? quote.repeat(3) : quote;
  let index = start + delimiter.length;
  while (index < source.length) {
    if (source[index] === '\\') {
      index = Math.min(source.length, index + 2);
      continue;
    }
    if (source.startsWith(delimiter, index)) return index + delimiter.length;
    index += 1;
  }
  return source.length;
}

function nextNonWhitespace(source, index) {
  while (index < source.length && /\s/.test(source[index])) index += 1;
  return source[index] ?? '';
}

function classifyIdentifier(name, previous, next, language) {
  const matchName = language === 'sql' ? name.toLowerCase() : name;
  if (KEYWORDS[language].has(matchName)) return 'keyword';
  if (LITERALS.has(name)) return 'literal';
  if (BUILT_INS[language].has(matchName)) return 'builtin';
  if (['const', 'let', 'var', 'function', 'fun', 'class', 'data', 'object', 'def', 'interface', 'record', 'enum', 'typealias'].includes(previous)) return 'declaration';
  if (next === '(') return 'function';
  if (previous === '.') return 'property';
  if (/^[A-Z]/.test(name)) return 'type';
  return 'variable';
}

function tokenize(source, language) {
  const tokens = [];
  let index = 0;
  let previousSignificant = '';

  const add = (text, kind = '') => {
    tokens.push({ text, kind });
    if (text.trim()) previousSignificant = text;
  };

  while (index < source.length) {
    const character = source[index];
    const next = source[index + 1] ?? '';

    if (/\s/.test(character)) {
      const start = index++;
      while (index < source.length && /\s/.test(source[index])) index += 1;
      add(source.slice(start, index));
      continue;
    }

    if ((language === 'python' && character === '#') || (character === '/' && next === '/')
      || (language === 'sql' && character === '-' && next === '-')) {
      const start = index;
      while (index < source.length && source[index] !== '\n') index += 1;
      add(source.slice(start, index), 'comment');
      continue;
    }

    if (language !== 'python' && character === '/' && next === '*') {
      const start = index;
      const end = source.indexOf('*/', index + 2);
      index = end === -1 ? source.length : end + 2;
      add(source.slice(start, index), 'comment');
      continue;
    }

    const quote = character === '"' || character === "'" || (language === 'javascript' && character === '`');
    if (quote) {
      const triple = language !== 'javascript' && source.startsWith(character.repeat(3), index);
      const end = readQuoted(source, index, character, triple);
      add(source.slice(index, end), character === '`' ? 'template' : 'string');
      index = end;
      continue;
    }

    if (/\d/.test(character) && (index === 0 || !isIdentifierPart(source[index - 1]))) {
      const number = source.slice(index).match(/^(?:0[xX][\da-fA-F](?:_?[\da-fA-F])*|(?:\d(?:_?\d)*\.?\d*|\.\d(?:_?\d)*)(?:[eE][+-]?\d(?:_?\d)*)?n?)/)?.[0];
      if (number) {
        add(number, 'number');
        index += number.length;
        continue;
      }
    }

    if (isIdentifierStart(character)) {
      const start = index++;
      while (index < source.length && isIdentifierPart(source[index])) index += 1;
      const name = source.slice(start, index);
      const kind = classifyIdentifier(name, previousSignificant, nextNonWhitespace(source, index), language);
      add(name, kind);
      continue;
    }

    const operator = source.slice(index).match(/^(?:===?|!==?|=>|\?\.|\?:|\?\?|\*\*=?|&&=?|\|\|=?|\+\+|--|\.\.\.|[+*/%&|^!~=<>?:-]=?)/)?.[0];
    if (operator) {
      add(operator, 'operator');
      index += operator.length;
      continue;
    }

    add(character);
    index += 1;
  }

  return tokens;
}

export function codeLanguageId(label) {
  return languageFor(label) || 'plain';
}

export function highlightCode(value, label) {
  const source = String(value ?? '');
  const language = languageFor(label);
  if (!language) return escapeHtml(source);
  return tokenize(source, language)
    .map(({ text, kind }) => {
      const safe = escapeHtml(text);
      return kind ? `<span class="syntax-${kind}">${safe}</span>` : safe;
    })
    .join('');
}
