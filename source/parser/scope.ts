import { Token, Parser, Handle, Env } from '..'

export default class Scope extends Array<Handle> {
  proto = 'SCOPE'

  constructor(tokens: Token[], env: Env) {
    super()
    const parser = new Parser(env)
    parser.load(tokens.slice(1, -1))
    parser.work().forEach(handle => this.push(handle))
  }
}