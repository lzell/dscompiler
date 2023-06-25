import { camelCase } from 'lodash'
import numWords from 'num-words'

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
