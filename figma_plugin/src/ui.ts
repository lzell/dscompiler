import { saveAs } from 'file-saver'
const blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"})
saveAs(blob, "hello world.txt")
