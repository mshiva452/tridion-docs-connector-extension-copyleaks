# Getting Started

This project was created with Tridion Docs Extensions CLI

## Available Scripts

In the project directory, you can run:

### dev

`npm run dev` or `yarn run dev`

Runs the app in the development mode.
Open [http://localhost:3010](http://localhost:3010) to view it in your browser.


### build
`npm run build` or  `yarn run build`

Builds the extension for production to the `dist` folder.


### pack
`npm run pack` or  `yarn run pack`

Packs an extension and prepares it for deployment

### lint
`npm run lint` or  `yarn run lint`

Run [eslint](https://eslint.org/) and [prettier](https://prettier.io/) on `src` folder

## example of usage css file

As the starting point of using css variables we need to include them in to the build. For example we can add import into `src/index.ts`
```typescript
...
import './../theme/_variables.css';
...

```

That import will give you access to all variables defined in css file and you can use it with `var` css function. More details can be found [here](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

```css
.come-class-name {
    padding: 60px;
    background: var(--color-blue50);
}

```

## example of usage ts files

`colorPalette.ts` and `spacingUnits.ts` can be used for [styled components](https://styled-components.com/)

```typescript
import styled from 'styled-components';
import spacing from '../spacingUnits.ts';

const Container = styled.div`
    padding: ${spacing.sm}px;
`;

```

## Project structure

```
.
├── dist // Result of the build command will be put here
├── my-extension // Extensions folder
│   ├── certificate // Generated certificates for the local https server
│   ├── src // main source code folder where hooks and components should be located
|   |   ....
│   │   ├── globals.ts
│   │   └── index.tsx // main entry point of the app
│   ├── types // Global styles folder
│   │   └── css.d.ts
│   ├── theme // colors and spacing examples
│   ├── .browserslistrc
│   ├── .editorconfig
│   ├── .gitignore
│   ├── .prettierrc
│   ├── babel.config.js
│   ├── eslint.config.mjs
│   ├── devServer.js // local dev server configuration
│   ├── package.json
│   ├── tsconfig.json
│   ├── webpack.dev.config.js
│   └── webpack.prod.config.js
├── manifest.json
└── my-addon.config

```
