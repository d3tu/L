export { default as Scope } from './scope'
export { default as While } from './while'
export { default as Expr } from './expr'
export { default as Give } from './give'
export { default as For } from './for'
export { default as Val } from './val'
export { default as If } from './if'

export * from './expr'
export * from './val'

export type Handle = Scope | While | Give | Expr | For | Val | If

import { Token, Env, Scope, While, Expr, Give, For, Val, If } from '..'

export default class Parser {
  private token?: Token
  private lastToken?: Token
  private tokens: Token[] = []
  private scope: Token[] = []
  private index = 0
  private open = 0
  private close = 0
  private lastOpen = 0
  private lastClose = 0
  private env: Env

  constructor(env?: Env) {
    if (env) this.env = env
    else this.env = new Env()
  }

  load(tokens: Token[]) {
    this.tokens = tokens
    this.index = this.open = this.close = this.lastOpen = this.lastClose = 0
    this.token = tokens[0]
    this.lastToken = undefined
    this.checkScope()
    return this
  }

  private checkScope() {
    if (this.token) switch (this.token.type) {
      case 'LBRACE':
        this.lastOpen = this.open
        this.open++
        break
      case 'RBRACE':
        this.lastClose = this.close
        this.close++
        break
    }
  }

  private next() {
    this.lastToken = this.token
    this.token = this.tokens[++this.index]
    this.checkScope()
  }

  private get existNext() {
    return this.tokens[this.index + 1]
  }

  private get isScope() {
    return this.open != this.close
  }

  private get lastIsScope() {
    return this.lastOpen != this.lastClose
  }

  private handle() {
    let handle: Handle | undefined
    if (this.scope[0]) switch (this.scope[0].type) {
      case 'LBRACE':
        handle = new Scope(this.scope, new Env(this.env))
        break
      case 'WHILE':
        handle = new While(this.scope, this.env)
        break
      case 'GIVE':
        handle = new Give(this.scope, this.env)
        break
      case 'FOR':
        handle = new For(this.scope, this.env)
        break
      case 'VAL':
        handle = new Val(this.scope, this.env)
        break
      case 'MSG':
        break
      case 'IF':
        handle = new If(this.scope, this.env)
        break
      default:
        handle = new Expr(this.scope, this.env)
    }
    this.scope = []
    return handle
  }

  work() {
    const program: Handle[] = []
    while (this.token) {
      if (this.isScope) this.scope.push(this.token)
      else {
        if (this.lastIsScope || this.token.type == 'END') {
          const handle = this.handle()
          if (handle) program.push(handle)
        }
        else this.scope.push(this.token)
        if (!this.existNext) {
          const handle = this.handle()
          if (handle) program.push(handle)
        }
      }
      this.next()
    }
    if (this.scope.length) throw new Error(`scope not closed ${this.lastToken ? `${this.lastToken.line}:${this.lastToken.column}` : ''}`)
    return program
  }
}