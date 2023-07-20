import { sanitizeName } from 'src/core/utils/common.ts'
import { IPluginAPI } from 'src/core/origins/figma/api_bridge.ts'
import { IInstanceNode, IComponentNode } from 'src/core/origins/figma/api_bridge.ts'
import { Image } from 'src/core/models/image.ts'

export function inferImages(figma: IPluginAPI): Promise<Image[]> {
  const promise: Promise<Image[]> = new Promise((resolve, reject) => {
    let innerPromises = []
    for (const node of imageNodes(figma)) {
      const innerPromise = new Promise<Image>((innerResolve, innerReject) => {
        node.exportAsync({format: "PDF"}).then((res: Uint8Array) => {
          // https://stackoverflow.com/questions/75961365/argument-of-type-uint8array-is-not-assignable-to-parameter-of-type-number
          const image: Image = {name: getImageName(node), body: String.fromCharCode(...res)}
          innerResolve(image)
        })
        .catch((err: Error) => {
          innerReject(err)
        })
      })
      innerPromises.push(innerPromise)
    }

    Promise.all<Image>(innerPromises)
      .then((images: Image[]) => {
        resolve(images)
      })
      .catch(error => reject(error))
  })
  return promise
}

export function getImageName(node: IInstanceNode | IComponentNode): string {
  return sanitizeName(node.name)
}

function imageNodes(figma: IPluginAPI): (IInstanceNode|IComponentNode)[] {
    // @ts-ignore
    return swiftFrames().flatMap(frame => frame.findAll(node => (node.type == 'COMPONENT') || (node.type == 'INSTANCE')))
}


function swiftFrames(figma: IPluginAPI): FrameNode[] {
  const frameRegex = new RegExp(/images?\.swift/, 'ig')
  const frameAlternateRegex = new RegExp(/swift\.images?/, 'ig')
  // @ts-ignore
  const frameNodes: FrameNode[] = figma.currentPage.children.filter(node =>
    node.type == 'FRAME' && (node.name.match(frameRegex) || node.name.match(frameAlternateRegex))
  )
  return frameNodes
}
