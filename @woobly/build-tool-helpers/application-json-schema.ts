import * as jsonschema from "jsonschema"

const schema: jsonschema.Schema = {
  type: `object`,
  additionalProperties: false,
  required: [
    `logo`,
    `application`,
    `developer`,
  ],
  properties: {
    logo: {
      type: `object`,
      additionalProperties: false,
      required: [
        `filePath`,
        `pixelArt`,
        `backgroundColor`,
      ],
      properties: {
        filePath: {
          type: `array`,
          minItems: 1,
          items: {
            type: `string`,
            pattern: `\\S`,
          }
        },
        pixelArt: {
          type: `boolean`,
        },
        backgroundColor: {
          type: `string`,
          pattern: `\\S`,
        },
      },
    },
    application: {
      type: `object`,
      additionalProperties: false,
      required: [
        `name`,
        `description`,
        `language`,
        `version`,
        `color`,
        `appleStatusBarStyle`,
        `display`,
        `orientation`,
      ],
      properties: {
        name: {
          type: `object`,
          additionalProperties: false,
          required: [
            `long`,
            `short`,
          ],
          properties: {
            long: {
              type: `string`,
              pattern: `\\S`,
            },
            short: {
              type: `string`,
              pattern: `\\S`,
            },
          },
        },
        description: {
          type: `string`,
          pattern: `\\S`,
        },
        language: {
          type: `string`,
          pattern: `\\S`,
        },
        version: {
          type: `string`,
          pattern: `\\S`,
        },
        color: {
          type: `string`,
          pattern: `\\S`,
        },
        appleStatusBarStyle: {
          enum: [
            `default`,
            `black`,
            `blackTranslucent`,
          ],
        },
        display: {
          enum: [
            `standalone`,
            `fullScreen`,
            `minimalUi`,
            `browser`,
          ],
        },
        orientation: {
          enum: [
            `any`,
            `natural`,
            `portrait`,
            `landscape`,
          ]
        },
      },
    },
    developer: {
      type: `object`,
      additionalProperties: false,
      required: [
        `name`,
        `website`,
      ],
      properties: {
        name: {
          type: `string`,
          pattern: `\\S`,
        },
        website: {
          type: `string`,
          format: `uri`,
        },
      },
    },
  },
}

export default schema
