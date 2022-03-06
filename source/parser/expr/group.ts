import { Env, Token, Expr } from '../..'

export default class Group {
  proto = 'GROUP'
  expr: Expr

  constructor(tokens: Token[], env: Env) {
    this.expr = new Expr(tokens, env)
  }
}