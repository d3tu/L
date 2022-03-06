import { Lexer, Parser } from './source'
console.time('build')
try {
  const lexer = new Lexer(`1 + 1 / (2 * 2) - 4`)
  const parser = new Parser()
  parser.load(lexer.tokens)
  console.log(parser.work())
} catch (e) {
  console.error(e)
}
console.timeEnd('build')