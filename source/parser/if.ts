import { Token, Env, Expr, Scope } from '..'

export default class If {
  proto = 'IF'
  expr: Expr
  scope: Scope

  constructor(tokens: Token[], env: Env) {
    const expr: Token[] = []
    let index = 1
    while (tokens[index]?.type != 'LBRACE') {
      expr.push(tokens[index])
      if (!tokens[++index]) throw new Error(`scope not opened`)
      if (tokens[index].type == 'LBRACE') break
    }
    this.expr = new Expr(expr, env)
    this.scope = new Scope(tokens.slice(++index), new Env(env))
  }
}