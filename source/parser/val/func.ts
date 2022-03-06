import { Token, Env, Scope } from '../..'

export default class Func {
  proto = 'FUNC'
  scope: Scope
  private index = 0
  private token?: Token
  private lastToken?: Token

  constructor(private tokens: Token[], env: Env, public args: Token[], public name?: string) {
    if (!this.next()) throw new Error(`scope not closed ${this.lastToken?.line}:${this.lastToken?.column}`)
    if (this.name) env.define(this.name, this)
    const _env = new Env(env)
    for (const arg of args) _env.define(arg.char, arg)
    this.scope = new Scope(tokens, _env)
  }

  private next() {
    this.lastToken = this.token
    return this.token = this.tokens[++this.index]
  }
}