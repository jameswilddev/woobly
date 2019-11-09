import allPackages from "./all-packages"

export default function (): string {
  const packageTable = allPackages
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(p => [`[${p.name}](${p.name})`, `[![${p.version}](https://img.shields.io/npm/v/${p.name}.svg)](https://www.npmjs.com/package/${p.name})`, p.description])

  packageTable.unshift([`Name`, `Version`, `Description`])

  const longestOfColumn = packageTable[0]
    .map((_, i) => Math.max.apply(Math, packageTable.map(row => row[i].length)))

  packageTable.splice(1, 0, longestOfColumn.map(length => `-`.repeat(length)))

  return `## NPM packages

${packageTable.map(row => row.map((column, i) => column.padEnd(longestOfColumn[i], ` `)).join(` | `)).join(`\n`)}`
}
