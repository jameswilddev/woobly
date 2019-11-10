import generateRootReadmeBadges from "./generate-root-readme-badges"
import generateRootReadmePackageTable from "./generate-root-readme-package-table"
import generateReadmeFooter from "./generate-readme-footer"

export default function (): string {

  return `# Woobly ${generateRootReadmeBadges()}

Think Webpack, but, like, with some differences and stuff (meant for small games
and demos).

- TypeScript everywhere.
- Just whack everything on the global scope.  This is good enough for small
  applications, minifies extremely well, and...
- Able to swap code in and out in realtime without reloading the page.

That last one comes with some caveats though!

For it to work, your TypeScript needs to follow some rules:

- Be purely declarative.  Entry points are configured which should be where all
  the action happens.
- No global \`const\` or \`let\` which depend on other files for initialization;
  these won't update when that file is updated.
- State will be lost when the file is updated.
- Any side effects other than declarations (DOM, etc.) can't be rolled back when
  the file is deleted or updated.

## Plugins and content

In addition to TypeScript, additional file types can be imported, for which
TypeScript is generated and included in the build.

Given the file path
\`src/a-directory/a-subdirectory/a-file-name.multi.part.extension\`, the plugin
which declares that it handles \`multi.part.extension\` files will generate
TypeScript which declares \`aDirectoryASubdirectoryAFileName\` on the global
scope for your TypeScript to use.

Plugins are discovered through \`package.json\`; execute
\`npm install --save-dev {plugin-name}\` to install a plugin.

### Implementing plugins

Plugins should depend upon \`@woobly/plugin-helpers\` and default export a
fulfilment of its exported \`Plugin\` type.

Additionally, their \`package.json\` files should include the metadata used to
match it to files:

\`\`\`json
{
  "wooblyPlugin": {
    "fileExtension": "any.file.extension"
  }
}
\`\`\`

${generateRootReadmePackageTable()}

${generateReadmeFooter()}`
}
