vscode-php-phan NEWS
====================

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

  The VS code extension version can be [downgraded to 3.0.0](https://code.visualstudio.com/updates/v1_30#_install-previous-versions) if you rely on those workspace settings.
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

### 2.1.0 (2020-10-24)

- Update Phan from 3.0.5 to 3.2.3
- See [Phan's NEWS](https://github.com/phan/phan/blob/3.2.3/NEWS.md) for more details.

### 2.0.1 (2020-07-15)

- Update Phan from 3.0.2 to 3.0.5
- See [Phan's NEWS](https://github.com/phan/phan/blob/3.0.5/NEWS.md) for more details.

### 2.0.0 (2020-06-10)

- Bump the minimum required php version from 7.1 to 7.2 (because of the Phan version update)

  The VS code extension version can be [downgraded to 1.2.4](https://code.visualstudio.com/updates/v1_30#_install-previous-versions) if you are unable to install a newer php version.
- Update Phan from 2.7.0 to 3.0.2
- See [Phan's NEWS](https://github.com/phan/phan/blob/3.0.2/NEWS.md) for more details.

### 1.2.4 (2020-04-06)

- Update Phan from 2.6.1 to 2.7.0
- See [Phan's NEWS](https://github.com/phan/phan/blob/2.7.0/NEWS.md) for more details.
- Disable `phan.useRelativePatterns` by default.

### 1.2.3 (2020-03-28)

- Update Phan from 2.5.0 to 2.6.1
- See [Phan's NEWS](https://github.com/phan/phan/blob/2.6.1/NEWS.md) for more details.
- By default, limit language client to sending events to files in the corresponding
  `phan.analyzedProjectDirectory` to the language server(s).

  This may improve performance and avoid flickering of hover text when there is more than one directory in `phan.analyzedProjectDirectory`

  `phan.useRelativePatterns` can be set to `false` to disable this if needed
  (e.g. if a phan config also analyzes files outside of the directory containing `./.phan/`)

### 1.2.2 (2020-02-29)

- Update Phan from 2.4.6 to 2.5.0
- See [Phan's NEWS](https://github.com/phan/phan/blob/2.5.0/NEWS.md) for more details.

### 1.2.1 (2020-01-01)

- Update Phan from 2.3.1 to 2.4.6
- See [Phan's NEWS](https://github.com/phan/phan/blob/2.4.6/NEWS.md) for more details.

### 1.2.0 (2019-10-20)

- Update Phan from 2.2.12 to 2.3.1
- See [Phan's NEWS](https://github.com/phan/phan/blob/2.3.1/NEWS.md) for more details.
- Exclude more files from the generated package.

### 1.1.4 (2019-09-12)

- Update Phan from 2.2.10 to 2.2.12
- See [Phan's NEWS](https://github.com/phan/phan/blob/2.2.12/NEWS.md) for more details.

### 1.1.3 (2019-08-12)

- Update Phan from 2.2.9 to 2.2.10
- See [Phan's NEWS](https://github.com/phan/phan/blob/2.2.10/NEWS.md) for more details.

### 1.1.2 (2019-08-11)

- Update Phan from 2.2.5 to 2.2.9
- See [Phan's NEWS](https://github.com/phan/phan/blob/2.2.9/NEWS.md) for more details.

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

### 0.8.6 (2019-04-28)

- Update Phan from 1.2.8(dev) to 1.3.2
- See [Phan's NEWS](https://github.com/phan/phan/blob/1.3.2/NEWS.md) for more details.

### 0.8.5 (2019-04-01)

- Update Phan from 1.2.6(dev) to 1.2.8(dev)
- See [Phan's NEWS](https://github.com/phan/phan/blob/152cba796a0d9c09c9ab158e13c36a55d3a31876/NEWS.md) for more details.

### 0.8.4 (2019-03-02)

- Update Phan from 1.2.3(dev) to 1.2.6(dev)
- See [Phan's NEWS](https://github.com/phan/phan/blob/e6eb05cd368081dc0058243173ac44c1d54cf724/NEWS.md) for more details.

### 0.8.3 (2019-02-19)

- Update Phan from 1.2.1(dev) to 1.2.3(dev)
- See [Phan's NEWS](https://github.com/phan/phan/blob/d39b26e8a7a54cc430cafc2cba3e56493b8c5466/NEWS.md) for more details.
- Change the way the document filter for this extension is set up to properly be by file extension.

### 0.8.2 (2019-01-21)

- Make code completion work more consistently after typing `::` or `->`.
- Other minor improvements to the language server. See [Phan's NEWS](https://github.com/phan/phan/blob/ec9d0c1b34894224194c1791345fdc5af7b696d4/NEWS.md) for more details.

### 0.8.1 (2019-01-14)

- Enable Code completion support by default. To disable it, set `phan.enableCompletion` to `false`.

  Also see [VS Code's documentation for IntelliSense](https://code.visualstudio.com/docs/editor/intellisense#_customizing-intellisense)
  for how to control when/how suggestions show up.
- Show type signatures in hover text for internal functions/methods.

  Also use PHPDoc when rendering type signatures for user-defined functions/methods.
- Fix variable completion of `$` followed by nothing
- See [Phan's NEWS](https://github.com/phan/phan/blob/a276d601436cc94c62578b3ddad0a88540966ae4/NEWS.md) for more details.

### 0.8.0 (2019-01-12)

- Enable Code completion support by default. To disable it, set `phan.enableCompletion` to `false`.

  Also see [VS Code's documentation for IntelliSense](https://code.visualstudio.com/docs/editor/intellisense#_customizing-intellisense)
  for how to control when/how suggestions show up.
- Enable error tolerant parsing by default.
- Enable the fallback parser by default (required by code completion)
- Fix a bug in code completion for variables and static properties.
- Update Phan from 1.2.0 to 1.2.1 (dev).
- See [Phan's NEWS](https://github.com/phan/phan/blob/9fd40ca04d49888b51de5dc8045a92789fcd3feb/NEWS.md) for more details.

### 0.7.0 (2019-01-05)

- Update Phan from 1.1.8 to 1.2.0
- See [Phan's NEWS](https://github.com/phan/phan/blob/1.2.0/NEWS.md) for more details.

### 0.6.4 (2018-12-15)

- Update Phan from 1.1.5 to 1.1.8
- See [Phan's NEWS](https://github.com/phan/phan/blob/1.1.8/NEWS.md) for more details.

### 0.6.3 (2018-11-29)

- Update Phan from 1.1.2 to 1.1.5
- Fix a bug in the language server causing it to fail when `pcntl` was unavailable (e.g. on Windows)
- See [Phan's NEWS](https://github.com/phan/phan/blob/1.1.5/NEWS.md) for more details.

### 0.6.2 (2018-11-05)

- Update Phan from 1.1.1 to 1.1.2
- See [Phan's NEWS](https://github.com/phan/phan/blob/1.1.2/NEWS.md) for more details.

### 0.6.1 (2018-10-28)

- Update Phan from 1.1.0 to 1.1.1
- Fix a bug in the language server causing it to never use `pcntl` even when available.
  If this change causes issues, enabling `phan.forceMissingPcntl` is a workaround.
- Detect more issue types.
- See [Phan's NEWS](https://github.com/phan/phan/blob/1.1.1/NEWS.md) for more details.

### 0.6.0 (2018-10-09)

- Update Phan from 1.0.5 to 1.1.0
- Add support for code completion (disabled by default)
- See [Phan's NEWS](https://github.com/phan/phan/blob/1.1.0/NEWS.md) for more details.

### 0.5.4 (2018-09-21)

- Update Phan from 1.0.4 to 1.0.5
- See [Phan's NEWS](https://github.com/phan/phan/blob/1.0.5/NEWS.md) for more details.

### 0.5.3 (2018-09-10)

- Update Phan from 1.0.3 to 1.0.4
- Add hover text for variables.
- Improve generating hover summaries from phpdoc.
- Enable hover descriptions and "Go to Definition" support by default.
  (Controlled by `phan.enableGoToDefinition` and `phan.enableHover`)
- See [Phan's NEWS](https://github.com/phan/phan/blob/1.0.4/NEWS.md) for more details.

### 0.5.2 (2018-09-08)

- Update Phan from 1.0.1 to 1.0.3
- See [Phan's NEWS](https://github.com/phan/phan/blob/1.0.3/NEWS.md) for more details.

### 0.5.1 (2018-08-28)

- Update Phan from 1.0.1(dev) to 1.0.1
- See [Phan's NEWS](https://github.com/phan/phan/blob/1.0.1/NEWS.md) for more details.

### 0.5.0 (2018-08-14)

- Update Phan from 0.12.15 to 1.0.1(dev)
- See [Phan's NEWS](https://github.com/phan/phan/blob/a4e9af8116f822a5efac1f729cfce8ba92b29e1e/NEWS.md) for more details.

### 0.4.3 (2018-07-21)

- Update Phan from 0.12.14 to 0.12.15
- Add `phan.enableHover` (disabled by default, may be slow)
- PHP 7.3.0alpha4 compatibility fixes
- See [Phan's NEWS](https://github.com/phan/phan/blob/0.12.15/NEWS.md) for more details.

### 0.4.2 (2018-07-08)

- Update Phan from 0.12.14(dev) to 0.12.14
- Add new features and bug fixes. See [Phan's NEWS](https://github.com/phan/phan/blob/0.12.14/NEWS.md) for more details.
- Support "go to definition" for class names within code comments.

### 0.4.1 (2018-06-17)

- Update Phan from 0.12.13(dev) to 0.12.14(dev)
- Add support for int/string literal union types (in phpdoc and Phan's internal representation)
- Fix more crashes when parsing invalid ASTs, detect a few more issue types.
- See [Phan's NEWS](https://github.com/phan/phan/blob/c70efbe41ba9d5eae9e51bab01e13120b0c3f3c4/NEWS.md) for more details.

### 0.4.0 (2018-06-10)

- Support passing an array of project paths to `phan.analyzedProjectDirectory` to run multiple independent language servers.
- Increase minimum vscode version to 1.20.0 to fix `npm run build` issue (typescript warning)

### 0.3.9 (2018-06-10)

- Upgrade Phan from 0.12.11(dev) to 0.12.13(dev)
- Fix some crashes when parsing invalid ASTs, detect a few more issue types
- See [Phan's NEWS](https://github.com/phan/phan/blob/358d5641e26af21c00180fdd9d7d202913e831ca/NEWS.md) for more details.

### 0.3.8 (2018-05-29)

- Improve reliability of this extension when `pcntl` is unavailable (e.g. on Windows)
- Upgrade Phan from 0.12.10 to 0.12.11(dev)

### 0.3.7 (2018-05-27)

- Support unused variable detection. (Disabled by default. This can be enabled by `phan.unusedVariableDetection`)
- Upgrade Phan from 0.12.9 to 0.12.10.
- See [Phan's NEWS](https://github.com/phan/phan/blob/0.12.10/NEWS.md) for more details.

### 0.3.6 (2018-05-22)

- Add `@phan-suppress-current-line` and `@phan-suppress-next-line` to suppress issues on individual lines of a file.
- Allow `@phan-file-suppress` to occur anywhere as a comment or doc comment
- Make all of Phan's suppression annotations accept comma separated lists of 1 or more issues, instead of just one list.
  (E.g. for when a group of issues have the same cause).
- Upgrade Phan from 0.12.9(dev) to 0.12.9
- See [Phan's NEWS](https://github.com/phan/phan/blob/0.12.9/NEWS.md) for more details.

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

