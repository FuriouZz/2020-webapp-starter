# 2020-webapp-starter <!-- omit in toc -->

Typescript 3.5.2
Webpack 4.35.2
AssetPipeline v2
lol.js 0.0.9

## Setup

* Rename `config/environments/development.yml.sample` into `config/environments/development.yml`
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