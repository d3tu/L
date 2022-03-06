import { Token, Env } from '../..'

export default class MultiVal {
  proto = 'MVAL'
  parts: Token[] = []
  private token?: Token
  private lastToken?: Token
  private index = 0

  constructor(private tokens: Token[], env: Env) {
    try {
      env.get(tokens[0].char)
    } catch (e) {
      throw new Error(`unknown value ${tokens[0].char} ${tokens[0].line}:${tokens[0].column}`)
    }
    this.parts.push(tokens[0])
    this.next()
    while (this.token?.type == 'MULTICOLON') {
      if (!this.next()) throw new Error(`Multiple value corrupt ${this.lastToken?.line}:${this.lastToken?.column}`)
      this.parts.push(this.token)
      if (this.next()?.type != 'MULTICOLON') break
    }
    if (this.token?.type == 'COLON') {
      
    }
  }

  private next() {
    this.lastToken = this.token
    return this.token = this.tokens[++this.index]
  }
}