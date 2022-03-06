export const TOKENS = {
  ADD: c => c == '+',
  SUB: c => c == '-',
  MUL: c => c == '*',
  DIV: c => c == '/',
  MOD: c => c == '%',
  BAR: c => c == '|',
  NOT: c => c == '!',
  DOT: c => c == '.',
  MSG: c => c == '#',
  MOST: c => c == '>',
  LESS: c => c == '<',
  QUOTE: c => c == "'",
  EQUAL: c => c == '=',
  COMMA: c => c == ',',
  COLON: c => c == ':',
  SPACE: c => c == ' ',
  LPAREN: c => c == '(',
  RPAREN: c => c == ')',
  LBRACE: c => c == '{',
  RBRACE: c => c == '}',
  EQUALTO: c => c == '==',
  LBRACKET: c => c == '[',
  RBRACKET: c => c == ']',
  NOTEQUAL: c => c == '!=',
  MOSTEQUAL: c => c == '>=',
  LESSEQUAL: c => c == '<=',
  MULTIADD: c => c == '++',
  MULTISUB: c => c == '--',
  MULTICOLON: c => c == '::',
  END: c => c == '\n' || c == ';',
  NUM: c => /^[0-9]+$/.test(c),
  VAL: c => /^[a-zA-Z_]+$/.test(c),
  INVALID: () => true
} as { [x: string]: (c: string) => boolean }

export const RESERVED = {
  if: 'IF',
  else: 'ELSE',
  elif: 'ELIF',
  for: 'FOR',
  while: 'WHILE',
  give: 'GIVE',
  next: 'NEXT',
  stop: 'STOP',
  log: 'LOG',
  true: 'TRUE',
  false: 'FALSE'
} as { [x: string]: string }

export interface Token {
  type: string
  char: string
  line: number
  column: number
}

export class Token {
  constructor({ type, char, line, column }: Token) {
    this.type = type
    this.char = char
    this.line = line
    this.column = column
  }
}

export default function tokenizer(code: string) {
  const tokens: Token[] = []
  let line = 1,
    column = 1
  for (let char of code) {
    if (char == '\r\n') char = '\n'
    if (char == '\r') continue
    for (const [type, test] of Object.entries(TOKENS)) {
      if (test(char)) {
        if (type == 'INVALID') throw new Error(`invalid token ${line}:${column}`)
        tokens.push(new Token({ type, char, line, column }))
        break
      }
    }
    if (char == '\n') {
      column = 1
      line++
    } else column++
  }
  return tokens
}