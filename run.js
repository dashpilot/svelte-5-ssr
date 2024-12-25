import { precompile, renderToFile } from './ssr.js';

async function run() {
    await precompile('./src'); // first precompile all files in the directory
    await renderToFile('App.js', 'index.html', 'Svelte 5 SSR', `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">`);
}

run();
