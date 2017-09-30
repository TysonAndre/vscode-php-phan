# PHP Phan Integration

Based on [PHP IntelliSense](https://github.com/felixfbecker/vscode-php-intellisense)

This adds error detection from phan to the features provided by "PHP Intellisense".

**Note: This is just the VS Code extension that spawns Phan. Phan is implemented purely in PHP [in its own repository](https://github.com/TysonAndre/phan), all features need to be implemented there and all issues should be reported there.**

(Changes are not yet released)

## Installation

You need at least PHP 7 installed for the extension to work. You can either add it to your PATH or set the `php.executablePath` setting.

I recommend to disable VS Code's built-in PHP IntelliSense by setting `php.suggest.basic` to `false` to avoid duplicate suggestions.

## Features

### Error Detection
TODO

## Contributing

Clone whole repository and in root directory execute:

```bash
composer install
npm install
npm run build
code .
```

The last command will open the folder in VS Code. Hit `F5` to launch an Extension Development Host with the extension.
For working on the language server, the easiest way is to replace the language server installation from composer in `vendor/felixfbecker/language-server` with a symlink to your local clone.

**For guidance on how to set up a Phan project, please see [phan/phan](https://github.com/phan/phan).**
