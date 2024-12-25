import { precompile, ssr } from './ssr.js';

async function run() {
    await precompile('./src'); // first precompile all files in the directory
    await ssr('App.js', 'index.html');
}

run();
