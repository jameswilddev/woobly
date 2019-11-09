import generateReadmeBadges from "./generate-readme-badges"

export default function (
  name: ReadonlyArray<string>,
  description: string,
): string {
  return `# \`${name.join(`/`)}\` ${generateReadmeBadges(name)}

${description}

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly?ref=badge_large)`
}
