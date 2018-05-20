# PHP Phan (Analyzer)

[![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Installs](https://vsmarketplacebadge.apphb.com/installs/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Build Status](https://travis-ci.org/TysonAndre/vscode-php-phan.svg?branch=master)](https://travis-ci.org/TysonAndre/vscode-php-phan) [![Minimum PHP Version](https://img.shields.io/badge/php-%3E=7.0-8892BF.svg)](https://php.net/) [![Gitter](https://badges.gitter.im/phan/phan.svg)](https://gitter.im/phan/phan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

**Supports Unix/Linux.** As of version 0.2.0, this has experimental support for Windows (Not as fast or well tested).

## Features

+ Adds improved [error detection from Phan](https://github.com/phan/phan#features) to Visual Studio Code.
+ Supports "Go to definition" and "Go to type definition" (requires `"phan.enableGoToDefinition": true`).
  (Has some bugs when `pcntl` is unavailable)
+ Analyze code while you're typing.
+ Optionally analyze code with syntax errors.

## Issue Tracker

**Note: This is just the [VS Code extension that spawns Phan](https://github.com/TysonAndre/vscode-php-phan). Phan is implemented purely in PHP [in its own repository](https://github.com/phan/phan),
bugs in Phan analysis need to be fixed there and all issues should be reported [there](https://github.com/phan/phan/issues).**

However, bugs in this VS code extension (crashes, etc) or related to the language server protocol should be reported [in this extension's issue tracker](https://github.com/TysonAndre/vscode-php-phan/issues)

## Installation

### Dependencies:

1. PHP 7.0+ must be installed.
   You can either add it to your PATH or set the `phan.executablePath` setting.
2. `pcntl` is recommended. (Available on Unix/Linux)
   (Phan's Language Server Protocol support depends on `pcntl` module being installed, which is only available on those platforms)

   0.2.0 has experimental support for running the Phan server without `pcntl`
   (It manually backs up, analyzes the requested files, then restores the server's state instead of forking to analyze)
3. (Optional) For optimal performance and accuracy of analysis,
   [the `php-ast` PECL extension](https://pecl.php.net/package/ast) should be installed and enabled.

### Setup steps

This assumes you have already installed the [dependencies](#dependencies).

Add these entries to your VSCode config (Open the menu at File > Preferences > Settings)


```javascript
{
    // Currently, this extension is limited to analyzing only a single folder.
    // The config value must be the root of the project,
    // and contain a .phan/config.php file with a Phan config for that project
    // (including files to parse and analyze).
    // On windows, this would be a path such as "C:\\Users\\MyUser\\path\\to\\analyzed\\folder"
    "phan.analyzedProjectDirectory": "/path/to/folder/to/analyze",

    // Path to a php 7.0+ binary (preferably with the php-ast PECL extension installed and enabled)
    // This should be as similar as possible as the php installation used to run Phan
    // (Same php minor version, same extensions or phan internal stubs for extensions (excluding xdebug), etc.)
    // On windows, this would be "C:\\path\\to\\php-7.0-installation\\php.exe"
    "phan.phpExecutablePath": "/path/to/php7.1",

    // Useful if you aren't already using another extension. Off by default.
    // for "Go To Definition" and "Go To Type Definition"
    "phan.enableGoToDefinition": true,

    // Files which this should analyze
    "phan.analyzedFileExtensions": ["php"]
}
```

**After adding these entries, close and re-open Visual Studio Code in order for Phan to pick up the new settings.**

If you have issues, see the [Troubleshooting section](#troubleshooting)

## Examples

### Error Detection

![Phan error detection demo](https://raw.githubusercontent.com/TysonAndre/vscode-php-phan/master/images/error_detection.png)

Phan's capabilities are summarized in [Phan's README](https://github.com/phan/phan#features)

### Error Detection (Tolerating Syntax Errors)

![Phan error tolerant detection demo](https://raw.githubusercontent.com/TysonAndre/vscode-php-phan/master/images/tolerant_parsing.png)

Optional, enabled by the setting `phan.useFallbackParser`

### Go To Definition

+ Support "Go to definition" for properties, classes, global/class constants, and methods/global functions
+ Support "Go to type definition" for variables, properties, classes, and methods/global functions

This is disabled by default. You must set `"phan.enableGoToDefinition": true` in your `config.json` settings to enable this.

## Contributing

Clone this whole repository and in the root directory execute:

```bash
composer install
npm install
npm run build
code .
```

The last command will open the folder in VS Code. Hit `F5` to launch an Extension Development Host with the extension.
For working on the Phan language server, the easiest way is to override your config for the Phan language server installation from composer to point to the phan script within a git checkout of phan (Must set it up with `composer install` inside that checkout.).

First, checkout and setup a phan installation.

```sh
# Replace the placeholders /path/to/folder and phan_git_checkout with the folders you plan to use.

cd /path/to/folder/
git clone git@github.com:phan/phan phan_git_checkout
# Optionally, check out the branch being developed
# git checkout master
cd /path/to/folder/phan_git_checkout
composer install
```

And then point to that phan installation:

```javascript
{
    "phan.phanScriptPath": "/path/to/folder/phan_git_checkout/phan"
}
```

**For guidance on how to set up a Phan project, please see [phan/phan](https://github.com/phan/phan).**

## Troubleshooting

General troubleshooting advice:

- By setting `phan.enableDebugLog` to true (and restarting Phan), you can get extra debug output.
  Enabling debug output will slow down this extension.

- After any changes to the phan settings, the language server must be restarted.

- VSCode has a built in debugger at "Help" > "Toggle Developer Tools" ( "Console" tab)
  This will let you see this extension's Phan's debug output.

## Release History

### 0.3.5 (2018-05-20)

- Support "Go To Definition" and "Go to Type Definition"
- Upgrade Phan from 0.12.8 to 0.12.9(dev)
- See [Phan's NEWS](https://github.com/phan/phan/blob/66442c287b894854b0630a018e4a06525493e2c3/NEWS.md) for more details.

### 0.3.4 (2018-05-12)

- Upgrade Phan from 0.12.7(dev) to 0.12.8
- See [Phan's NEWS](https://raw.githubusercontent.com/phan/phan/0.12.8/NEWS.md) for more details.

### 0.3.3 (2018-05-06)

- Upgrade Phan from 0.12.3 to 0.12.7(dev)
- See [Phan's NEWS](https://raw.githubusercontent.com/phan/phan/10ce2af0ed1956e6b4e92a121be1c4b6d3fae45b/NEWS.md) for more details.

### 0.3.2 (2018-03-24)

- Upgrade Phan from 0.12.1 to 0.12.3
- See [Phan's NEWS](https://raw.githubusercontent.com/phan/phan/0.12.3/NEWS.md) for more details.

### 0.3.1 (2018-02-28)

- Upgrade Phan from 0.12.0 to 0.12.1
- See [Phan's NEWS](https://raw.githubusercontent.com/phan/phan/0.12.1/NEWS.md) for more details.

### 0.3.0 (2018-02-18)

- Add initial support for analyzing code for different php minor versions (PHP 7.0, 7.1, and 7.2).
  Previously, this extension acted as though the codebase used php 7.1.
  For best results, the PHP binary used to run Phan should be the same minor version as the PHP 7.x version used to run the codebase.
- See [Phan's NEWS](https://raw.githubusercontent.com/phan/phan/0.12.0/NEWS.md) for more details.

### 0.2.0 (2018-02-18)

- Allow running this extension without `pcntl` installed. (`pcntl` was not available for Windows)
  Previously, `pcntl` was required to allow Phan to fork and run analysis in a thread that did not affect the main thread. (This is no longer mandatory)

  To make this extension refuse to start if `pcntl` is not installed, set `phan.allowMissingPcntl` to false.
- Add initial support for array shapes and allow using array shapes in phpdoc.
  (E.g. `['x']` is now inferred as `array{0:string}` instead of `array<int,string>`)
- See [Phan's NEWS](https://raw.githubusercontent.com/phan/phan/e8abea1ee1cd0650b492ed262a9e3f81ac7a5790/NEWS.md) for more details.

### 0.1.0 (2018-02-16)

- By default, allow running this extension without `php-ast` installed.
  Note that the polyfill has bugs in a few edge cases (e.g. getting phpdoc for closures, successfully parsing uncommon PHP syntax).
  This polyfill is based on `tolerant-php-parser`.

  To make this extension refuse to start if `php-ast` is not installed, set `phan.allowPolyfillParser` to false.
- Fix a bug where Phan would fail to parse and analyze files that were added to the project after startup.
- Analyze all PHP files that are in other **open** tabs or split windows.
  Previously, Phan would analyze only the most recently changed file.
- If file change notifications are being sent to Phan faster than Phan can re-analyze the open files,
  make Phan batch the file change notifications before parsing and analyzing the project. (batched along with file open/close/delete notifications)

  This change to Phan should help improve Phan's responsiveness (e.g. if editing large files).
- Update Phan.

  See [Phan's NEWS](https://raw.githubusercontent.com/phan/phan/34ca3b7b079291e1a634afbdc71a3453dbb3118c/NEWS.md) for more details

### 0.0.10 (2018-02-07)

- Add an option  `phan.connectToServerWithStdio` to allow clients to continue to use stdio to communicate with the Phan language server. ([Issue #8](https://github.com/TysonAndre/vscode-php-phan/issues/8))
- Update Phan.

  Fix an edge case where the forked language server analysis worker might read a request
  intended for the main process of the Phan language server (this could happen if multiple requests were sent before Phan could respond)

### 0.0.9 (2018-02-04)

- Bump Phan version in composer.lock from 0.10.3 to 0.10.4-dev
  See [Phan's NEWS](https://raw.githubusercontent.com/phan/phan/fbb3be4fd6953fa9a56eb765e5c6d07d538640cb/NEWS) for more details

  - Phan supports analyzing `array<int,T>` and `array<string,T>` syntax in PHPDoc and in Phan's internal type system.
    (Previously, Phan would internally represent generic arrays as `T[]` (i.e. wouldn't track key types))
  - Various improvements and bug fixes.
- Add a new VSCode configuration option `phan.analyzeOnlyOnSave` (off by default). (#6)
  If you set this to true, Phan will analyze the file only when you open/save the file (And not while editing or typing).
  This is useful on large projects or PHP files.
- Change the default transport for communicating with the Phan language server from stdio to TCP.
  (Stdio may block when large requests/responses are sent)

### 0.0.8 (2018-01-20)

- Bump Phan version in composer.lock from 0.10.3-dev to 0.10.3
  See [Phan's NEWS](https://raw.githubusercontent.com/phan/phan/0.10.3/NEWS) for more details.

  - Upgrade the library used for the language server implementation.
  - Don't warn when passing `?T` (PHPDoc or real) where the PHPDoc type was `T|null`.

### 0.0.7 (2017-11-19)

- Bump Phan version in composer.lock from 0.10.2-dev to 0.10.3-dev
  See [Phan's NEWS](https://raw.githubusercontent.com/phan/phan/7f51effeec2ef1a947b02708f8f6f6993ce33514/NEWS) for more details.

  - Reduce latency of analysis.
  - Do a better job of analyzing statements in code with syntax errors.
    Switch to [tolerant-php-parser](https://github.com/Microsoft/tolerant-php-parser)
    as a dependency of the fallback parsing implementation.

### 0.0.6

- Bump Phan version in composer.lock from 0.10.1 to 0.10.2-dev
  See [Phan's NEWS](https://raw.githubusercontent.com/phan/phan/b9d02d97fd1d18e007b25a4ab17f9b7fdc4ba403/NEWS) for more details.

  - Reduce memory usage on small projects.
  - Support less ambiguous `?(T[])` and `(?T)[]` in phpdoc.
  - Improved analysis of callables.

### 0.0.5

- Bump Phan version in composer.lock from 0.10.1-dev to 0.10.1.
  See [Phan's NEWS](https://raw.githubusercontent.com/phan/phan/0.10.1/NEWS) for more details.
- Support `phan.memoryLimit` setting to limit Phan's memory usage.

### 0.0.4

- Bump Phan version in composer.lock. Support new Phan plugin types. Include History in README.md

### 0.0.3

- Improve documentation. Mention that Visual Studio Code must be restarted in order to pick up any changes to this editor's phan settings.

### 0.0.2

- Reword README, rename extension to php-phan

## Installing from source

This can be installed locally with the following method:

```bash
npm install
npm run build
node node_modules/.bin/vsce package
```

The generated VSIX file can be used locally with the steps from https://stackoverflow.com/a/38866913

## Credits

This VS Code extension and many parts of the language server protocol implementation are based on [PHP IntelliSense](https://github.com/felixfbecker/vscode-php-intellisense)

This uses [Phan](https://github.com/phan/phan)
