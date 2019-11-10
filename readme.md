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

## Plugins and content

In addition to TypeScript, additional file types can be imported, for which
TypeScript is generated and included in the build.

Given the file path
`src/a-directory/a-subdirectory/a-file-name.multi.part.extension`, the plugin
which declares that it handles `multi.part.extension` files will generate
TypeScript which declares `aDirectoryASubdirectoryAFileName` on the global
scope for your TypeScript to use.

Plugins are discovered through `package.json`; execute
`npm install --save-dev {plugin-name}` to install a plugin.

### Implementing plugins

Plugins should depend upon `@woobly/plugin-helpers` and default export a
fulfilment of its exported `Plugin` type.

Additionally, their `package.json` files should include the metadata used to
match it to files:

```json
{
  "wooblyPlugin": {
    "fileExtension": "any.file.extension"
  }
}
```

## NPM packages

Name                                                     | Version                                                                                                                            | Description                                                            
-------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -----------------------------------------------------------------------
[@woobly/build-tool-helpers](@woobly/build-tool-helpers) | [![0.0.10](https://img.shields.io/npm/v/@woobly/build-tool-helpers.svg)](https://www.npmjs.com/package/@woobly/build-tool-helpers) | Common helpers used by Woobly build tools.                             
[@woobly/plugin-helpers](@woobly/plugin-helpers)         | [![0.0.0](https://img.shields.io/npm/v/@woobly/plugin-helpers.svg)](https://www.npmjs.com/package/@woobly/plugin-helpers)          | Common helpers used by Woobly plugins.                                 
[woobly](woobly)                                         | [![0.0.4](https://img.shields.io/npm/v/woobly.svg)](https://www.npmjs.com/package/woobly)                                          | This is a stub package.  You probably want a @woobly/* package instead.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly?ref=badge_large)
