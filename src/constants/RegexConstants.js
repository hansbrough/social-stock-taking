export default {
  EXTRANEOUS_OCR_CHARS  : /[,:;_|%'’/\\«»@}{‘“"”:()?é\]¢#£!><§®—~™]+/gm,
  DANGLING_WHITESPACE   : /^\s+|\s+$/gm,
  SINGLE_CHAR_LINE      : /^.{1}\n/gm,
  ALOE_KEYWORDS         : /(?<prefix>\w*)+[ \t]?aloe(\s?(?<suffix>\w+))?/gmi,
  AGAVE_KEYWORDS        : /(?<prefix>\w*)+[ \t]?agave(\s?(?<suffix>\w+))?/gmi,
  SUCCULENT_KEYWORDS    : /(?<prefix>\w*)+[ \t]?aloe|agave(\s?(?<suffix>\w+))?/gmi,
  PRICE                 : /\$[\d ]+[ .]?\d{0,2}/gm,
}
