# PHP Phan (Analyzer)

[![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Installs](https://vsmarketplacebadge.apphb.com/installs/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Build Status](https://travis-ci.org/TysonAndre/vscode-php-phan.svg?branch=master)](https://travis-ci.org/TysonAndre/vscode-php-phan) [![Minimum PHP Version](https://img.shields.io/badge/php-%3E=7.0-8892BF.svg)](https://php.net/) [![Gitter](https://badges.gitter.im/phan/phan.svg)](https://gitter.im/phan/phan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

**Supports Unix/Linux, and Windows(experimental).** As of version 0.3.8, the experimental support for Windows was improved.

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
    // The path to a project folder which Phan will analyze
    // (or an array of 1 or more folders to independently analyze).
    // Each project folder must be the root of a Phan project,
    // and contain a .phan/config.php file with a Phan config for that project.
    // (including files to parse and analyze).
    // On windows, a project folder would be a path such as "C:\\Users\\MyUser\\path\\to\\analyzed\\folder"
    "phan.analyzedProjectDirectory": "/path/to/folder/to/analyze",

    // Path to a php 7.0+ binary (preferably with the php-ast PECL extension installed and enabled)
    // This should be as similar as possible as the php installation used to run Phan
    // (Same php minor version,
    //  same extensions or phan internal stubs for extensions (excluding xdebug), etc.)
    // On windows, this would be "C:\\path\\to\\php-7.0-installation\\php.exe"
    "phan.phpExecutablePath": "/path/to/php7.1",

    // Useful if you aren't already using another extension. Off by default.
    // for "Go To Definition" and "Go To Type Definition"
    "phan.enableGoToDefinition": true,

    // Enable unused variable detection
    // (off by default. This can also be enabled in `.phan/config.php`
    // by `"unused_variable_detection" => true,`)
    "phan.unusedVariableDetection": true,

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

## Release History

### 0.5.0 (2018-08-14)

- Update Phan from 0.12.15 to 1.0.1(dev)
- See [Phan's NEWS](https://github.com/phan/phan/blob/a4e9af8116f822a5efac1f729cfce8ba92b29e1e/NEWS.md) for more details.

### 0.4.3 (2018-07-21)

- Update Phan from 0.12.14 to 0.12.15
- Add `phan.enableHover` (disabled by default, may be slow)
- PHP 7.3.0alpha4 compatibility fixes
- See [Phan's NEWS](https://github.com/phan/phan/blob/0.12.15/NEWS.md) for more details.

The full changelog can be found at [NEWS.md](https://github.com/TysonAndre/vscode-php-phan/blob/master/NEWS.md)

## Troubleshooting

General troubleshooting advice:

- By setting `phan.enableDebugLog` to true (and restarting Phan), you can get extra debug output.
  Enabling debug output will slow down this extension.

- After any changes to the phan settings, the language server must be restarted.

- VSCode has a built in debugger at "Help" > "Toggle Developer Tools" ( "Console" tab)
  This will let you see this extension's Phan's debug output.

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
