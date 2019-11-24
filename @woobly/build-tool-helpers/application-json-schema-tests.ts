import * as jsonschema from "jsonschema"
import applicationJsonSchema from "./application-json-schema"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`applicationJsonSchema`, () => {
    function forEachNonObject(
      callback: (
        description: string,
        value: any,
      ) => void
    ): void {
      callback(`null`, null)
      callback(`an empty string`, ``)
      callback(`a non-empty string`, `Test String`)
      callback(`zero`, 0)
      callback(`a positive integer`, 3)
      callback(`a negative integer`, -3)
      callback(`a positive float`, 3.14)
      callback(`a negative float`, -3.14)
      callback(`true`, true)
      callback(`false`, false)
      callback(`an empty array`, [])
      callback(`an array of strings`, [`Test String A`, `Test String B`, `Test String C`])
    }

    function forEachNonString(
      callback: (
        description: string,
        value: any,
      ) => void
    ): void {
      callback(`null`, null)
      callback(`zero`, 0)
      callback(`a positive integer`, 3)
      callback(`a negative integer`, -3)
      callback(`a positive float`, 3.14)
      callback(`a negative float`, -3.14)
      callback(`true`, true)
      callback(`false`, false)
      callback(`an empty array`, [])
      callback(`an array of strings`, [`Test String A`, `Test String B`, `Test String C`])
      callback(`an empty object`, {})
    }

    function forEachNonArray(
      callback: (
        description: string,
        value: any,
      ) => void
    ): void {
      callback(`null`, null)
      callback(`an empty string`, ``)
      callback(`a non-empty string`, `Test String`)
      callback(`zero`, 0)
      callback(`a positive integer`, 3)
      callback(`a negative integer`, -3)
      callback(`a positive float`, 3.14)
      callback(`a negative float`, -3.14)
      callback(`true`, true)
      callback(`false`, false)
      callback(`an empty object`, {})
    }

    function forEachNonBoolean(
      callback: (
        description: string,
        value: any,
      ) => void
    ): void {
      callback(`null`, null)
      callback(`an empty string`, ``)
      callback(`a non-empty string`, `Test String`)
      callback(`zero`, 0)
      callback(`a positive integer`, 3)
      callback(`a negative integer`, -3)
      callback(`a positive float`, 3.14)
      callback(`a negative float`, -3.14)
      callback(`an empty array`, [])
      callback(`an array of strings`, [`Test String A`, `Test String B`, `Test String C`])
      callback(`an empty object`, {})
    }

    function accepts(
      description: string,
      value: any,
    ): void {
      describe(
        description,
        () => {
          let result: jsonschema.ValidatorResult
          beforeAll(() => {
            result = jsonschema.validate(value, applicationJsonSchema)
          })

          it(`is valid`, () => expect(result.valid).toBeTruthy())
        }
      )
    }

    function rejects(
      description: string,
      value: any,
      property: string,
      message: string,
    ): void {
      describe(
        description,
        () => {
          let result: jsonschema.ValidatorResult
          beforeAll(() => {
            result = jsonschema.validate(value, applicationJsonSchema)
          })

          it(`is not valid`, () => expect(result.valid).toBeFalsy())
          it(`encounters one error`, () => expect(result.errors.length).toEqual(1))

          it(`rejects the expected property`, () => expect(result.errors.map(e => e.property)).toEqual([property]))

          it(`rejects for the expected reason`, () => expect(result.errors.map(e => e.message)).toEqual([message]))
        }
      )
    }

    const validLogoBackgroundColor = `Test Valid Logo Background Color`

    const validLogoFilePath = [`test`, `valid`, `logo`, `filePath`]

    const validLogo = {
      filePath: validLogoFilePath,
      pixelArt: true,
      backgroundColor: validLogoBackgroundColor,
    }

    const validApplicationNameShort = `Test Valid Application Name Short`
    const validApplicationNameLong = `Test Valid Application Name Long`

    const validApplicationName = {
      short: validApplicationNameShort,
      long: validApplicationNameLong,
    }

    const validApplicationDescription = `Test Valid Application Description`
    const validApplicationLanguage = `Test Valid Application Language`
    const validApplicationVersion = `Test Valid Application Version`
    const validApplicationColor = `Test Valid Application Color`
    const validApplicationAppleStatusBarStyle = `black`
    const validApplicationDisplay = `minimalUi`
    const validApplicationOrientation = `portrait`

    const validApplication = {
      name: validApplicationName,
      description: validApplicationDescription,
      language: validApplicationLanguage,
      version: validApplicationVersion,
      color: validApplicationColor,
      appleStatusBarStyle: validApplicationAppleStatusBarStyle,
      display: validApplicationDisplay,
      orientation: validApplicationOrientation,
    }

    const validDeveloperName = `Test Valid Developer Name`
    const validDeveloperWebsite = `https://test.valid/developer/website`

    const validDeveloper = {
      name: validDeveloperName,
      website: validDeveloperWebsite,
    }

    accepts(`valid`, {
      logo: validLogo,
      application: validApplication,
      developer: validDeveloper,
    })

    forEachNonObject((description, value) => rejects(description, value, `instance`, `is not of a type(s) object`))

    describe(`logo`, () => {
      rejects(`missing`, {
        application: validApplication,
        developer: validDeveloper,
      }, `instance`, `requires property "logo"`)

      forEachNonObject((description, logo) => rejects(description, {
        logo,
        application: validApplication,
        developer: validDeveloper,
      }, `instance.logo`, `is not of a type(s) object`))

      describe(`filePath`, () => {
        rejects(`missing`, {
          logo: {
            pixelArt: true,
            backgroundColor: validLogoBackgroundColor,
          },
          application: validApplication,
          developer: validDeveloper,
        }, `instance.logo`, `requires property "filePath"`)

        forEachNonArray((description, filePath) => rejects(description, {
          logo: {
            filePath,
            pixelArt: true,
            backgroundColor: validLogoBackgroundColor,
          },
          application: validApplication,
          developer: validDeveloper,
        }, `instance.logo.filePath`, `is not of a type(s) array`))

        rejects(`empty`, {
          logo: {
            filePath: [],
            pixelArt: true,
            backgroundColor: validLogoBackgroundColor,
          },
          application: validApplication,
          developer: validDeveloper,
        }, `instance.logo.filePath`, `does not meet minimum length of 1`)

        forEachNonString((description, item) => rejects(description, {
          logo: {
            filePath: [`Test Item A`, `Test Item B`, item, `Test Item C`],
            pixelArt: true,
            backgroundColor: validLogoBackgroundColor,
          },
          application: validApplication,
          developer: validDeveloper,
        }, `instance.logo.filePath[2]`, `is not of a type(s) string`))

        rejects(`item empty`, {
          logo: {
            filePath: [`Test Item A`, `Test Item B`, ``, `Test Item C`],
            pixelArt: true,
            backgroundColor: validLogoBackgroundColor,
          },
          application: validApplication,
          developer: validDeveloper,
        }, `instance.logo.filePath[2]`, `does not match pattern "\\\\S"`)

        rejects(`item white space`, {
          logo: {
            filePath: [`Test Item A`, `Test Item B`, `    \n  \r   \t   `, `Test Item C`],
            pixelArt: true,
            backgroundColor: validLogoBackgroundColor,
          },
          application: validApplication,
          developer: validDeveloper,
        }, `instance.logo.filePath[2]`, `does not match pattern "\\\\S"`)
      })

      describe(`pixelArt`, () => {
        accepts(`false`, {
          logo: {
            filePath: validLogoFilePath,
            pixelArt: false,
            backgroundColor: validLogoBackgroundColor,
          },
          application: validApplication,
          developer: validDeveloper,
        })

        rejects(`missing`, {
          logo: {
            filePath: validLogoFilePath,
            backgroundColor: validLogoBackgroundColor,
          },
          application: validApplication,
          developer: validDeveloper,
        }, `instance.logo`, `requires property "pixelArt"`)

        forEachNonBoolean((description, pixelArt) => rejects(description, {
          logo: {
            filePath: validLogoFilePath,
            pixelArt,
            backgroundColor: validLogoBackgroundColor,
          },
          application: validApplication,
          developer: validDeveloper,
        }, `instance.logo.pixelArt`, `is not of a type(s) boolean`))
      })

      describe(`backgroundColor`, () => {
        rejects(`missing`, {
          logo: {
            filePath: validLogoFilePath,
            pixelArt: true,
          },
          application: validApplication,
          developer: validDeveloper,
        }, `instance.logo`, `requires property "backgroundColor"`)

        forEachNonString((description, backgroundColor) => rejects(description, {
          logo: {
            filePath: validLogoFilePath,
            pixelArt: true,
            backgroundColor,
          },
          application: validApplication,
          developer: validDeveloper,
        }, `instance.logo.backgroundColor`, `is not of a type(s) string`))

        rejects(`empty`, {
          logo: {
            filePath: validLogoFilePath,
            pixelArt: true,
            backgroundColor: ``,
          },
          application: validApplication,
          developer: validDeveloper,
        }, `instance.logo.backgroundColor`, `does not match pattern "\\\\S"`)

        rejects(`white space`, {
          logo: {
            filePath: validLogoFilePath,
            pixelArt: true,
            backgroundColor: `    \n  \r   \t   `,
          },
          application: validApplication,
          developer: validDeveloper,
        }, `instance.logo.backgroundColor`, `does not match pattern "\\\\S"`)
      })
    })

    describe(`application`, () => {
      rejects(`missing`, {
        logo: validLogo,
        developer: validDeveloper,
      }, `instance`, `requires property "application"`)

      forEachNonObject((description, application) => rejects(description, {
        logo: validLogo,
        application,
        developer: validDeveloper,
      }, `instance.application`, `is not of a type(s) object`))

      describe(`name`, () => {
        rejects(`missing`, {
          logo: validLogo,
          application: {
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application`, `requires property "name"`)

        forEachNonObject((description, name) => rejects(description, {
          logo: validLogo,
          application: {
            name,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.name`, `is not of a type(s) object`))

        describe(`short`, () => {
          rejects(`missing`, {
            logo: validLogo,
            application: {
              name: {
                long: validApplicationNameLong,
              },
              description: validApplicationDescription,
              language: validApplicationLanguage,
              version: validApplicationVersion,
              color: validApplicationColor,
              appleStatusBarStyle: validApplicationAppleStatusBarStyle,
              display: validApplicationDisplay,
              orientation: validApplicationOrientation,
            },
            developer: validDeveloper,
          }, `instance.application.name`, `requires property "short"`)

          forEachNonString((description, short) => rejects(description, {
            logo: validLogo,
            application: {
              name: {
                short,
                long: validApplicationNameLong,
              },
              description: validApplicationDescription,
              language: validApplicationLanguage,
              version: validApplicationVersion,
              color: validApplicationColor,
              appleStatusBarStyle: validApplicationAppleStatusBarStyle,
              display: validApplicationDisplay,
              orientation: validApplicationOrientation,
            },
            developer: validDeveloper,
          }, `instance.application.name.short`, `is not of a type(s) string`))

          rejects(`empty`, {
            logo: validLogo,
            application: {
              name: {
                short: ``,
                long: validApplicationNameLong,
              },
              description: validApplicationDescription,
              language: validApplicationLanguage,
              version: validApplicationVersion,
              color: validApplicationColor,
              appleStatusBarStyle: validApplicationAppleStatusBarStyle,
              display: validApplicationDisplay,
              orientation: validApplicationOrientation,
            },
            developer: validDeveloper,
          }, `instance.application.name.short`, `does not match pattern "\\\\S"`)

          rejects(`white space`, {
            logo: validLogo,
            application: {
              name: {
                short: `    \n  \r   \t   `,
                long: validApplicationNameLong,
              },
              description: validApplicationDescription,
              language: validApplicationLanguage,
              version: validApplicationVersion,
              color: validApplicationColor,
              appleStatusBarStyle: validApplicationAppleStatusBarStyle,
              display: validApplicationDisplay,
              orientation: validApplicationOrientation,
            },
            developer: validDeveloper,
          }, `instance.application.name.short`, `does not match pattern "\\\\S"`)
        })

        describe(`long`, () => {
          rejects(`missing`, {
            logo: validLogo,
            application: {
              name: {
                short: validApplicationNameShort,
              },
              description: validApplicationDescription,
              language: validApplicationLanguage,
              version: validApplicationVersion,
              color: validApplicationColor,
              appleStatusBarStyle: validApplicationAppleStatusBarStyle,
              display: validApplicationDisplay,
              orientation: validApplicationOrientation,
            },
            developer: validDeveloper,
          }, `instance.application.name`, `requires property "long"`)

          forEachNonString((description, long) => rejects(description, {
            logo: validLogo,
            application: {
              name: {
                short: validApplicationNameShort,
                long,
              },
              description: validApplicationDescription,
              language: validApplicationLanguage,
              version: validApplicationVersion,
              color: validApplicationColor,
              appleStatusBarStyle: validApplicationAppleStatusBarStyle,
              display: validApplicationDisplay,
              orientation: validApplicationOrientation,
            },
            developer: validDeveloper,
          }, `instance.application.name.long`, `is not of a type(s) string`))

          rejects(`empty`, {
            logo: validLogo,
            application: {
              name: {
                short: validApplicationNameShort,
                long: ``,
              },
              description: validApplicationDescription,
              language: validApplicationLanguage,
              version: validApplicationVersion,
              color: validApplicationColor,
              appleStatusBarStyle: validApplicationAppleStatusBarStyle,
              display: validApplicationDisplay,
              orientation: validApplicationOrientation,
            },
            developer: validDeveloper,
          }, `instance.application.name.long`, `does not match pattern "\\\\S"`)

          rejects(`white space`, {
            logo: validLogo,
            application: {
              name: {
                short: validApplicationNameShort,
                long: `    \n  \r   \t   `,
              },
              description: validApplicationDescription,
              language: validApplicationLanguage,
              version: validApplicationVersion,
              color: validApplicationColor,
              appleStatusBarStyle: validApplicationAppleStatusBarStyle,
              display: validApplicationDisplay,
              orientation: validApplicationOrientation,
            },
            developer: validDeveloper,
          }, `instance.application.name.long`, `does not match pattern "\\\\S"`)
        })
      })

      describe(`description`, () => {
        rejects(`missing`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application`, `requires property "description"`)

        forEachNonString((testDescription, description) => rejects(testDescription, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.description`, `is not of a type(s) string`))

        rejects(`empty`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: ``,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.description`, `does not match pattern "\\\\S"`)

        rejects(`white space`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: `    \n  \r   \t   `,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.description`, `does not match pattern "\\\\S"`)
      })

      describe(`language`, () => {
        rejects(`missing`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application`, `requires property "language"`)

        forEachNonString((description, language) => rejects(description, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.language`, `is not of a type(s) string`))

        rejects(`empty`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: ``,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.language`, `does not match pattern "\\\\S"`)

        rejects(`white space`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationLanguage,
            language: `    \n  \r   \t   `,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.language`, `does not match pattern "\\\\S"`)
      })

      describe(`version`, () => {
        rejects(`missing`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application`, `requires property "version"`)

        forEachNonString((description, version) => rejects(description, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.version`, `is not of a type(s) string`))

        rejects(`empty`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: ``,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.version`, `does not match pattern "\\\\S"`)

        rejects(`white space`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationLanguage,
            language: validApplicationLanguage,
            version: `    \n  \r   \t   `,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.version`, `does not match pattern "\\\\S"`)
      })

      describe(`color`, () => {
        rejects(`missing`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application`, `requires property "color"`)

        forEachNonString((description, color) => rejects(description, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.color`, `is not of a type(s) string`))

        rejects(`empty`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: ``,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.color`, `does not match pattern "\\\\S"`)

        rejects(`white space`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationLanguage,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: `    \n  \r   \t   `,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.color`, `does not match pattern "\\\\S"`)
      })

      describe(`appleStatusBarStyle`, () => {
        for (const appleStatusBarStyle of [`default`, `blackTranslucent`]) {
          accepts(appleStatusBarStyle, {
            logo: validLogo,
            application: {
              name: validApplicationName,
              description: validApplicationDescription,
              language: validApplicationLanguage,
              version: validApplicationVersion,
              color: validApplicationColor,
              appleStatusBarStyle,
              display: validApplicationDisplay,
              orientation: validApplicationOrientation,
            },
            developer: validDeveloper,
          })
        }

        rejects(`missing`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application`, `requires property "appleStatusBarStyle"`)

        forEachNonString((description, appleStatusBarStyle) => rejects(description, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.appleStatusBarStyle`, `is not one of enum values: default,black,blackTranslucent`))

        rejects(`empty`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: ``,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.appleStatusBarStyle`, `is not one of enum values: default,black,blackTranslucent`)

        rejects(`white space`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationLanguage,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: `    \n  \r   \t   `,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.appleStatusBarStyle`, `is not one of enum values: default,black,blackTranslucent`)

        rejects(`unexpected string`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationLanguage,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: `testUnexpectedString`,
            display: validApplicationDisplay,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.appleStatusBarStyle`, `is not one of enum values: default,black,blackTranslucent`)
      })

      describe(`display`, () => {
        for (const display of [`standalone`, `fullScreen`, `browser`]) {
          accepts(display, {
            logo: validLogo,
            application: {
              name: validApplicationName,
              description: validApplicationDescription,
              language: validApplicationLanguage,
              version: validApplicationVersion,
              color: validApplicationColor,
              appleStatusBarStyle: validApplicationAppleStatusBarStyle,
              display,
              orientation: validApplicationOrientation,
            },
            developer: validDeveloper,
          })
        }

        rejects(`missing`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application`, `requires property "display"`)

        forEachNonString((description, display) => rejects(description, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.display`, `is not one of enum values: standalone,fullScreen,minimalUi,browser`))

        rejects(`empty`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: ``,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.display`, `is not one of enum values: standalone,fullScreen,minimalUi,browser`)

        rejects(`white space`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationLanguage,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: `    \n  \r   \t   `,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.display`, `is not one of enum values: standalone,fullScreen,minimalUi,browser`)

        rejects(`unexpected string`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationLanguage,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: `testUnexpectedString`,
            orientation: validApplicationOrientation,
          },
          developer: validDeveloper,
        }, `instance.application.display`, `is not one of enum values: standalone,fullScreen,minimalUi,browser`)
      })

      describe(`orientation`, () => {
        for (const orientation of [`any`, `natural`, `landscape`]) {
          accepts(orientation, {
            logo: validLogo,
            application: {
              name: validApplicationName,
              description: validApplicationDescription,
              language: validApplicationLanguage,
              version: validApplicationVersion,
              color: validApplicationColor,
              appleStatusBarStyle: validApplicationAppleStatusBarStyle,
              display: validApplicationDisplay,
              orientation,
            },
            developer: validDeveloper,
          })
        }

        rejects(`missing`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
          },
          developer: validDeveloper,
        }, `instance.application`, `requires property "orientation"`)

        forEachNonString((description, orientation) => rejects(description, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation,
          },
          developer: validDeveloper,
        }, `instance.application.orientation`, `is not one of enum values: any,natural,portrait,landscape`))

        rejects(`empty`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationDescription,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: ``,
          },
          developer: validDeveloper,
        }, `instance.application.orientation`, `is not one of enum values: any,natural,portrait,landscape`)

        rejects(`white space`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationLanguage,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: `    \n  \r   \t   `,
          },
          developer: validDeveloper,
        }, `instance.application.orientation`, `is not one of enum values: any,natural,portrait,landscape`)

        rejects(`unexpected string`, {
          logo: validLogo,
          application: {
            name: validApplicationName,
            description: validApplicationLanguage,
            language: validApplicationLanguage,
            version: validApplicationVersion,
            color: validApplicationColor,
            appleStatusBarStyle: validApplicationAppleStatusBarStyle,
            display: validApplicationDisplay,
            orientation: `testUnexpectedString`,
          },
          developer: validDeveloper,
        }, `instance.application.orientation`, `is not one of enum values: any,natural,portrait,landscape`)
      })
    })

    describe(`developer`, () => {
      rejects(`missing`, {
        logo: validLogo,
        application: validApplication,
      }, `instance`, `requires property "developer"`)

      forEachNonObject((description, developer) => rejects(description, {
        logo: validLogo,
        application: validApplication,
        developer,
      }, `instance.developer`, `is not of a type(s) object`))

      describe(`name`, () => {
        rejects(`missing`, {
          logo: validLogo,
          application: validApplication,
          developer: {
            website: validDeveloperWebsite,
          },
        }, `instance.developer`, `requires property "name"`)

        forEachNonString((description, name) => rejects(description, {
          logo: validLogo,
          application: validApplication,
          developer: {
            name,
            website: validDeveloperWebsite,
          },
        }, `instance.developer.name`, `is not of a type(s) string`))

        rejects(`empty`, {
          logo: validLogo,
          application: validApplication,
          developer: {
            name: ``,
            website: validDeveloperWebsite,
          },
        }, `instance.developer.name`, `does not match pattern "\\\\S"`)

        rejects(`white space`, {
          logo: validLogo,
          application: validApplication,
          developer: {
            name: `    \n  \r   \t   `,
            website: validDeveloperWebsite,
          },
        }, `instance.developer.name`, `does not match pattern "\\\\S"`)
      })

      describe(`website`, () => {
        rejects(`missing`, {
          logo: validLogo,
          application: validApplication,
          developer: {
            name: validDeveloperName,
          },
        }, `instance.developer`, `requires property "website"`)

        forEachNonString((description, website) => rejects(description, {
          logo: validLogo,
          application: validApplication,
          developer: {
            name: validDeveloperName,
            website,
          },
        }, `instance.developer.website`, `is not of a type(s) string`))

        rejects(`empty`, {
          logo: validLogo,
          application: validApplication,
          developer: {
            name: validDeveloperName,
            website: ``,
          },
        }, `instance.developer.website`, `does not conform to the "uri" format`)

        rejects(`white space`, {
          logo: validLogo,
          application: validApplication,
          developer: {
            name: validDeveloperName,
            website: `    \n  \r   \t   `,
          },
        }, `instance.developer.website`, `does not conform to the "uri" format`)

        rejects(`non-url`, {
          logo: validLogo,
          application: validApplication,
          developer: {
            name: validDeveloperName,
            website: `Test Non-Url`,
          },
        }, `instance.developer.website`, `does not conform to the "uri" format`)
      })
    })
  })
})
