import * as path from "path"
import * as fs from "fs"
import shellExecute from "./shell-execute"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`shellExecute`, () => {
    const basePath = path.join(`test-data`, `shell-execute`)
    const inputPath = path.join(basePath, `input`)
    const outputPath = path.join(basePath, `output`)

    beforeAll(async () => {
      await fs.promises.mkdir(outputPath, { recursive: true })
    })

    afterAll(async () => {
      await fs.promises.rmdir(outputPath, { recursive: true })
    })

    function scenario(
      fileName: string,
      assert: (
        scriptPathFactory: () => string,
        rejectionFactory: () => undefined | Error,
        resolutionFactory: () => undefined | string,
      ) => void,
    ): void {
      let scriptPath: string
      let rejection: undefined | Error = undefined
      let resolution: undefined | string = undefined
      let reportedArguments: any

      beforeAll(async () => {
        scriptPath = path.join(inputPath, `${fileName}.js`)

        try {
          resolution = await shellExecute(
            `Test "Description"`,
            `node`,
            [
              scriptPath,
              `Test "Argument" A`,
              `Test "Argument" B`,
              `Test "Argument" C`,
            ],
          )
        } catch (e) {
          rejection = e
        }

        const reportedArgumentsFilePath = path.join(outputPath, `${fileName}.json`)
        const reportedArgumentsText = await fs.promises.readFile(reportedArgumentsFilePath, `utf8`)
        reportedArguments = JSON.parse(reportedArgumentsText)
      })

      assert(() => scriptPath, () => rejection, () => resolution)

      it(
        `uses the correct arguments`,
        () => {
          if (process.platform === "win32") {
            expect([
              reportedArguments[0].toLowerCase(),
              reportedArguments[1].toLowerCase(),
            ].concat(reportedArguments.slice(2)))
              .toEqual([
                process.argv[0].toLowerCase(),
                path.join(process.cwd(), scriptPath).toLowerCase(),
                `Test "Argument" A`,
                `Test "Argument" B`,
                `Test "Argument" C`,
              ])
          } else {
            expect(reportedArguments)
              .toEqual([
                process.argv[0],
                path.join(process.cwd(), scriptPath),
                `Test "Argument" A`,
                `Test "Argument" B`,
                `Test "Argument" C`,
              ])
          }
        }
      )
    }

    function rejects(
      fileName: string,
      messageFactory: (scriptPath: string) => string,
    ): void {
      scenario(fileName, (scriptPathFactory, rejectionFactory) => it(
        `rejects with the expected message`,
        () => expect(rejectionFactory())
          .toEqual(new Error(messageFactory(scriptPathFactory()))),
      ))
    }

    function resolves(
      fileName: string,
      output: string,
    ): void {
      scenario(fileName, (scriptPathFactory, rejectionFactory, resolutionFactory) => {
        scriptPathFactory // Required as positional.
        rejectionFactory // Required as positional.
        it(
          `resolves with the expected message`,
          () => expect(resolutionFactory()).toEqual(output),
        )
      })
    }

    describe(`exit successful`, () => {
      describe(`stderr written`, () => {
        describe(`stdout written`, () => {
          rejects(
            `exit-successful-stderr-written-stdout-written`,
            scriptPath => `Command-line execution failed;
\tDescription: "Test \\"Description\\""
\tCommand: "node"
\tArgs: ${JSON.stringify(scriptPath)}, "Test \\"Argument\\" A", "Test \\"Argument\\" B", "Test \\"Argument\\" C"
\tExit code: 0
\tStdout: "Test \\"standard\\" output"
\tStderr: "Test \\"standard\\" error output"`,
          )
        })

        describe(`stdout not written`, () => {
          rejects(
            `exit-successful-stderr-written-stdout-not-written`,
            scriptPath => `Command-line execution failed;
\tDescription: "Test \\"Description\\""
\tCommand: "node"
\tArgs: ${JSON.stringify(scriptPath)}, "Test \\"Argument\\" A", "Test \\"Argument\\" B", "Test \\"Argument\\" C"
\tExit code: 0
\tStdout: ""
\tStderr: "Test \\"standard\\" error output"`,
          )
        })
      })

      describe(`stderr not written`, () => {
        describe(`stdout written`, () => {
          resolves(
            `exit-successful-stderr-not-written-stdout-written`,
            `Test "standard" output`,
          )
        })

        describe(`stdout not written`, () => {
          resolves(
            `exit-successful-stderr-not-written-stdout-not-written`,
            ``,
          )
        })
      })
    })

    describe(`exit unsuccessful`, () => {
      describe(`stderr written`, () => {
        describe(`stdout written`, () => {
          rejects(
            `exit-unsuccessful-stderr-written-stdout-written`,
            scriptPath => `Command-line execution failed;
\tDescription: "Test \\"Description\\""
\tCommand: "node"
\tArgs: ${JSON.stringify(scriptPath)}, "Test \\"Argument\\" A", "Test \\"Argument\\" B", "Test \\"Argument\\" C"
\tExit code: 3
\tStdout: "Test \\"standard\\" output"
\tStderr: "Test \\"standard\\" error output"`,
          )
        })

        describe(`stdout not written`, () => {
          rejects(
            `exit-unsuccessful-stderr-written-stdout-not-written`,
            scriptPath => `Command-line execution failed;
\tDescription: "Test \\"Description\\""
\tCommand: "node"
\tArgs: ${JSON.stringify(scriptPath)}, "Test \\"Argument\\" A", "Test \\"Argument\\" B", "Test \\"Argument\\" C"
\tExit code: 3
\tStdout: ""
\tStderr: "Test \\"standard\\" error output"`,
          )
        })
      })

      describe(`stderr not written`, () => {
        describe(`stdout written`, () => {
          rejects(
            `exit-unsuccessful-stderr-not-written-stdout-written`,
            scriptPath => `Command-line execution failed;
\tDescription: "Test \\"Description\\""
\tCommand: "node"
\tArgs: ${JSON.stringify(scriptPath)}, "Test \\"Argument\\" A", "Test \\"Argument\\" B", "Test \\"Argument\\" C"
\tExit code: 3
\tStdout: "Test \\"standard\\" output"
\tStderr: ""`,
          )
        })

        describe(`stdout not written`, () => {
          rejects(
            `exit-unsuccessful-stderr-not-written-stdout-not-written`,
            scriptPath => `Command-line execution failed;
\tDescription: "Test \\"Description\\""
\tCommand: "node"
\tArgs: ${JSON.stringify(scriptPath)}, "Test \\"Argument\\" A", "Test \\"Argument\\" B", "Test \\"Argument\\" C"
\tExit code: 3
\tStdout: ""
\tStderr: ""`,
          )
        })
      })
    })
  })
})
