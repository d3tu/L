import { Token, Env, If } from '..'

export default class For extends If {
  proto = 'FOR'

  constructor(tokens: Token[], env: Env) {
    super(tokens, env)
  }
}