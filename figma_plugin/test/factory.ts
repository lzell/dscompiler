//// Acts as the `figma` global
//export function makeFigmaMock(): PluginAPIProtocol {
//
//
//}
//
//export function makePaint(override): SolidPaint {
//  const default = {
//    "blendMode": "NORMAL",
//    "color": {
//        "r": 1,
//        "g": 0.5,
//        "b": 0
//    },
//    "opacity": 1,
//    "type": "SOLID",
//    "visible": true,
//  }
//  return { ...default, ...override }
//}
//
//export function makePaintStyle(): PaintStyle {
//  return {
//    "consumers": [],
//    "id": "123",
//    "name": "myname",
//    "paints": [makePaint()],
//    "type": "PAINT",
//    "remove": () => {},
//    "description": "my description that I added in the UI",
//    "documentationLinks": [],
//    "key": "789",
//    "remote": false,
//    "getPublishStatusAsync": () => { return Promise.resolve("UNPUBLISHED") },
//    "getPluginData": (a) => { return "x" },
//    "setPluginData": (a, b) => {},
//    "getPluginDataKeys": () => { return [] },
//    "getSharedPluginData": (a, b) => {return "x"},
//    "setSharedPluginData": (a, b, c) => {},
//    "getSharedPluginDataKeys": (a) => { return [] },
//  }
//}
