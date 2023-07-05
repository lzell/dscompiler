// API bridge types
import { IGradientPaint } from '../src/core/origins/figma/api_bridge.ts'
import { IPaintStyle } from '../src/core/origins/figma/api_bridge.ts'
import { ITransform } from '../src/core/origins/figma/api_bridge.ts'

// DSCompiler
import { NamedGradient } from '../src/core/models/gradient.ts'
import { Point } from '../src/core/models/point.ts'
import { emitGradient } from '../src/core/targets/swiftui/emit_gradients.ts'
import { emitGradients } from '../src/core/targets/swiftui/emit_gradients.ts'
import { inferGradients } from '../src/core/origins/figma/infer_gradients.ts'
import { paintStyleToLinearGradient } from '../src/core/origins/figma/infer_gradients.ts'
import { transformToModelCoordinates } from '../src/core/origins/figma/infer_gradients.ts'
import { logToUser } from '../src/core/utils/log.ts'

// Specific to testing
import { makeGradientPaint } from './factories.ts'
import { makePaintStyle } from './factories.ts'
import { makePluginAPI } from './factories.ts'

// Don't actually log to the user.
// Instead, inspect a mock and ensure the right message is being sent.
jest.mock('../src/core/utils/log.ts', () => {
  return { logToUser: jest.fn() }
})
afterEach(() => { jest.restoreAllMocks() })

test("Infering gradients from Figma uses the plugin API call getLocalPaintStyles", () => {
  const getLocalPaintStyles = jest.fn(() => { return Array<IPaintStyle>() })
  const figma = makePluginAPI({ getLocalPaintStyles: getLocalPaintStyles })
  inferGradients(figma)
  expect(getLocalPaintStyles).toHaveBeenCalled()
})

test("A paint style with linear paint converts to a linear gradient model", () => {
  const paint: IGradientPaint = {
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0.5, 0.5, 0], [-0.5, 0.5, 0.5]],
    gradientStops: [
      {
        position: 0,
        color: {r: 0, g: 0, b:0, a:1}
      },
      {
        position: 1,
        color: {r: 1, g: 0, b:0, a:1}
      }
    ],
    opacity: 1
  }
  const gradient = paintStyleToLinearGradient(makePaintStyle({paints: [paint]}))
  expect(gradient).toMatchObject({
    stops: [
      {location: 0, color: {red: 0, green: 0, blue: 0, opacity: 1}},
      {location: 1, color: {red: 1, green: 0, blue: 0, opacity: 1}},
    ],
    startPoint: {x: 0, y: 0},
    endPoint: {x: 1, y: 1}
  })
})

// In Figma, opacities can be applied to both the color stops, and to the overall gradient.
// In SwiftUI, opacities are only on the color stops.
// We do not currently compose the Figma color stop opacities and overal opacities to form derived color stop opacities.
// Instead, we alert the user that opacities on the overall gradient are not supported.
test("A gradient paint with an opacity set to other than 1 alerts the user", () => {
  const paint = makeGradientPaint({opacity: 0.5})
  paintStyleToLinearGradient(makePaintStyle({paints: [paint]}))
  expect(logToUser).toBeCalledWith('DSCompiler expects gradient opacities to be applied to color stops, not the overall gradient')
})

test("Only the first gradient paint is considered when converting to a gradient model", () => {
  const paintA = makeGradientPaint({gradientStops: [
    {color: {r: 1, g: 0, b: 0, a: 0}, position: 0},
    {color: {r: 1, g: 0, b: 0, a: 1}, position: 1},
  ]})
  const paintB = makeGradientPaint({gradientStops: [
    {color: {r: 0, g: 0, b: 1, a: 0}, position: 0},
    {color: {r: 0, g: 0, b: 1, a: 1}, position: 1},
  ]})
  const gradient = paintStyleToLinearGradient(makePaintStyle({paints: [paintA, paintB]}))
  expect(gradient).toMatchObject({
    stops: [
      {location: 0, color: {red: 1, green: 0, blue: 0, opacity: 0}},
      {location: 1, color: {red: 1, green: 0, blue: 0, opacity: 1}},
    ]
  })
})

test("A paint style name with spaces in figma is converted to camelcase for the gradient model", () => {
  const paintStyle = makePaintStyle({
    name: 'my gradient',
    paints: [makeGradientPaint()]
  })
  const gradient = paintStyleToLinearGradient(paintStyle)
  expect(gradient.name).toBe('myGradient')
})

test("A paint style description is passed through to the gradient model", () => {
  const paintStyle = makePaintStyle({
    description: 'this is a description',
    paints: [makeGradientPaint()]
  })
  const gradient = paintStyleToLinearGradient(paintStyle)
  expect(gradient.description).toBe('this is a description')
})

test("A named gradient model has a swiftUI equivalent", () => {
  const gradient: NamedGradient = {
    name: 'myGradient',
    description: 'My Docstring',
    stops: [
      {location: 0, color: {red: 1, green: 0, blue: 0, opacity: 0}},
      {location: 1, color: {red: 1, green: 0, blue: 0, opacity: 1}},
    ],
    startPoint: {x: 0, y: 0},
    endPoint: {x: 1, y: 1}
  }
  expect(emitGradient(gradient)).toBe(
`/// My Docstring
public static let myGradient = LinearGradient(
    stops: [
        Gradient.Stop(color: Color(red: 1, green: 0, blue: 0, opacity: 0), location: 0),
        Gradient.Stop(color: Color(red: 1, green: 0, blue: 0, opacity: 1), location: 1),
    ],
    startPoint: UnitPoint(x: 0, y: 0),
    endPoint: UnitPoint(x: 1, y: 1)
)`)
})

test("Multiple gradient models have a swiftUI file equivalent", () => {
  const gradientA: NamedGradient = {
    name: 'gradientA',
    description: 'My first docstring',
    stops: [
      {location: 0, color: {red: 1, green: 0, blue: 0, opacity: 0}},
      {location: 1, color: {red: 1, green: 0, blue: 0, opacity: 1}},
    ],
    startPoint: {x: 0, y: 0},
    endPoint: {x: 1, y: 1}
  }
  const gradientB: NamedGradient = {
    name: 'gradientB',
    description: 'My second docstring',
    stops: [
      {location: 0, color: {red: 0, green: 0, blue: 1, opacity: 0}},
      {location: 1, color: {red: 0, green: 0, blue: 1, opacity: 1}},
    ],
    startPoint: {x: 0.5, y: 0},
    endPoint: {x: 0.5, y: 1}
  }
  expect(emitGradients([gradientA, gradientB])).toBe(
`import SwiftUI

public extension LinearGradient {
    /// Namespace to prevent naming collisions with static accessors on
    /// SwiftUI's LinearGradient.
    ///
    /// Xcode's autocomplete allows for easy discovery of design system linear gradients.
    /// At any call site that requires a linear gradient, type \`LinearGradient.DesignSystem.<ctrl-space>\`
    struct DesignSystem {
        /// My first docstring
        public static let gradientA = LinearGradient(
            stops: [
                Gradient.Stop(color: Color(red: 1, green: 0, blue: 0, opacity: 0), location: 0),
                Gradient.Stop(color: Color(red: 1, green: 0, blue: 0, opacity: 1), location: 1),
            ],
            startPoint: UnitPoint(x: 0, y: 0),
            endPoint: UnitPoint(x: 1, y: 1)
        )

        /// My second docstring
        public static let gradientB = LinearGradient(
            stops: [
                Gradient.Stop(color: Color(red: 0, green: 0, blue: 1, opacity: 0), location: 0),
                Gradient.Stop(color: Color(red: 0, green: 0, blue: 1, opacity: 1), location: 1),
            ],
            startPoint: UnitPoint(x: 0.5, y: 0),
            endPoint: UnitPoint(x: 0.5, y: 1)
        )
    }
}
`)
})

test("Figma's gradient transforms are convertible into model coordinates", () => {
  const expectedMappings: Array<{ transform: ITransform, modelCoordinates: { startPoint: Point, endPoint: Point }}> = [
    {
      // Tranform for linear gradient from center top to center bottom
      transform: [[0, 1, 0], [-1, 0, 1]],
      modelCoordinates: {startPoint: { x: 0.5, y: 0 }, endPoint: { x: 0.5, y: 1 }}
    },
    {
      // Tranform for linear gradient from top left corner to bottom right corner
      transform: [[0.5, 0.5, 0], [-0.5, 0.5, 0.5]],
      modelCoordinates: {startPoint: { x: 0, y: 0 }, endPoint: { x: 1, y: 1 }}
    },
    {
      // Tranform for linear gradient from center left to center right
      transform: [[1, 0, 0], [0, 1, 0]],
      modelCoordinates: {startPoint: { x: 0, y: 0.5 }, endPoint: { x: 1, y: 0.5 }}
    },
    {
      // Tranform for linear gradient from bottom left corner to top right corner
      transform: [[0.5, -0.5, 0.5], [0.5, 0.5, 0]],
      modelCoordinates: {startPoint: { x: 0, y: 1 }, endPoint: { x: 1, y: 0 }}
    },
    {
      // Tranform for linear gradient from center bottom to center top
      transform: [[0, -1, 1], [1, 0, 0]],
      modelCoordinates: {startPoint: { x: 0.5, y: 1 }, endPoint: { x: 0.5, y: 0 }}
    },
    {
      // Tranform for linear gradient from bottom right corner to top left corner
      transform: [[-0.5, -0.5, 1], [0.5, -0.5, 0.5]],
      modelCoordinates: {startPoint: { x: 1, y: 1 }, endPoint: { x: 0, y: 0 }}
    },
    {
      // Tranform for linear gradient from center right to center left
      transform: [[-1, 0, 1], [0, -1, 1]],
      modelCoordinates: {startPoint: { x: 1, y: 0.5 }, endPoint: { x: 0, y: 0.5 }}
    },
    {
      // Tranform for linear gradient from top right corner to bottom left corner
      transform: [[-0.5, 0.5, 0.5], [-0.5, -0.5, 1]],
      modelCoordinates: {startPoint: { x: 1, y: 0 }, endPoint: { x: 0, y: 1}}
    },
  ]

  for (const expectedMapping of expectedMappings) {
    const modelCoords = transformToModelCoordinates(expectedMapping.transform)
    expect(modelCoords).toMatchObject(expectedMapping.modelCoordinates)
  }
})
