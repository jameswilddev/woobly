import generateRootReadmeBadges from "./generate-root-readme-badges"
import generateReadmeBadges from "./generate-readme-badges"
import generateReadmeFooter from "./generate-readme-footer"

export default function (
  name: ReadonlyArray<string>,
  description: string,
): string {
  return `# \`${name.join(`/`)}\` ${generateRootReadmeBadges()} ${generateReadmeBadges(name)}

${description}

${generateReadmeFooter()}
`
}
