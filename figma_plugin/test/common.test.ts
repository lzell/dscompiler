import { sanitizeName } from '../src/core/utils/common.ts'
import { humanifyNumber } from '../src/core/utils/common.ts'

test("Sanitize name", () => {
  expect(sanitizeName("test/color")).toBe("testColor")
  expect(sanitizeName("test:color")).toBe("testColor")
  expect(sanitizeName("test+color")).toBe("testColor")
  expect(sanitizeName("1")).toBe("one")
  expect(sanitizeName("12")).toBe("twelve")
  expect(sanitizeName("-1")).toBe("minusOne")
  expect(sanitizeName("-test")).toBe("minusTest")
})

test("Humanify number", () => {
  expect(humanifyNumber(0.0001)).toBe(0)
  expect(humanifyNumber(0.9999)).toBe(1)
  expect(humanifyNumber(1.0001)).toBe(1)
  expect(humanifyNumber(1.9999)).toBe(2)
  expect(humanifyNumber(-0.0001)).toBe(0)
  expect(humanifyNumber(-0.9999)).toBe(-1)
  expect(humanifyNumber(-0.24)).toBe(-0.24)
  expect(humanifyNumber(0.24)).toBe(0.24)
})

