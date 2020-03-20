import { AssetPipeline } from "asset-pipeline";
import { Webpack } from "./workflow/webpack";
import { WKEnv } from "./workflow/types";
import { generateVersionFromDate } from 'lol/js/string';
import { template2 } from 'lol/js/string/template';
import * as i18n from './workflow/i18n';
import { current_commit } from './workflow/git'
import * as Path from "path";
import * as Env from './workflow/environment'
import { RenameOptions } from "asset-pipeline/js/types";

/**
 * Merge options things, you know. It just works
 */

export function merge_options(options: WKEnv): WKEnv {
  return Env.parse(options, (config) => {

    config.date = typeof config.date == 'string' ? config.date : generateVersionFromDate()
    config.output = template2(config.output, { date: config.date })
    config.copy = process.argv.join(' ').indexOf('webpack-dev-server') == -1
    if (config.deploy) config.deploy.input = template2(config.deploy.input, config)
  })
}

function html_output(options: RenameOptions) {
  return Path.join(options.input.dir.replace(/views(\/){0,1}/, ''), options.input.name)
}

export default async function main(options: WKEnv = { environment: 'development' }) {
  /**
   * Merge environment options
   * To pass an environment variables, you have to write like this:
   *   "webpack --env.watch=true --env.compress --env.environment='production'"
   */
  options = merge_options(options)
  const { environment, watch, compress, output, deploy, reload, https } = options

  const assets = new AssetPipeline('assets')
  assets.cache.enabled = options.cache

  // Root path = './'
  assets.resolve.root(process.cwd())

  // Host path = "/" || "file://html_content/"
  assets.resolve.host = options.host

  // Outputh path = "./public" || "./build/staging/{DATE}"
  assets.resolve.output(output)

  // Override "./tmp/manifest-assets.json"
  assets.manifest.read = false

  // Going to look for files into "./app" directory
  assets.source.add('app')

  /**
   * Add entry points, must have the tag `entry`
   */
  assets.file.add(`scripts/main.ts`, { tag: 'entry', output: '#{output.name}.js', cache: '#{output.name}-#{output.hash}.js' })
  assets.file.add(`styles/main.styl`, { tag: 'entry', output: '#{output.name}.css', cache: '#{output.name}-#{output.hash}.css' })

  if (options.html) {
    assets.file.ignore(`views/**/_*.html.ejs`) // Ignore underscore files
    assets.file.add(`views/**/*.html.ejs`, { tag: 'entry', output: html_output, cache: false })
  }

  /**
   * Add assets, must have the tag `entry`
   */
  assets.file.add('assets/**/*' , { tag: 'asset' })

  /**
   * Shadow add non-existing files to the manifest
   * With webpack, every non-js/ts entrypoints are grouped into bundle.js
   */
  assets.file.shadow('bundle.js', { tag: 'bundle' })

  /**
   * Collect list of files and generate "./tmp/manifest-assets.json"
   * Force to refetch files
   */
  await assets.fetch(true)

  /**
   * Copy every files on assets to the output
   */
  if (options.copy) {
    assets.fs.copy('assets/**/*')
    await assets.fs.apply()
  }

  /**
   * Create the webpack configuration
   */
  const w = await Webpack({
    ejs: {
      data: {
        /** EJS Variables */
        global: {
          environment: {
            name: environment,
            host: options.host,
            build: options.date,
            commit: await current_commit()
          },
          locales: options.i18n ? await i18n.load(options.i18n) : {},
          assets: assets.manifest.all_outputs_by_key(),
        }
        /** EJS Variables End */
      }
    },
    watch,
    compress,
    environment,
    assets,
    deploy,
    reload,
    https
  })
  // console.log(w)
  return w
}