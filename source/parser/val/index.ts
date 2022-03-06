export { default as MultiVal } from './mval'
export { default as Call } from './call'
export { default as Func } from './func'
export { default as Val } from './val'
export { default as Var } from './var'

import { Token, Env, Call, Val, Var, MultiVal } from '../..'

export default class ValSwitch {
  constructor(tokens: Token[], env: Env) {
    switch (tokens[1]?.type) {
      case 'COLON':
        return new Var(tokens, env)
      case 'MULTICOLON':
        return new MultiVal(tokens, env)
      case 'LPAREN':
        let call = new Call(tokens, env)
        return call.getFunc || call
      default:
        return new Val(tokens, env)
    }
  }
}