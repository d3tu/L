import { tokenizer, TOKENS, RESERVED, Token } from '.'

export default class Lexer {
  tokens: Token[] = []
  private token?: Token
  private chars: Token[]
  private char?: Token
  private index = 0

  constructor(code: string) {
    this.chars = tokenizer(code)
    this.char = this.chars[0]
    this.work()
  }

  private next() {
    return this.char = this.chars[++this.index]
  }

  private get existNext() {
    return this.chars[this.index + 1]
  }

  private val() {
    this.token = this.char
    this.next()
    while (this.char?.type == 'VAL' || this.char?.type == 'NUM') {
      if (this.token && this.char) this.token.char += this.char.char
      if (!this.next()) break
    }
    if (this.token && this.char && this.token.char in RESERVED) this.token.type = RESERVED[this.token.char]
    if (this.token) this.tokens.push(this.token)
    this.token = undefined
    this.work()
  }

  private num() {
    let decimal = false
    this.token = this.char
    this.next()
    while (this.char?.type == 'NUM' || (!decimal && this.char?.type == 'DOT' && this.existNext?.type == 'NUM')) {
      if (this.char?.type == 'DOT') decimal = true
      if (this.token && this.char) this.token.char += this.char.char
      if (!this.next()) break
    }
    if (this.token) this.tokens.push(this.token)
    this.token = undefined
    this.work()
  }

  private str() {
    this.token = {
      type: 'STR',
      char: '',
      line: this.char?.line || 0,
      column: this.char?.column || 0
    }
    if (!this.existNext) throw new Error(`string not closed ${this.token.line}:${this.token.column}`)
    this.next()
    while (this.char && this.char.type != 'QUOTE') {
      if (this.token && this.char) this.token.char += this.char.char
      if (!this.next()) throw new Error(`string not closed ${this.token.line}:${this.token.column}`)
    }
    this.tokens.push(new Token(this.token))
    this.token = undefined
    this.next()
    this.work()
  }

  private op() {
    if (this.char && this.char.type != 'SPACE') {
      const multiOp = this.multiOp()
      if (multiOp && this.next()) this.tokens.push(multiOp)
      else if (this.char) this.tokens.push(this.char)
    }
    this.next()
    this.work()
  }

  private multiOp() {
    if (this.existNext) {
      const char = this.char?.char + this.existNext?.char
      for (const [type, test] of Object.entries(TOKENS))
        if (test(char) && type != 'INVALID') return new Token({
          type, char, line: this.char?.line || 0, column: this.char?.column || 0
        })
    }
  }

  private msg() {
    this.token = {
      type: 'MSG',
      char: '',
      line: this.char?.line || 0,
      column: this.char?.column || 0
    }
    this.next()
    while (this.char?.type != 'END') {
      if (this.token && this.char) this.token.char += this.char.char
      this.next()
    }
    if (this.token) this.tokens.push(this.token)
    this.token = undefined
    this.work()
  }

  private work() {
    if (this.char) switch (this.char.type) {
      case 'VAL':
        return this.val()
      case 'NUM':
        return this.num()
      case 'QUOTE':
        return this.str()
      case 'MSG':
        return this.msg()
      default:
        this.op()
    }
  }
}