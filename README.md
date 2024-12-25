# Svelte 5 Server-side rendering (SSR)

Simple example of how you can server-side-render a Svelte 5 component.

## How it works:

1. In order to SSR a Svelte component, you first need to compile it into a .js file, so Node.js can work with it
2. After that, you import the precompiled file, and render it

## Features

-   precompiles all files files in a certain directory and its subfolders
-   supports nested components
-   supports runes
-   supports style tags inside components, and inlines them into the head
-   no need for Vite or Rollup: all compilation happens server-side

## How to run

Install dependencies:

```bash
npm install
```

Run the script:

```bash
npm run build
```

## Press the :star: button

Don't forget to press the :star: button to let me know I should continue improving this project.
