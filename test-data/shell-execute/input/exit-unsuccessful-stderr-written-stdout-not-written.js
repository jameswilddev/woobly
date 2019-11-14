const fs = require(`fs`)
const path = require(`path`)

fs.writeFileSync(
  path.join(`test-data`, `shell-execute`, `output`, `exit-unsuccessful-stderr-written-stdout-not-written.json`),
  JSON.stringify(process.argv),
)

process.stderr.write(`Test "standard" error output`)
process.exit(3)
