import { Token, Env } from '../..'

export default class Val {
  proto = 'VAL'
  name: string

  constructor(token: Token, env: Env) {
    this.name = token.char
    try {
      env.get(this.name)
    } catch (e) {
      throw new Error(`unknown value ${this.name} ${token.line}:${token.column}`)
    }
  }
}