import { compile } from 'svelte/compiler';
import * as fs from 'fs';
import * as path from 'path';

function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

function precompile() {
    // Ensure the 'precompiled' directory exists
    const precompiledDir = path.resolve('precompiled');
    ensureDirectoryExists(precompiledDir);

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
    const outputFilePath = path.join(precompiledDir, 'App.js');
    fs.writeFileSync(outputFilePath, js.code);

    console.log(`Compiled Svelte component to ${outputFilePath}`);
}

precompile();
