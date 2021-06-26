# PHP Phan (Analyzer)

[![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Installs](https://vsmarketplacebadge.apphb.com/installs/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Build Status](https://travis-ci.org/TysonAndre/vscode-php-phan.svg?branch=master)](https://travis-ci.org/TysonAndre/vscode-php-phan) [![Minimum PHP Version](https://img.shields.io/badge/php-%3E=7.2-8892BF.svg)](https://php.net/) [![Gitter](https://badges.gitter.im/phan/phan.svg)](https://gitter.im/phan/phan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

**Supports Unix/Linux, and Windows.**

## Features

+ Adds improved [error detection from Phan](https://github.com/phan/phan#features) to Visual Studio Code.
+ Analyzes code while you're typing.
+ Supports "Go to definition" and "Go to type definition"
  (Has some bugs when `pcntl` is unavailable)
+ Supports code completion.
+ Analyzes code while tolerating syntax errors.
+ Suggests alternatives to mistyped elements (variables, constants, classes, class elements, etc.)

## Issue Tracker

**Note: This is just the [VS Code extension that spawns Phan](https://github.com/TysonAndre/vscode-php-phan). Phan is implemented purely in PHP [in its own repository](https://github.com/phan/phan),
bugs in Phan analysis need to be fixed there and all issues should be reported [there](https://github.com/phan/phan/issues).**

However, bugs in this VS code extension (crashes, etc) or related to the language server protocol should be reported [in this extension's issue tracker](https://github.com/TysonAndre/vscode-php-phan/issues)

## Installation

### Dependencies:

1. PHP 7.2+ must be installed.
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

    // Limit events sent to the language server to those within `phan.analyzedProjectDirectory`
    // where possible.
    // Useful when multiple directories are analyzed (e.g. fixes issues with hover flickering).
    // "phan.useRelativePatterns": true,

    // Path to a php 7.2+ binary
    // (preferably with the php-ast PECL extension installed and enabled)
    // This should be as similar as possible as the php installation used to run Phan
    // (Same php minor version,
    //  same extensions or phan internal stubs for extensions (excluding xdebug), etc.)
    // On windows, this would be "C:\\path\\to\\php-7.2-installation\\php.exe"
    "phan.phpExecutablePath": "/path/to/php7.2",

    // Optionally, enable unused variable detection
    // (off by default. This can also be enabled in `.phan/config.php`
    // by `"unused_variable_detection" => true,`)
    "phan.unusedVariableDetection": true,

    // Files which this should analyze (e.g. "php", "html", "inc")
    "phan.analyzedFileExtensions": ["php"],

    // Optional. Setting this will provide these additional CLI flags to the Phan server.
    // See https://github.com/phan/phan#usage (e.g. `["--quick"]`)
    // "phan.additionalCLIFlags": []
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

If hovering flickers (with or without showing hover text), increasing the hover delay may fix this (e.g. set it to `"editor.hover.delay": 2000`)
Also, make sure that the setting `"phan.useRelativePatterns"` is `true` (this is the default), if multiple directories are in `phan.analyzedProjectDirectory`.

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

### 4.0.1 (2021-06-26)

- Update Phan from 4.0.4 to 4.0.7

### 4.0.0 (2021-04-17)

- Prevent the settings `phan.phpExecutablePath`, `phan.phanScriptPath`, `phan.analyzedProjectDirectory`, `phan.additionalCLIFlags`, and `phan.connectToServerWithStdio` from being overridden in VS Code workspace or folder settings. (i.e. configure them with `"scope": "machine"` for https://github.com/microsoft/vscode/blob/1.55.2/src/vs/workbench/api/common/configurationExtensionPoint.ts#L50-L55) (CVE-2021-31416)
  (checking in connectToServerWithStdio in workplace settings is harmless but may break the workflows of other developers working on different machines.)
  (vscode-php-phan is only intended for use with projects that a developer has manually trusted and enabled through analyzedProjectDirectory, although more convenient ways to securely trust php projects may be added in the future (e.g. using Memento). This is because phan allows executable paths or executable PHP code in third party plugins and InvokePHPNativeSyntaxCheckPlugin, as well as phan config files and due to certain CLI flags and config settings.)

  The VS code extension version can be [downgraded to 3.0.0](https://code.visualstudio.com/updates/v1_30#_install-previous-versions) if you rely on the ability to set those workspace settings.
- Update Phan from 4.0.2 to 4.0.4
- See [Phan's NEWS](https://github.com/phan/phan/blob/4.0.4/NEWS.md) for more details.

### 3.0.0 (2021-01-09)

- Increase the minimum php-ast version to 1.0.7+ if php-ast is installed.
  The VS code extension version can be [downgraded to 2.2.0](https://code.visualstudio.com/updates/v1_30#_install-previous-versions) if you are unable to install/use a newer php-ast or Phan version.
- Update Phan from 3.2.7 to 4.0.2
- See [Phan's NEWS](https://github.com/phan/phan/blob/4.0.2/NEWS.md) for more details.

### 2.2.0 (2020-12-13)

- Update Phan from 3.2.3 to 3.2.7
- See [Phan's NEWS](https://github.com/phan/phan/blob/3.2.7/NEWS.md) for more details.

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

Local changes can also be run locally by checking out [vscode-php-phan](https://github.com/TysonAndre/vscode-php-phan), running `npm install`, then running your changes in an Extension Development Host with <F5>. See https://code.visualstudio.com/api/get-started/your-first-extension for more details.

## Credits

This VS Code extension and many parts of the language server protocol implementation are based on [PHP IntelliSense](https://github.com/felixfbecker/vscode-php-intellisense)

This uses [Phan](https://github.com/phan/phan)
