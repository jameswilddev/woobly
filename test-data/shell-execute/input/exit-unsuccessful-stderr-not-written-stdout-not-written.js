const fs = require(`fs`)
const path = require(`path`)

fs.writeFileSync(
  path.join(`test-data`, `shell-execute`, `output`, `exit-unsuccessful-stderr-not-written-stdout-not-written.json`),
  JSON.stringify(process.argv),
)

process.exit(3)
