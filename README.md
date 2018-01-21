# PHP Phan (Analyzer)

[![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Installs](https://vsmarketplacebadge.apphb.com/installs/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Build Status](https://travis-ci.org/TysonAndre/vscode-php-phan.svg?branch=master)](https://travis-ci.org/TysonAndre/vscode-php-phan) [![Minimum PHP Version](https://img.shields.io/badge/php-%3E=7.1-8892BF.svg)](https://php.net/) [![Gitter](https://badges.gitter.im/phan/phan.svg)](https://gitter.im/phan/phan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

**Supports Unix/Linux.**

## Features

+ Adds improved [error detection from Phan](https://github.com/phan/phan#features) to Visual Studio Code.
+ Analyze code while you're typing.
+ Optionally analyze code with syntax errors.

## Issue Tracker

**Note: This is just the [VS Code extension that spawns Phan](https://github.com/TysonAndre/vscode-php-phan). Phan is implemented purely in PHP [in its own repository](https://github.com/phan/phan),
bugs in Phan analysis need to be implemented there and all issues should be reported [there](https://github.com/phan/phan/issues).**

However, bugs in this VS code extension (crashes, etc) or related to the language server protocol should be reported [in this extension's issue tracker](https://github.com/TysonAndre/vscode-php-phan/issues)

## Installation

### Dependencies:

1. PHP 7.1+ must be installed.
   You can either add it to your PATH or set the `phan.executablePath` setting.
2. Your Operating System must be Unix/Linux
   (Phan support depends on `pcntl` module being installed, which is only available on those platforms)

   A future release may support Windows, but it won't be as fast.
3. [The `php-ast` PECL extension](https://pecl.php.net/package/ast) must be installed and enabled.
4. Depends on using a checkout of Phan with https://github.com/phan/phan/pull/1144 installed


### Installing from source

This extension hasn't been published yet. It can be installed locally with the following method:

```bash
npm install
npm run build
node node_modules/.bin/vsce package
```

The generated VSIX file can be used locally with the steps from https://stackoverflow.com/a/38866913

### Setup steps

This assumes you have already installed the [dependencies](#dependencies).

Add these entries to your VSCode config (Open the menu at File > Preferences > Settings)


```
{
    // Currently, this extension is limited to analyzing only a single folder.
    // The config value must be the root of the project,
    // and contain a .phan/config.php file with a Phan config for that project
    // (including files to parse and analyze).
    "phan.analyzedProjectDirectory": "/path/to/folder/to/analyze",

    // Path to a php 7.1 binary with the php-ast PECL extension installed and enabled
    "phan.phpExecutablePath": "/path/to/php7.1",

    // Files which this should analyze
    "phan.analyzedFileExtensions": ["php"]
}
```

**After adding these entries, close and re-open Visual Studio Code in order for Phan to pick up the new settings.**

## Examples

### Error Detection

![Phan error detection demo](https://raw.githubusercontent.com/TysonAndre/vscode-php-phan/master/images/error_detection.png)

Phan's capabilities are summarized in [Phan's README](https://github.com/phan/phan#features)

### Error Detection (Tolerating Syntax Errors)

![Phan error tolerant detection demo](https://raw.githubusercontent.com/TysonAndre/vscode-php-phan/master/images/tolerant_parsing.png)

Optional, enabled by the setting `phan.useFallbackParser`


## Contributing

Clone whole repository and in root directory execute:

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

```json
{
    "phan.phanScriptPath": "/path/to/folder/phan_git_checkout/phan"
}
```

**For guidance on how to set up a Phan project, please see [phan/phan](https://github.com/phan/phan).**

## Release History

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

## Credits

This VS Code extension and many parts of the language server protocol implementation are based on [PHP IntelliSense](https://github.com/felixfbecker/vscode-php-intellisense)

This uses [Phan](https://github.com/phan/phan)
