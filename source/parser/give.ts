import { Token, Env, Expr } from '..'

export default class Give {
  proto = 'GIVE'
  expr: Expr

  constructor(tokens: Token[], env: Env) {
    this.expr = new Expr(tokens.slice(1), env)
  }
}