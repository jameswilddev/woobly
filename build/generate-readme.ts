import generateReadmeBadges from "./generate-readme-badges"
import generateReadmeFooter from "./generate-readme-footer"

export default function (
  name: ReadonlyArray<string>,
  description: string,
): string {
  return `# \`${name.join(`/`)}\` ${generateReadmeBadges(name)}

${description}

${generateReadmeFooter()}`
}
