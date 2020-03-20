# 2020-webapp-starter <!-- omit in toc -->

* Typescript 3.5.2
* Webpack 4.35.2
* AssetPipeline v2#99f3f6b9373799bee0230a7f25b1bc2f91d0beb0
* lol.js 0.0.9

## Changes

* Every Non-JS/TS entries are bundled into `bundle.js` and extracted with `extract-loader`
* No longer use `vendors.js`, now use `import()`. See [main.ts#L5](main.ts#L5)
* Deprecate support of `.ejs` file, now use `@ejs:` transform or `app/scripts/data/PAGE.ts`. See [main.ts#L18](app/scripts/main.ts#L18)
* `app/scripts/data/PAGE.ts` is now generated on fly and updated at each file changes.
* Assets manifest is now updated at `app/**/*` changes, no longer need to restart a webpack compilation
* Support execution on Powershell environment

## Setup

<!-- * Rename `config/environments/development.yml.sample` into `config/environments/development.yml`
* Edit the file at your convenience -->
* Duplicate `.env.sample` into `.env` or `.env.{environement}`
* Edit the file at your convenience
* `npm i` to install dependencies
* `npm run locale`
* `npm run dev:server` to run a webpack-dev-server

## Common commands

```sh
npm i                                                # Install dependencies
npm run config                                       # Compile webpack configuration
npm run locale [-- --env.environment=${ENVIRONMENT}] # Download locales from airtable
npm run deploy [-- --env.environment=${ENVIRONMENT}] # Deploy
npm run dev                                          # Start webpack compilation
npm run dev:server                                   # Start webpack-dev-server
```