export default function (
  name: string,
): string {
  return [
    `[![Travis](https://img.shields.io/travis/jameswilddev/woobly.svg)](https://travis-ci.org/jameswilddev/woobly)`,
    `[![License](https://img.shields.io/github/license/jameswilddev/woobly.svg)](https://github.com/jameswilddev/woobly/blob/master/license)`,
    `[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly?ref=badge_shield)`,
    `[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)`,
    `[![npm](https://img.shields.io/npm/v/@woobly/${name}.svg)](https://www.npmjs.com/package/@woobly/${name})`,
    `[![npm type definitions](https://img.shields.io/npm/types/@woobly/${name}.svg)](https://www.npmjs.com/package/@woobly/${name})`
  ].join(` `)
}
