import generateRootReadmeBadges from "./generate-root-readme-badges"
import generateReadmeBadges from "./generate-readme-badges"
import generateReadmeFooter from "./generate-readme-footer"
import generateReadmeDependencies from "./generate-readme-dependencies"

export default function (
  name: ReadonlyArray<string>,
  description: string,
  dependencies?: { readonly [name: string]: string },
): string {
  return `# \`${name.join(`/`)}\` ${generateRootReadmeBadges()} ${generateReadmeBadges(name)}

${description}

${generateReadmeDependencies(dependencies)}

${generateReadmeFooter()}
`
}
