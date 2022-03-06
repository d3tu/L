import { Token, Env, Func, Handle } from '../..'

export default class Expr extends Array<Handle> {
  proto = 'EXPR'
  private openGroup = 0
  private closeGroup = 0
  private token?: Token
  private lastToken?: Token
  private nextToken?: Token
  private index = -1
  private parts: Token[] = []

  constructor(private tokens: Token[], private env: Env) {
    super()
    this.next()
    while (this.token) this.handle()
  }

  private handle() {
    if (this.token) switch (this.token.type) {
      case 'LPAREN':
        return this.handleGroup()
      // case 'NUM':
      // case 'STR':
      //   return this.handleLiteral()
      default:
        this.next()
    }
  }

  private handleLiteral() {

  }

  private handleGroup() {
    this.next()
    let group: Token[] = []
    while (this.isGroup) {
      if (this.token) group.push(this.token)
      if (!this.next()) throw new Error(`expected ')' after expression ${this.lastToken?.line}:${this.lastToken?.column}`)
    }
    if (this.nextToken?.type == 'LBRACE') {
      group = group.filter(g => g.type != 'COMMA')
      for (const e of group) if (e.type != 'VAL') throw new Error(`not valid argument '${e.char}' ${e.line}:${e.column}`)
      console.log(this.tokens.slice(this.index + 1))
      this.push(new Func(this.tokens.slice(this.index + 1), this.env, group))
      return
    }
    this.push(new Expr(group, this.env))
  }

  private next() {
    this.lastToken = this.token
    this.token = this.tokens[++this.index]
    this.nextToken = this.tokens[this.index + 1]
    this.checkGroup()
    return this.token
  }

  private checkGroup() {
    if (this.token) {
      if (this.token.type == 'LPAREN') this.openGroup++
      else if (this.token.type == 'RPAREN') this.closeGroup++
    }
  }

  private get isGroup() {
    return this.openGroup != this.closeGroup
  }
}