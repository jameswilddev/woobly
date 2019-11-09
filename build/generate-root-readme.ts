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

${generateRootReadmePackageTable()}

${generateReadmeFooter()}`
}
