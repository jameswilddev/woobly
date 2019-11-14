const fs = require(`fs`)
const path = require(`path`)

fs.writeFileSync(
  path.join(`test-data`, `shell-execute`, `output`, `exit-unsuccessful-stderr-not-written-stdout-written.json`),
  JSON.stringify(process.argv),
)

process.stdout.write(`Test "standard" output`)
process.exit(3)
