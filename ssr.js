// renderApp.js
import { render } from 'svelte/server';
import App from './precompiled/App.js';
import * as fs from 'fs';
import * as path from 'path';

function ssr() {
    const { head, body } = render(App, { props: { world: 'someValue' } });

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

ssr();
