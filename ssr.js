import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';
import * as fs from 'fs';
import * as path from 'path';

function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

export async function ssr(svelteFilePath = 'src/App.svelte', precompileOnly = false) {
    // Ensure the 'cache' directory exists
    const cacheDir = path.resolve('cache');
    ensureDirectoryExists(cacheDir);

    // Ensure the 'public' directory exists
    const publicDir = path.resolve('public');
    ensureDirectoryExists(publicDir);

    // Read the Svelte component file
    const filePath = path.resolve(svelteFilePath);
    const source = fs.readFileSync(filePath, 'utf-8');

    // Compile the Svelte component
    const { js } = compile(source, {
        filename: path.basename(svelteFilePath),
        generate: 'ssr', // Generate server-side rendering code
    });

    // Determine the output file name based on the Svelte file name
    const outputFileName = path.basename(svelteFilePath, path.extname(svelteFilePath)) + '.js';
    const outputFilePath = path.join(cacheDir, outputFileName);
    fs.writeFileSync(outputFilePath, js.code);

    console.log(`Compiled Svelte component to ${outputFilePath}`);

    if (!precompileOnly) {
        // Dynamically import the compiled component
        const { default: App } = await import(path.resolve(`./cache/${outputFileName}`));

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

        const htmlOutputFilePath = path.resolve('public/index.html');
        fs.writeFileSync(htmlOutputFilePath, output);

        console.log(`Compiled HTML to ${htmlOutputFilePath}`);
    }
}
