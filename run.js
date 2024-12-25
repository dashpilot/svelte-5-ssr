import { ssr } from './ssr.js';

async function run() {
    await ssr('./src/Sub.svelte', true); // first precompile just the imports
    await ssr();
}

run();
