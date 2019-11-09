import * as fs from "fs"
import * as path from "path"

export default async function (
  name: ReadonlyArray<string>,
  originalPackageJson: {
    readonly description: string
    readonly version: string
    readonly dependencies?: { readonly [name: string]: string }
    readonly bin?: { readonly [name: string]: string }
    readonly scripts?: { readonly [name: string]: string }
  }
): Promise<void> {
  console.log(`Writing package.json...`)
  const newPackageJsonPath = path.join.apply(path, name.concat([`package.json`]))
  const newPackageJson = {
    name: `${name.join(`/`)}`,
    description: originalPackageJson.description,
    version: originalPackageJson.version,
    engines: {
      node: `>=12.13.0`,
    },
    engineStrict: true,
    publishConfig: {
      access: `public`,
    },
    private: false,
    files: [
      `**/*.js`,
      `**/*.d.ts`,
      `!**/*-tests.*`,
    ],
    repository: {
      type: `git`,
      url: `https://github.com/jameswilddev/woobly`,
    },
    license: `MIT`,
    dependencies: originalPackageJson.dependencies,
    bin: originalPackageJson.bin,
    scripts: originalPackageJson.scripts,
  }
  const newPackageJsonText = `${JSON.stringify(newPackageJson, null, 2)}\n`
  await fs.promises.writeFile(newPackageJsonPath, newPackageJsonText)
}
