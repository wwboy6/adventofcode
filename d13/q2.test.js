import { expect, test } from 'vitest'

const { rFact } = require('../lib/lib')

test.each([
  { b: 2, expected: 2 },
  { b: 3, expected: 6 },
  { b: 4, expected: 3 },
])('rFact($b) -> $expected', ({ b, expected }) => {
  expect(rFact(b)).toBe(expected)
})
