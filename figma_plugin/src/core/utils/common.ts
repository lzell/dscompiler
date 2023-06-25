import { camelCase } from 'lodash'
import numWords from 'num-words'

const SwiftReservedWords = ['associatedtype', 'class', 'deinit', 'enum', 'extension', 'fileprivate', 'func', 'import', 'init', 'inout', 'internal', 'let', 'open', 'operator', 'private', 'protocol', 'public', 'rethrows', 'static', 'struct', 'subscript', 'typealias', 'var',
  'break', 'case', 'continue', 'default', 'defer', 'do', 'else', 'fallthrough', 'for', 'guard', 'if', 'in', 'repeat', 'return', 'switch', 'where', 'while',
  'as', 'Any', 'catch', 'false', 'is', 'nil', 'super', 'self', 'Self', 'throw', 'throws', 'true', 'try',
  'associativity', 'convenience', 'dynamic', 'didSet', 'final', 'get', 'infix', 'indirect', 'lazy', 'left', 'mutating', 'none', 'nonmutating', 'optional', 'override', 'postfix', 'precedence', 'prefix', 'Protocol', 'required', 'right', 'set', 'Type', 'unowned', 'weak', 'willSet']

export function sanitizeName(name: string): string {
  const hasLeadingDigits = name.match(/^[-+:]?(\d+)/)
  if (hasLeadingDigits) {
    const leadingDigits = hasLeadingDigits[1]
    name = name.replace(leadingDigits, numWords(+leadingDigits))
  }
  name = name.replace('-',' minus ')
  name = name.replace(/[+:\/]/,' ')
  return camelCase(name)
}

export function escapeSwiftToken(name: string): string {
  if (SwiftReservedWords.includes(name)) {
    return `\`${name}\``
  }
  return name
}

export function humanifyNumber(value: number): number {
  const sign = Math.sign(value)
  const absValue = Math.abs(value)
  const integer = Math.trunc(absValue)
  const r = absValue - integer
  if (r < 0.001) {
    if (integer == -0) {
      return 0
    }
    return sign * integer
  } else if (r > 0.999) {
    return sign * (integer + 1)
  }
  return value
}
