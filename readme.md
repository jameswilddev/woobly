# Woobly [![Travis](https://img.shields.io/travis/jameswilddev/woobly.svg)](https://travis-ci.org/jameswilddev/woobly) [![License](https://img.shields.io/github/license/jameswilddev/woobly.svg)](https://github.com/jameswilddev/woobly/blob/master/license) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly?ref=badge_shield) [![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Think Webpack, but, like, with some differences and stuff (meant for small games
and demos).

- TypeScript everywhere.
- Just whack everything on the global scope.  This is good enough for small
  applications, minifies extremely well, and...
- Able to swap code in and out in realtime without reloading the page.

That last one comes with some caveats though!

For it to work, your TypeScript needs to follow some rules:

- It needs to be in the `src` directory (or one of its subdirectories).
- Be purely declarative.  Entry points are configured which should be where all
  the action happens.
- No global `const` or `let` which depend on other files for initialization;
  these won't update when that file is updated.
- State will be lost when the file is updated.
- Any side effects other than declarations (DOM, etc.) can't be rolled back when
  the file is deleted or updated.

## Applications

Every file ending with `.application.json` in the `src` directory is built
as an application.  These JSON files describe how the application should be
assembled:

### `entry`

The name of the TypeScript function to call to start the application.  This
needs to be idempotent as some environments may call it multiple times to apply
code changes without reloading the entire application.

### `logo`

#### `filePath`

An array of strings which are a path to a logo to use, in SVG or PNG format.
This should probably be kept somewhere other than `src`, as it's unlikely to
be wanted as content.

#### `pixelArt`

When `true`, pixels will be kept sharp when scaling the logo.  When `false`,
a smoothing filter will be applied.

#### `backgroundColor`

The background color used when a transparent background is not available, e.g.
`red` or `#FF0000`.

### `application`

#### `name`

##### `long`

A longer name for the application.

##### `short`

A shorter name for the application.

#### `description`

A description of the application.

#### `language`

The RFC-5646 identifier of the language of the application, e.g. `en-US`.
Usually, each localization of an application is its own application as this
means that deep region-specific customizations can be made and only the
resources required for the current localization are included when downloading or
installing an application.

#### `version`

Describes the version of the application.

#### `color`

The color associated with the application, e.g. `red` or `#FF0000`.

#### `appleStatusBarStyle`

The style of the status bar when using an Apple device.  Values include:

##### `default`

Black on white.

##### `black`

Black on black.

##### `blackTranslucent`

White with a transparent background.

#### `display`

The form factor of the browser on some devices.  Values include:

##### `standalone`

The application fills the entire screen except for system UI such as the status
bar.

##### `fullScreen`

The application fills the entire screen.

##### `minimalUi`

The application looks like an embedded web view (i.e. clearly a web page, but in
a "trusted" context).

##### `browser`

The application looks like a page in a web browser.

#### `orientation`

The orientations supported by some devices.  Values include:

##### `any`

The orientation can change, if, for instance, the rotates the device or presses
an orientation change button.

##### `natural`

The orientation is locked to the "natural" orientation of the device.  This
might be portrait for a mobile phone, for instance.

##### `portrait`

The orientation is locked portrait.

##### `landscape`

The orientation is locked landscape (may flip if the device is upside-down).

### `developer`

#### `name`

The name of the application's developer.

#### `website`

The URL of the application's developer's websote.

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
[@woobly/build-tool-helpers](@woobly/build-tool-helpers) | [![0.0.13](https://img.shields.io/npm/v/@woobly/build-tool-helpers.svg)](https://www.npmjs.com/package/@woobly/build-tool-helpers) | Common helpers used by Woobly build tools.                             
[@woobly/plugin-helpers](@woobly/plugin-helpers)         | [![0.0.0](https://img.shields.io/npm/v/@woobly/plugin-helpers.svg)](https://www.npmjs.com/package/@woobly/plugin-helpers)          | Common helpers used by Woobly plugins.                                 
[woobly](woobly)                                         | [![0.0.4](https://img.shields.io/npm/v/woobly.svg)](https://www.npmjs.com/package/woobly)                                          | This is a stub package.  You probably want a @woobly/* package instead.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjameswilddev%2Fwoobly?ref=badge_large)
