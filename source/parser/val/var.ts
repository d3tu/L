import { Token, Env, Expr } from '../..'

export default class Var {
  proto = 'VAR'
  name: string
  expr: Expr

  constructor(tokens: Token[], env: Env) {
    this.expr = new Expr(tokens.slice(2), env)
    env.define(this.name = tokens[0].char, this)
  }
}