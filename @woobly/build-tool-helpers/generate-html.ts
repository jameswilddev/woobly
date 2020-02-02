import * as path from "path"
import * as pug from "pug"
import Application from "./application"

const template = pug.compileFile(path.join(__dirname, `template.pug`))

export default function (
  application: Application,
  faviconsHtml: ReadonlyArray<string>,
): string {
  return template({
    title: application.application.name.long,
    faviconsHtml: faviconsHtml.join(``),
  })
}
