import * as os from "os"
import * as fs from "fs"
import * as path from "path"
import * as pngjs from "pngjs"
import * as jsdom from "jsdom"
import writeFile from "./write-file"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`writeFile`, () => {
    for (const production of [false, true]) {
      describe(`production ${production}`, () => {
        function scenario(
          description: string,
          fileName: string,
          assert: (
            sourceFilePath: () => string,
            destinationFilePath: () => string,
          ) => void
        ): void {
          describe(description, () => {
            let sourceFilePath: string
            let destinationFilePath: string
            beforeAll(async () => {
              sourceFilePath = path.join(`test-data`, `write-file`, fileName)
              const buffer = await fs.promises.readFile(sourceFilePath)

              const baseDir = await fs.promises.mkdtemp(
                path.join(os.tmpdir(), `woobly-build-tool-helpers-write-file-tests`)
              )
              destinationFilePath = path.join(baseDir, fileName)

              await writeFile([baseDir, fileName], buffer, production)
            })

            afterAll(async () => {
              await fs.promises.rmdir(destinationFilePath, { recursive: true })
            })

            assert(() => sourceFilePath, () => destinationFilePath)
          })
        }

        scenario(
          `binary`,
          `random.bin`,
          (sourceFilePath, destinationFilePath) => {
            let sourceBuffer: Buffer
            let destinationBuffer: Buffer

            beforeAll(async () => {
              sourceBuffer = await fs.promises.readFile(sourceFilePath())
              destinationBuffer = await fs.promises.readFile(destinationFilePath())
            })

            it(
              `copies the binary exactly`,
              () => expect(sourceBuffer).toEqual(destinationBuffer)
            )
          }
        )

        scenario(
          `text`,
          `text.txt`,
          (sourceFilePath, destinationFilePath) => {
            let sourceText: string
            let destinationText: string

            beforeAll(async () => {
              sourceText = await fs.promises.readFile(sourceFilePath(), `utf8`)
              destinationText = await fs.promises.readFile(destinationFilePath(), `utf8`)
            })

            it(
              `copies the text exactly`,
              () => expect(sourceText).toEqual(destinationText)
            )
          }
        )

        scenario(
          `json`,
          `json.json`,
          (sourceFilePath, destinationFilePath) => {
            let sourceJson: any
            let destinationJson: any

            beforeAll(async () => {
              sourceJson = JSON.parse(await fs.promises.readFile(sourceFilePath(), `utf8`))
              destinationJson = JSON.parse(await fs.promises.readFile(destinationFilePath(), `utf8`))
            })

            it(
              `copies the json`,
              () => expect(sourceJson).toEqual(destinationJson)
            )
          }
        )

        scenario(
          `png`,
          `png.png`,
          (sourceFilePath, destinationFilePath) => {
            let sourcePng: pngjs.PNG
            let destinationPng: pngjs.PNG

            beforeAll(async () => {
              async function readPng(filePath: string): Promise<pngjs.PNG> {
                const png = new pngjs.PNG()
                await new Promise((resolve, reject) => {
                  fs.createReadStream(filePath)
                    .on(`error`, reject)
                    .pipe(png)
                    .on(`error`, reject)
                    .on(`parsed`, resolve)
                })
                return png
              }

              sourcePng = await readPng(sourceFilePath())
              destinationPng = await readPng(destinationFilePath())
            })

            it(
              `writes a png with the same width`,
              () => expect(destinationPng.width).toEqual(sourcePng.width),
            )

            it(
              `writes a png with the same height`,
              () => expect(destinationPng.height).toEqual(sourcePng.height),
            )

            it(
              `writes a png with the same alpha channel`,
              () => expect(destinationPng.data.filter((_, i) => i % 4 === 3))
                .toEqual(sourcePng.data.filter((_, i) => i % 4 === 3)),
            )

            function zeroRgbWhereAlphaIsZero(
              data: Uint8Array,
            ): Uint8Array {
              const output = data.slice()
              for (let pixel = 0; pixel < output.length; pixel += 4) {
                if (!output[pixel + 3]) {
                  output[pixel] = 0
                  output[pixel + 1] = 0
                  output[pixel + 2] = 0
                }
              }
              return output
            }

            it(
              `writes a png with the same rgb channels where the alpha channel is non-zero`,
              () => expect(zeroRgbWhereAlphaIsZero(destinationPng.data))
                .toEqual(zeroRgbWhereAlphaIsZero(sourcePng.data)),
            )
          }
        )

        scenario(
          `html`,
          `example.html`,
          (sourceFilePath, destinationFilePath) => {
            let sourceHtml: string
            let destinationHtml: string

            beforeAll(async () => {
              // This isn't really correct, but "will do" for making sure
              // roughly equivalent HTML was output given controlled input.
              function recurseDom(
                element: Element,
              ): string {
                if (
                  [`HTML`, `HEAD`, `META`, `TITLE`, `BODY`, `DIV`, `UL`, `LI`].includes(element.tagName)
                ) {
                  const attributes = Array
                    .from(element.attributes)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(a => ` ${a.name}="${a.value}"`)
                    .join(``)

                  const content = element.children.length
                    ? Array.from(element.children).map(recurseDom).join(``)
                    : element.textContent
                  return `<${element.tagName}${attributes}>${content}</${element.tagName}>`
                } else {
                  throw new Error(`Unimplemented tag name "${element.tagName}".`)
                }
              }

              const sourceFile = await fs.promises.readFile(sourceFilePath(), `utf8`)
              const sourceDom = new jsdom.JSDOM(sourceFile)
              sourceHtml = recurseDom(sourceDom.window.document.documentElement)

              const destinationFile = await fs.promises.readFile(destinationFilePath(), `utf8`)
              const destinationDom = new jsdom.JSDOM(destinationFile)
              destinationHtml = recurseDom(destinationDom.window.document.documentElement)
            })

            it(
              `writes a html file with content equivalent to that expected`,
              () => expect(sourceHtml).toEqual(destinationHtml),
            )
          }
        )

        scenario(
          `javascript`,
          `example.js`,
          (sourceFilePath, destinationFilePath) => {
            sourceFilePath
            let result: number

            beforeAll(async () => {
              const source = await fs.promises.readFile(destinationFilePath(), `utf8`)
              const func = new Function(`a`, `b`, source)
              func((answer: number) => result = answer, 14)
            })

            it(`writes executable Javascript`, () => expect(result).toEqual(196))
          }
        )
      })
    }

    describe(`production invalid javascript`, () => {
      let destinationFilePath: string
      let thrown: null | Error = null
      beforeAll(async () => {
        const sourceFilePath = path.join(`test-data`, `write-file`, `invalid.js`)
        const buffer = await fs.promises.readFile(sourceFilePath)

        const baseDir = await fs.promises.mkdtemp(
          path.join(os.tmpdir(), `woobly-build-tool-helpers-write-file-tests`)
        )
        destinationFilePath = path.join(baseDir, `invalid.js`)

        try {
          await writeFile([baseDir, `invalid.js`], buffer, true)
        } catch (e) {
          thrown = e
        }
      })

      afterAll(async () => {
        await fs.promises.rmdir(destinationFilePath, { recursive: true })
      })

      it(`throws the expected error`, () => expect(thrown).toEqual(new SyntaxError(`Unexpected token: eof, expected: punc «}»`)))

      it(`does not write the destination file`, async () => {
        try {
          await fs.promises.access(destinationFilePath)
          fail()
        } catch (e) {
          expect(e.code).toEqual(`ENOENT`)
        }
      })
    })
  })
})
