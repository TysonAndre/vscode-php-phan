
import * as path from 'path';
import { spawn, execFile, ChildProcess } from 'mz/child_process';
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, StreamInfo } from 'vscode-languageclient';
import * as semver from 'semver';
import * as net from 'net';
import * as url from 'url';

export async function activate(context: vscode.ExtensionContext): Promise<void> {

    const conf = vscode.workspace.getConfiguration('php');
    const executablePath = conf.get<string>('executablePath') || 'php';

    // Check path (if PHP is available and version is ^7.0.0)
    let stdout: string;
    try {
        [stdout] = await execFile(executablePath, ['--version']);
    } catch (err) {
        if (err.code === 'ENOENT') {
            const selected = await vscode.window.showErrorMessage(
                'PHP executable not found. Install PHP 7 and add it to your PATH or set the php.executablePath setting',
                'Open settings'
            );
            if (selected === 'Open settings') {
                await vscode.commands.executeCommand('workbench.action.openGlobalSettings');
            }
        } else {
            vscode.window.showErrorMessage('Error spawning PHP: ' + err.message);
            console.error(err);
        }
        return;
    }

    // Parse version and discard OS info like 7.1.8--0ubuntu0.16.04.2
    const match = stdout.match(/^PHP ([^\s]+)/m);
    if (!match) {
        vscode.window.showErrorMessage('Error parsing PHP version. Please check the output of php --version');
        return;
    }
    let version = match[1].split('-')[0];
    // Convert PHP prerelease format like 7.1.0rc1 to 7.1.0-rc1
    if (!/^\d+.\d+.\d+$/.test(version)) {
        version = version.replace(/(\d+.\d+.\d+)/, '$1-');
    }
    if (semver.lt(version, '7.1.0')) {
        vscode.window.showErrorMessage('Phan 0.9.x needs at least PHP 7.1 installed. Version found: ' + version);
        return;
    }

    // Check if php-ast is installed
    stdout = ''
    try {
        [stdout] = await execFile(executablePath, ['-r', 'if (extension_loaded("ast")) { echo "ext-ast " . (new ReflectionExtension("ast"))->getVersion(); } else { echo "None"; }']);
    } catch (err) {
          vscode.window.showErrorMessage('Error spawning PHP to determine php-ast VERSION: ' + err.message);
          console.error(err);
        return;
    }

    if (stdout.match(/^None/)) {
        vscode.window.showErrorMessage('php-ast is not installed or not enabled. php-ast 0.1.4 or newer must be installed');
        return;
    }

    // Parse version and discard OS info like 7.1.8--0ubuntu0.16.04.2
    const match = stdout.match(/^ext-ast ([^\s]+)/m);
    if (!match) {
        vscode.window.showErrorMessage('Error parsing PHP version. Please check the output of php --version');
        return;
    }
    let astVersion = match[1].split('-')[0];
    // Convert PHP prerelease format like 7.1.0rc1 to 7.1.0-rc1
    if (!/^\d+.\d+.\d+$/.test(astVersion)) {
        astVersion = astVersion.replace(/(\d+.\d+.\d+)/, '$1-');
    }
    if (semver.lt(astVersion, '0.1.4')) {
        vscode.window.showErrorMessage('Phan 0.9.x needs at least ext-ast 0.1.4 installed. Version found: ' + astVersion);
        return;
    }

    // Check if pcntl is installed
    stdout = ''
    try {
        [stdout] = await execFile(executablePath, ['-r', 'var_export(extension_loaded("pcntl"));']);
    } catch (err) {
          vscode.window.showErrorMessage('Error spawning PHP to determine php-ast VERSION: ' + err.message);
          console.error(err);
        return;
    }

    if (!stdout.match(/^true/)) {
        vscode.window.showErrorMessage('pcntl(PHP module) is not installed or not enabled (also, pcntl can\'t be installed on Windows)');
        return;
    }

    const serverOptions = () => new Promise<ChildProcess | StreamInfo>((resolve, reject) => {
        function spawnServer(...args: string[]): ChildProcess {
            // The server is implemented in PHP
            // FIXME create a real language server module
            args.unshift('/home/tyson/programming/php-language-server/bin/php-language-server.php')));
            const childProcess = spawn(executablePath, args);
            childProcess.stderr.on('data', (chunk: Buffer) => {
                console.error(chunk + '');
            });
            childProcess.stdout.on('data', (chunk: Buffer) => {
                console.log(chunk + '');
            });
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
                spawnServer('--tcp=127.0.0.1:' + server.address().port);
            });
        } else {
            // Use STDIO on Linux / Mac
            resolve(spawnServer());
        }
    });

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        // Register the server for php documents
        documentSelector: ['php'],
        uriConverters: {
            // VS Code by default %-encodes even the colon after the drive letter
            // NodeJS handles it much better
            code2Protocol: uri => url.format(url.parse(uri.toString(true))),
            protocol2Code: str => vscode.Uri.parse(str)
        },
        synchronize: {
            // Synchronize the setting section 'php' to the server
            configurationSection: 'php',
            // Notify the server about changes to PHP files in the workspace
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.php')
        }
    };

    // Create the language client and start the client.
    const disposable = new LanguageClient('PHP Language Server', serverOptions, clientOptions).start();

    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
}
