// Color represents a color.
// Write something about docstring.
// red, green, blue are in/.... whatever format.
// The name of the color is used by code emitters to write source code with
// legible token names, meaning a developer will use this name to integrate the
// token into the consuming app.
export interface Color {
  readonly name: string
  readonly red: number
  readonly green: number
  readonly blue: number
  readonly opacity: number
}


