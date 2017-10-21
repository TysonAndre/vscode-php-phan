import * as path from 'path';
import { spawn, execFile, ChildProcess } from 'mz/child_process';
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, StreamInfo } from 'vscode-languageclient';
import * as semver from 'semver';
import * as net from 'net';
import * as url from 'url';
import * as fs from 'fs';

async function showOpenSettingsPrompt(errorMessage: string): Promise<void> {
    const selected = await vscode.window.showErrorMessage(
        errorMessage,
        'Open settings'
    );
    if (selected === 'Open settings') {
        await vscode.commands.executeCommand('workbench.action.openGlobalSettings');
    }
}

// Returns true if phan.phpExecutablePath is 7.1.0 or newer, and return false if it isn't (or php can't be found)
async function checkPHPVersion(context: vscode.ExtensionContext, phpExecutablePath: string): Promise<boolean> {
    // Check path (if PHP is available and version is ^7.1.0)
    let stdout: string;
    try {
        [stdout] = await execFile(phpExecutablePath, ['--version']);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await showOpenSettingsPrompt('PHP executable not found. Install PHP 7.1+ and add it to your PATH or set the phan.phpExecutablePath setting. Current PHP Path: ' + phpExecutablePath);
        } else {
            vscode.window.showErrorMessage('Error spawning PHP: ' + err.message);
            console.error(err);
        }
        return false;
    }

    // Parse version and discard OS info like 7.1.8--0ubuntu0.16.04.2
    const match = stdout.match(/^PHP ([^\s]+)/m);
    if (!match) {
        vscode.window.showErrorMessage('Error parsing PHP version. Please check the output of php --version. PHP Path: ' + phpExecutablePath);
        return false;
    }
    let version = match[1].split('-')[0];
    // Convert PHP prerelease format like 7.1.0rc1 to 7.1.0-rc1
    if (!/^\d+.\d+.\d+$/.test(version)) {
        version = version.replace(/(\d+.\d+.\d+)/, '$1-');
    }
    if (semver.lt(version, '7.1.0')) {
        vscode.window.showErrorMessage('Phan 0.10.x needs at least PHP 7.1 installed (and php-language-server needs at least 7.0). Version found: ' + version + ' PHP Path: ' + phpExecutablePath);
        return false;
    }
    return true;
}

async function checkPHPAstInstalledAndSupported(context: vscode.ExtensionContext, phpExecutablePath: string): Promise<boolean> {
    let stdout = '';
    try {
        [stdout] = await execFile(phpExecutablePath, ['-r', 'if (extension_loaded("ast")) { echo "ext-ast " . (new ReflectionExtension("ast"))->getVersion(); } else { echo "None"; }']);
    } catch (err) {
        vscode.window.showErrorMessage('Error spawning PHP to determine php-ast VERSION: ' + err.message + ' PHP Path: ' + phpExecutablePath);
        console.error(err);
        return false;
    }

    if (stdout.match(/^None/)) {
        vscode.window.showErrorMessage('php-ast is not installed or not enabled. php-ast 0.1.5 or newer must be installed. PHP Path: ' + phpExecutablePath);
        return false;
    }

    // Parse version and discard OS info like 7.1.8--0ubuntu0.16.04.2
    const astMatch = stdout.match(/^ext-ast ([^\s]+)/m);
    if (!astMatch) {
        vscode.window.showErrorMessage('Error parsing php-ast module version. Please check the output of `if (extension_loaded("ast")) { echo "ext-ast " . (new ReflectionExtension("ast"))->getVersion(); } else { echo "None"; }`. PHP Path: ' + phpExecutablePath);
        return false;
    }
    let astVersion = astMatch[1].split('-')[0];
    // Convert PHP prerelease format like 7.1.0rc1 to 7.1.0-rc1
    if (!/^\d+.\d+.\d+$/.test(astVersion)) {
        astVersion = astVersion.replace(/(\d+.\d+.\d+)/, '$1-');
    }
    if (semver.lt(astVersion, '0.1.5')) {
        vscode.window.showErrorMessage('Phan 0.10.x needs at least ext-ast 0.1.5 installed. Version found: ' + astVersion + ' PHP Path: ' + phpExecutablePath);
        return false;
    }
    return true;
}
async function checkPHPPcntlInstalled(context: vscode.ExtensionContext, phpExecutablePath: string): Promise<boolean> {
    let stdout = '';
    try {
        [stdout] = await execFile(phpExecutablePath, ['-r', 'var_export(extension_loaded("pcntl"));']);
    } catch (err) {
        vscode.window.showErrorMessage('Error spawning PHP to determine php-ast VERSION: ' + err.message + ' PHP path: ' + phpExecutablePath);
        console.error(err);
        return false;
    }

    if (!stdout.match(/^true/)) {
        vscode.window.showErrorMessage('pcntl(PHP module) is not installed or not enabled (also, pcntl can\'t be installed on Windows). PHP Path: ' + phpExecutablePath);
        return false;
    }
    return true;
}

function isFile(path: string): boolean {
    try {
        let stat = fs.statSync(path);
        return stat.isFile();
    } catch (e) {
        return false;
    }
}

function isDirectory(path: string): boolean {
    try {
        let stat = fs.statSync(path);
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
        vscode.window.showErrorMessage('Error spawning Phan to check for language server support: ' + err.message);
        console.error(err);
        return false;
    }

    // Check if phan --help indicates language server support
    const match = stdout.match(/language-server/m);
    if (!match) {
        vscode.window.showErrorMessage('Language server support was not detected. Please check the output of /path/to/phan --help. phan path: ' + phanScriptPath);
        return false;
    }
    return true;
}

// Returns true if phan.phanScriptPath supports the language server protocol.
async function checkValidAnalyzedProjectDirectory(context: vscode.ExtensionContext, analyzedProjectDirectory: string): Promise<boolean> {
    const exists: boolean = isDirectory(analyzedProjectDirectory);

    if (!exists) {
        await showOpenSettingsPrompt('The setting phan.analyzedProjectDirectory refers to a directory that does not exist. directory: ' + analyzedProjectDirectory);
        return false;
    }

    const phanConfigPath = path.join(analyzedProjectDirectory, '.phan', 'config.php');
    const phanConfigExists: boolean = isFile(phanConfigPath);

    if (!phanConfigExists) {
        await showOpenSettingsPrompt('The setting phan.analyzedProjectDirectory refers to a directory that does not contain .phan/config.php. Check that it is the root of a project set up for phan. directory: ' + analyzedProjectDirectory);
        return false;
    }
    return true;
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {

    const conf = vscode.workspace.getConfiguration('phan');
    const phpExecutablePath = conf.get<string>('phpExecutablePath') || 'php';
    const defaultPhanScriptPath = context.asAbsolutePath(path.join('vendor', 'phan', 'phan', 'phan'));
    const phanScriptPath = conf.get<string>('phanScriptPath') || defaultPhanScriptPath;
    // TODO: Support analyzing more than one project.
    // TODO: Figure out how to stop the language server when a different project is opened.
    const analyzedProjectDirectory = conf.get<string>('analyzedProjectDirectory') || '';
    const enableDebugLog = conf.get<boolean>('enableDebugLog');
    const useFallbackParser = conf.get<boolean>('useFallbackParser');
    const memoryLimit = conf.get<string>('memoryLimit') || null;
    const additionalCLIFlags = conf.get<string[]>('additionalCLIFlags') || [];
    const quick = conf.get<boolean>('quick');
    let analyzedFileExtensions: string[] = conf.get<string[]>('analyzedFileExtensions') || ['php'];

    const isValidPHPVersion: boolean = await checkPHPVersion(context, phpExecutablePath);
    if (!isValidPHPVersion) {
        return;
    }

    // Check if php-ast is installed
    const isPHPASTInstalled: boolean = await checkPHPAstInstalledAndSupported(context, phpExecutablePath);
    if (!isPHPASTInstalled) {
        return;
    }

    // Check if pcntl is installed
    const isPHPPcntlInstalled: boolean = await checkPHPPcntlInstalled(context, phpExecutablePath);
    if (!isPHPPcntlInstalled) {
        return;
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

    // Check if the analyzedProjectDirectory setting was provided.
    if (!analyzedProjectDirectory) {
        await showOpenSettingsPrompt('The setting phan.analyzedProjectDirectory must be provided (e.g. /path/to/some/project_folder). `.phan` must be a folder within that directory.');
        return;
    }

    const isValidProjectDirectory: boolean = await checkValidAnalyzedProjectDirectory(context, analyzedProjectDirectory);
    if (!isValidProjectDirectory) {
        return;
    }

    const serverOptions = () => new Promise<ChildProcess | StreamInfo>((resolve, reject) => {
        function spawnServer(...args: string[]): ChildProcess {
            if (additionalCLIFlags.length > 0) {
                args.unshift(...additionalCLIFlags);
            }
            if (memoryLimit && memoryLimit.length > 0) {
                args.unshift('--memory-limit', memoryLimit);
            }
            if (useFallbackParser) {
                // php phan --use-fallback-parser [args]
                args.unshift('--use-fallback-parser');
            }
            if (enableDebugLog) {
                // php phan --language-server-verbose [args]
                args.unshift('--language-server-verbose');
            }
            if (quick) {
                // php phan --language-server-verbose [args]
                args.unshift('--quick');
            }

            // The server is implemented in PHP
            // FIXME create a real language server module
            // FIXME install in vendor?
            args.unshift(phanScriptPathValidated);
            console.log('starting Phan Language Server', phpExecutablePath, args);
            // TODO: determine path from current working directory
            const childProcess = spawn(phpExecutablePath, args, {cwd: analyzedProjectDirectory});
            childProcess.stderr.on('data', (chunk: Buffer) => {
                console.error(chunk + '');
            });
            if (enableDebugLog) {
                childProcess.stdout.on('data', (chunk: Buffer) => {
                    console.log(chunk + '');
                });
            }
            return childProcess;
        }
        // Not going to work on win32, unless we use linux subsystem (Haven't tried) or docker
        if (process.platform === 'win32') {
            // Use a TCP socket on Windows because of blocking STDIO
            const server = net.createServer(socket => {
                // 'connection' listener
                console.log('PHP process connected');
                socket.on('end', () => {
                    console.log('PHP process disconnected');
                });
                server.close();
                resolve({ reader: socket, writer: socket });
            });
            // Listen on random port
            server.listen(0, '127.0.0.1', () => {
                spawnServer('--language-server-tcp-server=127.0.0.1:' + server.address().port);
            });
        } else {
            // Use STDIO on Linux / Mac
            resolve(spawnServer('--language-server-on-stdin'));
        }
    });

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        // Register the server for php (and maybe HTML) documents
        documentSelector: analyzedFileExtensions,
        uriConverters: {
            // VS Code by default %-encodes even the colon after the drive letter
            // NodeJS handles it much better
            code2Protocol: uri => url.format(url.parse(uri.toString(true))),
            protocol2Code: str => vscode.Uri.parse(str)
        },
        synchronize: {
            // Synchronize the setting section 'phan' to the server (TODO: server side support)
            configurationSection: 'phan',
            // Notify the server about changes to PHP files in the workspace
            // TODO: Extend this to html, htm, inc?
            fileEvents: vscode.workspace.createFileSystemWatcher('**/.phan/config.php')
        }
    };

    console.log('starting PHP Phan language server');
    // Create the language client and start the client.
    const disposable = new LanguageClient('Phan Language Server', serverOptions, clientOptions).start();

    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
}
