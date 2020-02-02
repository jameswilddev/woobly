import { Application, generateHtml } from "./index"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`generateHtml`, () => {
    let result: string
    beforeAll(() => {
      const application: Application = {
        logo: {
          filePath: ["Test Logo", "File Path"],
          pixelArt: false,
          backgroundColor: `Test Logo Background Color`,
        },
        application: {
          name: {
            long: `Test <Long> Application & Name`,
            short: `Test Short Application Name`,
          },
          description: `Test Application Description`,
          language: `Test Application Language`,
          version: `Test Application Version`,
          color: `Test Application Color`,
          appleStatusBarStyle: `black`,
          display: `minimalUi`,
          orientation: `portrait`,
        },
        developer: {
          name: `Test Developer Name`,
          website: `Test Developer Website`
        }
      }
      const faviconsHtml = [
        `<test-favicons-html-a test-attribute-a-a="test-value-a-a" test-attribute-a-b="test-value-a-b">test value a</test=favicons-html-a>`,
        `<test-favicons-html-b test-attribute-b-a="test-value-b-a" test-attribute-b-b="test-value-b-b">test value b</test=favicons-html-b>`,
        `<test-favicons-html-c test-attribute-c-a="test-value-c-a" test-attribute-c-b="test-value-c-b">test value c</test=favicons-html-c>`,
      ]
      result = generateHtml(application, faviconsHtml)
    })
    it(`generates the expected html`, () => expect(result).toEqual([
      `<html style="background: black; color: white;">`,
      `<head>`,
      `<meta charset="utf-8"/>`,
      `<title>Test &lt;Long&gt; Application &amp; Name</title>`,
      `<meta name="viewport" content="initial-scale=1, user-scalable=no"/>`,
      `<test-favicons-html-a test-attribute-a-a="test-value-a-a" test-attribute-a-b="test-value-a-b">test value a</test=favicons-html-a>`,
      `<test-favicons-html-b test-attribute-b-a="test-value-b-a" test-attribute-b-b="test-value-b-b">test value b</test=favicons-html-b>`,
      `<test-favicons-html-c test-attribute-c-a="test-value-c-a" test-attribute-c-b="test-value-c-b">test value c</test=favicons-html-c>`,
      `</head>`,
      `<body>`,
      `<noscript>Please ensure that your device and browser are up to date, and that JavaScript is enabled.</noscript>`,
      `<div id="loading-message">Loading, please wait...</div>`,
      `<script src="index.js"></script>`,
      `</body>`,
      `</html>`,
    ].join(``)))
  })
})
