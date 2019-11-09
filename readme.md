# Woobly [![Travis](https://img.shields.io/travis/jameswilddev/woobly.svg)](https://travis-ci.org/jameswilddev/woobly) [![License](https://img.shields.io/github/license/jameswilddev/woobly.svg)](https://github.com/jameswilddev/woobly/blob/master/license) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly?ref=badge_shield) [![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Think Webpack, but, like, with some differences and stuff (meant for small games
and demos).

- TypeScript everywhere.
- Just whack everything on the global scope.  This is good enough for small
  applications, minifies extremely well, and...
- Able to swap code in and out in realtime without reloading the page.

That last one comes with some caveats though!

For it to work, your TypeScript needs to follow some rules:

- Be purely declarative.  Entry points are configured which should be where all
  the action happens.
- No global `const` or `let` which depend on other files for initialization;
  these won't update when that file is updated.
- State will be lost when the file is updated.
- Any side effects other than declarations (DOM, etc.) can't be rolled back when
  the file is deleted or updated.

## NPM packages

Name                                                     | Version                                                                                                                           | Description                                                            
-------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -----------------------------------------------------------------------
[@woobly/build-tool-helpers](@woobly/build-tool-helpers) | [![0.0.2](https://img.shields.io/npm/v/@woobly/build-tool-helpers.svg)](https://www.npmjs.com/package/@woobly/build-tool-helpers) | Common helpers used by Woobly build tools.                             
[woobly](woobly)                                         | [![0.0.1](https://img.shields.io/npm/v/woobly.svg)](https://www.npmjs.com/package/woobly)                                         | This is a stub package.  You probably want a @woobly/* package instead.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly?ref=badge_large)