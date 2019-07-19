# PHP Phan (Analyzer)

[![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Installs](https://vsmarketplacebadge.apphb.com/installs/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Build Status](https://travis-ci.org/TysonAndre/vscode-php-phan.svg?branch=master)](https://travis-ci.org/TysonAndre/vscode-php-phan) [![Minimum PHP Version](https://img.shields.io/badge/php-%3E=7.1-8892BF.svg)](https://php.net/) [![Gitter](https://badges.gitter.im/phan/phan.svg)](https://gitter.im/phan/phan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

**Supports Unix/Linux, and Windows.**

## Features

+ Adds improved [error detection from Phan](https://github.com/phan/phan#features) to Visual Studio Code.
+ Analyzes code while you're typing.
+ Supports "Go to definition" and "Go to type definition"
  (Has some bugs when `pcntl` is unavailable)
+ Supports code completion.
+ Analyzes code while tolerating syntax errors.

## Issue Tracker

**Note: This is just the [VS Code extension that spawns Phan](https://github.com/TysonAndre/vscode-php-phan). Phan is implemented purely in PHP [in its own repository](https://github.com/phan/phan),
bugs in Phan analysis need to be fixed there and all issues should be reported [there](https://github.com/phan/phan/issues).**

However, bugs in this VS code extension (crashes, etc) or related to the language server protocol should be reported [in this extension's issue tracker](https://github.com/TysonAndre/vscode-php-phan/issues)

## Installation

### Dependencies:

1. PHP 7.1+ must be installed.
   You can either add it to your PATH or set the `phan.executablePath` setting.
2. `pcntl` is recommended, but not absolutely necessary. (Available on Unix/Linux)
   (Phan's Language Server Protocol support depends on `pcntl` module being installed, which is only available on those platforms)

   When running the Phan server without `pcntl`,
   Phan manually backs up, analyzes the requested files, then restores the server's state instead of forking to analyze, which may less reliably restore state than running the analysis in an independent process.
3. (Optional) For optimal performance and accuracy of analysis,
   [the `php-ast` PECL extension](https://pecl.php.net/package/ast) should be installed and enabled.
4. For guidance on how to set up a Phan project, please see [phan/phan](https://github.com/phan/phan),
   and the article [Getting Started](https://github.com/phan/phan/wiki/Getting-Started).

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
    // On windows, a project folder would be a path such as
    // "C:\\Users\\MyUser\\path\\to\\analyzed\\folder"
    "phan.analyzedProjectDirectory": "/path/to/folder/to/analyze",

    // Path to a php 7.1+ binary
    // (preferably with the php-ast PECL extension installed and enabled)
    // This should be as similar as possible as the php installation used to run Phan
    // (Same php minor version,
    //  same extensions or phan internal stubs for extensions (excluding xdebug), etc.)
    // On windows, this would be "C:\\path\\to\\php-7.1-installation\\php.exe"
    "phan.phpExecutablePath": "/path/to/php7.1",

    // Optionally, enable unused variable detection
    // (off by default. This can also be enabled in `.phan/config.php`
    // by `"unused_variable_detection" => true,`)
    "phan.unusedVariableDetection": true,

    // Files which this should analyze (e.g. "php", "html", "inc")
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

Enabled by default. To disable this, set the setting `phan.useFallbackParser` to `false` (also requires disabling `phan.enableCompletion`)

### Go To Definition

+ Supports "Go to definition" for properties, classes, global/class constants, and methods/global functions
+ Supports "Go to type definition" for variables, properties, classes, and methods/global functions

This is enabled by default. To disable this, add `"phan.enableGoToDefinition": false` in your `config.json` settings.

### Hover

+ Supports hover text for generating descriptions of references to classes, properties, methods, constants, functions, etc.
+ Supports hover text for the union types of variables.

This is enabled by default. To disable this, add `"phan.enableHover": false` in your `config.json` settings.

### Completion

This will complete references to the following element types:

+ global constants, global functions, and class names.
+ class constants, and instance and static method names.
+ variables.
+ instance and static properties.

This is enabled by default. To disable this, add `"phan.enableCompletion": false` in your `config.json` settings.

See [VS Code's documentation of Intellisense](https://code.visualstudio.com/docs/editor/intellisense#_intellisense-features) for how completions work in general.

See [VS Code's documentation of IntelliSense configuration](https://code.visualstudio.com/docs/editor/intellisense#_customizing-intellisense)
for how to control when/how suggestions show up.

You may want to disable VS Code's built-in IntelliSense for PHP by setting `php.suggest.basic` to `false`, to avoid duplicate suggestions.

## Contributing

## Release History

### 1.1.1 (2019-07-14)

- Update Phan from 2.2.4 to 2.2.5
- See [Phan's NEWS](https://github.com/phan/phan/blob/2.2.5/NEWS.md) for more details.

### 1.1.0 (2019-07-01)

- Support redundant/impossible condition detection. (Disabled by default. This can be enabled by `phan.redundantConditionDetection`)
- Update Phan from 2.1.0 to 2.2.4
- See [Phan's NEWS](https://github.com/phan/phan/blob/2.2.4/NEWS.md) for more details.

### 1.0.0 (2019-06-02)

- **Increase the minimum php version requirement (`phan.phpExecutablePath`) for running the server to 7.1+** (Phan supports `--target-php-version` to specify the version of the code being analyzed)

  Increase the minimum `php-ast` version requirement to 1.0.1+ (if that extension is installed)

  The VS code extension version can be [downgraded to 0.8.6](https://code.visualstudio.com/updates/v1_30#_install-previous-versions) if you are unable to install a newer php or php-ast version.
- Update Phan from 1.3.2 to 2.1.0
- See [Phan's NEWS](https://github.com/phan/phan/blob/2.1.0/NEWS.md) for more details.

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
