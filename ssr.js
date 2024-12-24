import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';
import * as fs from 'fs';
import * as path from 'path';

function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

async function precompile() {
    // Ensure the 'precompiled' directory exists
    const cacheDir = path.resolve('cache');
    ensureDirectoryExists(cacheDir);

    // Ensure the 'public' directory exists
    const publicDir = path.resolve('public');
    ensureDirectoryExists(publicDir);

    // Read the Svelte component file
    const filePath = path.resolve('src/App.svelte');
    const source = fs.readFileSync(filePath, 'utf-8');

    // Compile the Svelte component
    const { js } = compile(source, {
        filename: 'App.svelte',
        generate: 'ssr', // Generate server-side rendering code
    });

    // Write the compiled JavaScript to a file
    const outputFilePath = path.join(cacheDir, 'App.js');
    fs.writeFileSync(outputFilePath, js.code);

    console.log(`Compiled Svelte component to ${outputFilePath}`);
}

async function ssr() {
    // Dynamically import the compiled component
    const { default: App } = await import(path.resolve('./cache/App.js'));

    // Use the render function exported by the compiled component
    const { head, body } = render(App, { props: { name: 'World' } });

    const output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Svelte App</title>
        <style></style>
        ${head}
    </head>
    <body>
        ${body}
    </body>
    </html>
    `;

    console.log(output);

    const outputFilePath = path.resolve('public/index.html');
    fs.writeFileSync(outputFilePath, output);

    console.log(`Compiled HTML to ${outputFilePath}`);
}

async function main() {
    await precompile();
    await ssr();
}

main();
