import { Token, Env, If } from '..'

export default class While extends If {
  proto = 'WHILE'

  constructor(tokens: Token[], env: Env) {
    super(tokens, env)
  }
}