import { Token, Env, Func, Expr, Handle } from '../..'

export default class Call {
  proto = 'CALL'
  name: string
  args: Handle[] = []
  private index = 0
  private token?: Token
  private lastToken?: Token
  private func?: Func

  constructor(private tokens: Token[], env: Env) {
    this.name = tokens[0].char
    this.next()
    if (!this.next()) throw new Error(`call not closed ${this.lastToken?.line}:${this.lastToken?.column}`)
    const args: Token[] = []
    while (this.token && this.token.type != 'RPAREN') {
      if (this.token.type == 'LPAREN') {
        console.log(tokens.slice(this.index))
      }
      args.push(this.token)
      if (!this.next()) throw new Error(`call not closed ${this.lastToken?.line}:${this.lastToken?.column}`)
      if (this.token.type != 'COMMA' && this.token.type != 'RPAREN') throw new Error(`expected ',' after argument ${this.token.line}:${this.token.column}`)
      if (this.token.type == 'RPAREN') break
      this.next()
    }
    if (this.next()?.type == 'LBRACE') {
      for (const e of args) if (e.type != 'VAL') throw new Error(`not valid argument '${e.char}' from ${this.name} ${e.line}:${e.column}`)
      this.func = new Func(tokens.slice(this.index), env, args, this.name)
      return
    }
    try {
      env.get(this.name)
    } catch (e) {
      throw new Error(`unknown function ${this.name} ${tokens[0].line}:${tokens[0].column}`)
    }
    for (const expr of new Expr(args, env)) this.args.push(expr)
  }

  get getFunc() {
    return this.func
  }

  private next() {
    this.lastToken = this.token
    return this.token = this.tokens[++this.index]
  }
}