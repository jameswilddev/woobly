import * as childProcess from "child_process"

export default async function (
  command: string,
): Promise<string> {
  return await new Promise((resolve, reject) => {
    childProcess.exec(command, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(new Error(`Command "${command}" failed (stdout: "${stdout}"; stderr: "${stderr}").`))
      } else {
        resolve(stdout)
      }
    })
  })
}
