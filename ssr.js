import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';
import * as fs from 'fs';
import * as path from 'path';

function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

function replaceSvelteImportsWithJs(code) {
    return code.replace(/import\s+([^\s]+)\s+from\s+['"]([^'"]+)\.svelte['"]/g, (match, p1, p2) => {
        return `import ${p1} from '${p2}.js'`;
    });
}

function getAllSvelteFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllSvelteFiles(filePath, fileList);
        } else if (file.endsWith('.svelte')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

function deleteDirectory(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.rmSync(directoryPath, { recursive: true, force: true });
    }
}

export async function precompile(directoryPath) {
    // Delete the 'cache' and 'public' directories if they exist
    const cacheDir = path.resolve('cache');
    const publicDir = path.resolve('public');
    deleteDirectory(cacheDir);
    deleteDirectory(publicDir);

    // Ensure the 'cache' and 'public' directories exist
    ensureDirectoryExists(cacheDir);
    ensureDirectoryExists(publicDir);

    // Get all .svelte files in the directory and subdirectories
    const svelteFiles = getAllSvelteFiles(directoryPath);

    for (const svelteFilePath of svelteFiles) {
        // Read the Svelte component file
        const source = fs.readFileSync(svelteFilePath, 'utf-8');

        // Compile the Svelte component
        const { js } = compile(source, {
            filename: path.basename(svelteFilePath),
            generate: 'ssr', // Generate server-side rendering code
            css: 'injected',
        });

        // Determine the output file name and path
        const relativePath = path.relative(directoryPath, svelteFilePath);
        const outputFileName = path.basename(relativePath, '.svelte') + '.js';
        const outputFilePath = path.join(cacheDir, path.dirname(relativePath), outputFileName);

        // Ensure the output directory exists
        ensureDirectoryExists(path.dirname(outputFilePath));

        // Replace .svelte imports with .js
        const modifiedCode = replaceSvelteImportsWithJs(js.code);
        fs.writeFileSync(outputFilePath, modifiedCode);

        console.log(`Compiled Svelte component to ${outputFilePath}`);
    }
}

export async function ssr(inputFileName, outputFilename) {
    // Dynamically import the compiled component
    const { default: App } = await import(path.resolve(`./cache/${inputFileName}`));

    // Use the render function exported by the compiled component
    const { head, body } = render(App, { props: { name: 'World' } });

    const output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Svelte Server-side rendering (SSR)</title>
    ${head}
    </head>
    <body>
    ${body}
    </body>
    </html>
    `;

    console.log(output);

    const htmlOutputFilePath = path.resolve('public/' + outputFilename);
    fs.writeFileSync(htmlOutputFilePath, output);

    console.log(`Compiled HTML to ${htmlOutputFilePath}`);
}
