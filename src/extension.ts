import * as path from 'path';
import { spawn, execFile, ChildProcess } from 'mz/child_process';
import * as vscode from 'vscode';
import { DocumentFilter, RelativePattern } from 'vscode';
import { LanguageClient, LanguageClientOptions, StreamInfo } from 'vscode-languageclient';
import * as semver from 'semver';
import * as net from 'net';
import * as url from 'url';
import * as fs from 'fs';

async function showErrorMessage(message: string, ...items: string[]): Promise<string | undefined> {
    console.log(`Calling vscode.window.showErrorMessage ${message}`, items);
    return vscode.window.showErrorMessage(message, ...items);
}

// Shows the provided error message as well as a prompt to open the settings page to fix the error.
async function showOpenSettingsPrompt(errorMessage: string): Promise<void> {
    const selected = await showErrorMessage(
        errorMessage,
        'Open settings'
    );
    if (selected === 'Open settings') {
        await vscode.commands.executeCommand('workbench.action.openGlobalSettings');
    }
}

// Returns true if phan.phpExecutablePath is 7.2.0 or newer, and return false if it isn't (or php can't be found)
async function checkPHPVersion(context: vscode.ExtensionContext, phpExecutablePath: string): Promise<boolean> {
    // Check path (if PHP is available and version is ^7.2.0)
    let stdout: string;
    try {
        [stdout] = await execFile(phpExecutablePath, ['--version']);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await showOpenSettingsPrompt('PHP executable not found. Install PHP 7.2+ and add it to your PATH or set the phan.phpExecutablePath setting. Current PHP Path: ' + phpExecutablePath);
        } else {
            await showErrorMessage('Error spawning PHP: ' + err.message);
            console.error(err);
        }
        return false;
    }

    // Parse version and discard OS info like 7.2.8--0ubuntu0.16.04.2
    const match = stdout.match(/^PHP ([^\s]+)/m);
    if (!match) {
        await showErrorMessage('Error parsing PHP version. Please check the output of php --version. PHP Path: ' + phpExecutablePath);
        return false;
    }
    let version = match[1].split('-')[0];
    // Convert PHP prerelease format such as 7.3.0rc1 to 7.3.0-rc1
    if (!/^\d+.\d+.\d+$/.test(version)) {
        version = version.replace(/(\d+.\d+.\d+)/, '$1-');
    }
    if (semver.lt(version, '7.2.0')) {
        await showErrorMessage('Phan 4.x needs at least PHP 7.2 installed. Version found: ' + version + ' PHP Path: ' + phpExecutablePath);
        return false;
    }
    return true;
}

// If php-ast is installed but is an unsupported version (or php couldn't run), then open an error message window and return false.
// Returns true on success.
async function checkPHPAstInstalledAndSupported(context: vscode.ExtensionContext, phpExecutablePath: string, allowPolyfillParser: boolean): Promise<boolean> {
    let stdout = '';
    try {
        [stdout] = await execFile(phpExecutablePath, ['-r', 'if (extension_loaded("ast")) { echo "ext-ast " . (new ReflectionExtension("ast"))->getVersion(); } else { echo "None"; }']);
    } catch (err) {
        await showErrorMessage('Error spawning PHP to determine php-ast VERSION: ' + err.message + ' PHP Path: ' + phpExecutablePath);
        console.error(err);
        return false;
    }

    if (stdout.match(/^None/)) {
        if (allowPolyfillParser) {
            // Phan will probably use the polyfill parser based on tolerant-php-parser.
            return true;
        }
        await showErrorMessage('php-ast is not installed or not enabled. php-ast 1.0.1 or newer must be installed (1.0.7+ recommended). PHP Path: ' + phpExecutablePath);
        return false;
    }

    // Parse version of php-ast
    const astMatch = stdout.match(/^ext-ast ([^\s]+)/m);
    if (!astMatch) {
        await showErrorMessage('Error parsing php-ast module version. Please check the output of `if (extension_loaded("ast")) { echo "ext-ast " . (new ReflectionExtension("ast"))->getVersion(); } else { echo "None"; }`. PHP Path: ' + phpExecutablePath);
        return false;
    }
    let astVersion = astMatch[1].split('-')[0];
    // Convert PHP prerelease format such as 7.3.0rc1 to 7.3.0-rc1
    if (!/^\d+.\d+.\d+$/.test(astVersion)) {
        astVersion = astVersion.replace(/(\d+.\d+.\d+)/, '$1-');
    }
    if (semver.lt(astVersion, '1.0.7')) {
        await showErrorMessage('Phan 4.x needs at least ext-ast 1.0.7 installed. Version found: ' + astVersion + ' PHP Path: ' + phpExecutablePath);
        return false;
    }
    return true;
}

// Open an error message window and return false if the `pcntl` extension isn't enabled.
// This is only called if this VS Code extension's configuration requires that pcntl be enabled.
async function checkPHPPcntlInstalled(context: vscode.ExtensionContext, phpExecutablePath: string): Promise<boolean> {
    let stdout = '';
    try {
        [stdout] = await execFile(phpExecutablePath, ['-r', 'var_export(extension_loaded("pcntl"));']);
    } catch (err) {
        await showErrorMessage('Error spawning PHP to determine if pcntl is installed: ' + err.message + ' PHP path: ' + phpExecutablePath);
        console.error(err);
        return false;
    }

    if (!stdout.match(/^true/)) {
        await showErrorMessage('pcntl(PHP module) is not installed or not enabled. Either install and enable pcntl (impossible on Windows), or enable phan.allowMissingPcntl. PHP Path: ' + phpExecutablePath);
        return false;
    }
    return true;
}

function isFile(path: string): boolean {
    try {
        const stat = fs.statSync(path);
        return stat.isFile();
    } catch (e) {
        return false;
    }
}

function isDirectory(path: string): boolean {
    try {
        const stat = fs.statSync(path);
        return stat.isDirectory();
    } catch (e) {
        return false;
    }
}

// Returns true if phan.phanScriptPath supports the language server protocol.
async function checkPhanSupportsLanguageServer(context: vscode.ExtensionContext, phpExecutablePath: string, phanScriptPath: string): Promise<boolean> {
    const exists: boolean = isFile(phanScriptPath);

    if (!exists) {
        await showOpenSettingsPrompt('The setting phan.phanScriptPath refers to a path that does not exist. path: ' + phanScriptPath);
        return false;
    }

    let stdout = '';
    try {
        [stdout] = await execFile(phpExecutablePath, [phanScriptPath, '--extended-help']);
    } catch (err) {
        await showErrorMessage('Error spawning Phan to check for language server support: ' + err.message);
        console.error(err);
        return false;
    }

    // Check if phan --help indicates language server support
    const match = stdout.match(/language-server/m);
    if (!match) {
        await showErrorMessage('Language server support was not detected. Please check the output of /path/to/phan --help. phan path: ' + phanScriptPath);
        return false;
    }
    return true;
}

// Returns true if phan.phanScriptPath supports the language server protocol.
async function checkValidAnalyzedProjectDirectory(context: vscode.ExtensionContext, analyzedProjectDirectory: string): Promise<boolean> {
    if (!isDirectory(analyzedProjectDirectory)) {
        await showOpenSettingsPrompt('The setting phan.analyzedProjectDirectory refers to a directory that does not exist. directory: ' + analyzedProjectDirectory);
        return false;
    }

    if (!pathContainsPhanFolderAndConfig(analyzedProjectDirectory)) {
        await showOpenSettingsPrompt('The setting phan.analyzedProjectDirectory refers to a directory that does not contain .phan/config.php. Check that it is the absolute path of the root of a project set up for phan. directory: ' + analyzedProjectDirectory);
        return false;
    }
    return true;
}

// Converts the directory to analyze to an array of directories, if necessary.
function normalizeDirsToAnalyze(conf: string|string[]|undefined): string[] {
    if (!conf) {
        return [];
    }
    if (conf instanceof Array) {
        return conf;
    }
    return [conf];
}

/**
 * Activates this extension, starting the language server for the directories
 * after verifying the configuration and dependencies.
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {

    const conf = vscode.workspace.getConfiguration('phan');
    const phpExecutablePath = conf.get<string>('phpExecutablePath') || 'php';
    const defaultPhanScriptPath = context.asAbsolutePath(path.join('vendor', 'phan', 'phan', 'phan'));
    const phanScriptPath = conf.get<string>('phanScriptPath') || defaultPhanScriptPath;
    // Support analyzing more than one project the simplest way (always start every server).
    const originalAnalyzedProjectDirectories = conf.get<string|string[]>('analyzedProjectDirectory');
    let analyzedProjectDirectories = normalizeDirsToAnalyze(originalAnalyzedProjectDirectories);
    const enableDebugLog = conf.get<boolean>('enableDebugLog');
    const analyzeOnlyOnSave = conf.get<boolean>('analyzeOnlyOnSave');
    const allowPolyfillParser = conf.get<boolean>('allowPolyfillParser') || false;
    const memoryLimit = conf.get<string>('memoryLimit') || null;
    const connectToServerWithStdio = conf.get<boolean>('connectToServerWithStdio');
    const additionalCLIFlags = conf.get<string[]>('additionalCLIFlags') || [];
    const forceMissingPcntl = conf.get<boolean>('forceMissingPcntl') || false;
    const enableGoToDefinition = conf.get<boolean>('enableGoToDefinition') || false;
    const enableHover = conf.get<boolean>('enableHover') || false;
    const enableCompletion = conf.get<boolean>('enableCompletion') || false;
    // completion requires the fallback parser to work properly
    const useFallbackParser = conf.get<boolean>('useFallbackParser') || enableCompletion;
    const allowMissingPcntl = conf.get<boolean>('allowMissingPcntl') || forceMissingPcntl;
    const quick = conf.get<boolean>('quick');
    const unusedVariableDetection = conf.get<boolean>('unusedVariableDetection');
    const redundantConditionDetection = conf.get<boolean>('redundantConditionDetection');
    const analyzedFileExtensions: string[] = conf.get<string[]>('analyzedFileExtensions') || ['php'];
    const useRelativePatterns = conf.get<boolean>('useRelativePatterns');

    const isValidPHPVersion: boolean = await checkPHPVersion(context, phpExecutablePath);
    if (!isValidPHPVersion) {
        return;
    }

    // Check if php-ast is installed
    const isPHPASTInstalled: boolean = await checkPHPAstInstalledAndSupported(context, phpExecutablePath, allowPolyfillParser);
    if (!isPHPASTInstalled) {
        return;
    }

    if (!(allowMissingPcntl || forceMissingPcntl)) {
        // Check if pcntl is installed
        const isPHPPcntlInstalled: boolean = await checkPHPPcntlInstalled(context, phpExecutablePath);
        if (!isPHPPcntlInstalled) {
            return;
        }
    }

    // Check if the phanScriptPath setting was provided.
    if (!phanScriptPath) {
        await showOpenSettingsPrompt('The setting phan.phanScriptPath must be provided (e.g. /path/to/vendor/phan/phan/phan)');
        return;
    }
    // Check if phan is installed and supports the language server protocol.
    const isValidPhanVersion: boolean = await checkPhanSupportsLanguageServer(context, phpExecutablePath, phanScriptPath);
    if (!isValidPhanVersion) {
        return;
    }
    const phanScriptPathValidated = phanScriptPath;  // work around typescript complaint.

    // Check if the analyzedProjectDirectories setting was provided.
    if (!analyzedProjectDirectories.length) {
        analyzedProjectDirectories = findValidProjectDirectories();

        if (!analyzedProjectDirectories.length) {
            // Do not send an error to the interface, this is frustrating.
            const cantFindWorkspaceDirectoryMessage =
            'No workspace directory contain a folder named ".phan" with a config.php file. ' +
            'You can add custom directories via phan.analyzedProjectDirectories setting.';
            console.warn(cantFindWorkspaceDirectoryMessage);
            return;
        }
    }

    for (const dir of analyzedProjectDirectories) {
        const isValidProjectDirectory: boolean = await checkValidAnalyzedProjectDirectory(
            context,
            dir
        );
        if (!isValidProjectDirectory) {
            return;
        }
    }

    const serverOptionsCallbackForDirectory = (dirToAnalyze: string) => (() => new Promise<ChildProcess | StreamInfo>((resolve) => {
        // Listen on random port
        const spawnServer = (...args: string[]): ChildProcess => {
            if (additionalCLIFlags.length > 0) {
                args.unshift(...additionalCLIFlags);
            }
            // Aside: Max setting is 4095M
            if (memoryLimit && memoryLimit.length > 0) {
                args.unshift('--memory-limit', memoryLimit);
            }
            if (useFallbackParser) {
                // php phan --use-fallback-parser ...
                args.unshift('--use-fallback-parser');
            }
            if (analyzeOnlyOnSave) {
                // php phan --language-server-analyze-only-on-save ...
                args.unshift('--language-server-analyze-only-on-save');
            }
            if (enableGoToDefinition) {
                // php phan --language-server-enable-go-to-definition
                args.unshift('--language-server-enable-go-to-definition');
            } else {
                args.unshift('--language-server-disable-go-to-definition');
            }
            if (enableHover) {
                // php phan --language-server-enable-hover
                args.unshift('--language-server-enable-hover');
            } else {
                args.unshift('--language-server-disable-hover');
            }
            if (enableCompletion) {
                args.unshift('--language-server-enable-completion');
                args.unshift('--language-server-completion-vscode');
            } else {
                args.unshift('--language-server-disable-completion');
            }
            if (allowPolyfillParser) {
                // php phan --allow-polyfill-parser ...
                args.unshift('--allow-polyfill-parser');
            }
            if (forceMissingPcntl) {
                args.unshift('--language-server-force-missing-pcntl');
            } else if (allowMissingPcntl) {
                args.unshift('--language-server-allow-missing-pcntl');
            }
            if (enableDebugLog) {
                // php phan --language-server-verbose ...
                args.unshift('--language-server-verbose');
            }
            if (quick) {
                // php phan --quick ...
                args.unshift('--quick');
            }
            if (unusedVariableDetection) {
                // php phan ----unused-variable-detection ...
                args.unshift('--unused-variable-detection');
            }
            if (redundantConditionDetection) {
                args.unshift('--redundant-condition-detection');
            }

            // The server is implemented in PHP
            args.unshift(phanScriptPathValidated);
            console.log('starting Phan Language Server in ' + dirToAnalyze, phpExecutablePath, args);
            // Phan searches for .phan/config.php within dirToAnalyze,
            // and bases the settings on that.
            // TODO: add mode which will determine path from current working directory
            const childProcess = spawn(phpExecutablePath, args, {cwd: dirToAnalyze});
            childProcess.stderr.on('data', (chunk: Buffer) => {
                console.error(chunk + '');
            });
            if (enableDebugLog) {
                childProcess.stdout.on('data', (chunk: Buffer) => {
                    console.log(chunk + '');
                });
            }
            return childProcess;
        };
        // NOTE: Phan isn't going to work on win32, unless we use linux subsystem (Haven't tried) or docker... and if docker is used, you'd have to use stdin.

        // Use a TCP socket on Windows because of problems with blocking STDIO
        // stdio locks up for large responses
        // (based on https://github.com/felixfbecker/vscode-php-intellisense/commit/ddddf2a178e4e9bf3d52efb07cd05820ce109f43)
        if (!connectToServerWithStdio || process.platform === 'win32') {
            const server = net.createServer(socket => {
                // 'connection' listener
                console.log('PHP process connected');
                socket.on('end', () => {
                    console.log('PHP process disconnected');
                });
                server.close();
                resolve({ reader: socket, writer: socket });
            });
            server.listen(0, '127.0.0.1', () => {
                // Start the language server and make the language server connect to the client listening on <addr> (e.g. 127.0.0.1:<port>)
                // TODO: What about failing to listen? That should be exceedingly unlikely in practice.
                // @ts-expect-error TCP should always have a port
                const port = server.address().port;
                spawnServer('--language-server-tcp-connect=127.0.0.1:' + port);
            });
        } else {
            // Use STDIO on Linux / Mac if the user set
            // the override `"phan.connectToServerWithStdio": true` in their config.
            resolve(spawnServer('--language-server-on-stdin'));
        }
    }));

    const createClient = (dirToAnalyze: string): LanguageClient => {
        let defaultDocumentSelector: DocumentFilter;
        if (useRelativePatterns) {
            // workaround for error TS2540: Cannot assign to 'pattern' because it is a read-only property.
            // (maintains ability to check types)
            defaultDocumentSelector = {
                scheme: 'file',
                language: 'php',
                pattern: new RelativePattern(dirToAnalyze, '*')
            };
        } else {
            defaultDocumentSelector = {
                scheme: 'file',
                language: 'php'
            };
        }
        const documentSelectors: DocumentFilter[] = [ defaultDocumentSelector ];
        if (analyzedFileExtensions.length > 0) {
            let extPattern: RelativePattern|string;
            if (useRelativePatterns) {
                extPattern = new RelativePattern(dirToAnalyze, '**/*.{' + analyzedFileExtensions.join(',') + '}');
            } else {
                extPattern = '**/*.{' + analyzedFileExtensions.join(',') + '}';
            }
            documentSelectors.push({scheme: 'file', pattern: extPattern});
        }

        // Options to control the language client
        const clientOptions: LanguageClientOptions = {
            // Register the server for php (and maybe HTML) documents
            // @ts-expect-error DocumentSelector has conflicting type definitions
            documentSelector: documentSelectors,
            uriConverters: {
                // VS Code by default %-encodes even the colon after the drive letter
                // NodeJS handles it much better
                code2Protocol: uri => url.format(url.parse(uri.toString(true))),
                protocol2Code: str => vscode.Uri.parse(str)
            },
            synchronize: {
                // Synchronize the setting section 'phan' to the server (TODO: server side support)
                configurationSection: 'phan',
                fileEvents: vscode.workspace.createFileSystemWatcher('**/.phan/config.php')
            }
        };

        const serverOptions = serverOptionsCallbackForDirectory(dirToAnalyze);
        return new LanguageClient('Phan Language Server', serverOptions, clientOptions);
    };

    console.log('starting PHP Phan language server');
    // Create the language client and start the client.
    for (const dirToAnalyze of analyzedProjectDirectories) {
        // Push the disposable to the context's subscriptions so that the
        // client can be deactivated on extension deactivation
        context.subscriptions.push(createClient(dirToAnalyze).start());
    }
}

// Search all the workspace folders and return the first that contains .phan/config.php
// This will return the folder name in an array as required, and just only one folder,
// the first met. We can easy modify the function to add all valid workspace folders to the array.
function findValidProjectDirectories(): string[] {
    // Get the fsPath(file system path) of all workspace folders.
    const VSCodeFolders = vscode.workspace.workspaceFolders;
    if (!VSCodeFolders) {
        return [];
    }
    let workingFolders = VSCodeFolders.map(function (obj) {
        if (('uri' in obj) && ('fsPath' in obj.uri)) {
            return obj.uri.fsPath;
        }
        return '';
    });

    workingFolders = workingFolders.filter(function (folderPath) {
        return pathContainsPhanFolderAndConfig(folderPath);
    });

    return workingFolders;
}

// Whether or not a path contains the ".phan" folder alongside with a config.php file.
// Returns bool
function pathContainsPhanFolderAndConfig(folderPath: string): boolean {
    let phanConfigPath = path.join(folderPath, '.phan', 'config.php');
    return isFile(phanConfigPath);
}
