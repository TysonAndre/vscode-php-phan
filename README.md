# PHP Phan (Analyzer)

[![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Installs](https://vsmarketplacebadge.apphb.com/installs/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/TysonAndre.php-phan.svg)](https://marketplace.visualstudio.com/items?itemName=TysonAndre.php-phan) [![Build Status](https://travis-ci.org/TysonAndre/vscode-php-phan.svg?branch=master)](https://travis-ci.org/TysonAndre/vscode-php-phan) [![Minimum PHP Version](https://img.shields.io/badge/php-%3E=7.2-8892BF.svg)](https://php.net/) [![Gitter](https://badges.gitter.im/phan/phan.svg)](https://gitter.im/phan/phan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

### 5.0.0 (2021-08-10)

- Update Phan from 4.0.7 to 5.1.0
- See [Phan's NEWS](https://github.com/phan/phan/blob/5.1.0/NEWS.md) for more details.

### 4.0.1 (2021-06-26)

- Update Phan from 4.0.4 to 4.0.7
- See [Phan's NEWS](https://github.com/phan/phan/blob/4.0.7/NEWS.md) for more details.

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
