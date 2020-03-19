import { WKConfig } from "./types";
import { Configuration } from "webpack";
import { raw_rule, ejs_rule, styl_rule, ts_rule, file_rule, mjs_rule } from "./loaders";
import { AWSDeployPlugin } from "./aws/plugin";
import { DataPlugin } from "./data-plugin";
import * as Path from "path";
import { TS_REG } from "./regex";

/**
 * Return a webpack configuration based on your config
 */
export async function Webpack(config: WKConfig, block?: (w: Configuration, config: WKConfig) => void) {
  const w: Configuration = {}
  misc(w, config)
  entries(w, config)
  output(w, config)
  resolve(w, config)
  modules(w, config)
  optimization(w, config)
  plugins(w, config)
  server(w, config)
  ejs_helpers(w, config)
  if (config.deploy) deployment(w, config)
  if (block) block(w, config)
  return w
}

/**
 * Configure webpack.mode, webpack.context, webpack.target, etc...
 */
export function misc(w: Configuration, config: WKConfig) {
  w.mode = "production"
  w.context = config.assets.source.all(true)[0]
  w.context = Path.normalize(w.context)
  w.watch = config.watch
  w.watchOptions = {
    poll: true,
    ignored: [ /PAGE\.ts/ ],
  }
  w.target = "web"

  if (!config.compress) {
    w.mode = "development"
    w.cache = true
    w.devtool = "cheap-eval-source-map"
  }
}

/**
 * Add webpack.entry.
 * Non-JS/TS file are pushed into an entry point "bundle.js"
 */
export function entries(w: Configuration, config: WKConfig) {
  w.entry = function () {
    const p = config.assets
    const entry: any = {}

    const assets = p.manifest.all()
    const { input } = assets.find(asset => {
      return asset.rule.tag == 'bundle'
    })

    assets
      .filter((asset) => {
        return asset.rule.tag == 'entry'
      })
      .forEach((asset) => {
        if (TS_REG.test(Path.extname(asset.input))) {
          entry[asset.output] = './' + asset.input
        } else {
          const output = p.resolve.path(input)
          entry[output] = entry[output] || []
          entry[output].push('./' + asset.input)
        }
      })

    return entry
  }
}

/**
 * Configure webpack.output
 */
export function output(w: Configuration, config: WKConfig) {
  w.output = {}
  w.output.path = Path.normalize(config.assets.resolve.output_with('./'))
  w.output.filename = '[name]'
  w.output.chunkFilename = '[name].chunk.js'
}

/**
 * Configure webpack-dev-server if started with it
 */
export function server(w: Configuration, config: WKConfig) {
  if (process.argv.join(' ').indexOf('webpack-dev-server') == -1) return

  w.devServer = {
    contentBase: config.assets.source.all(),
    host: "0.0.0.0",
    port: 3000,
    https: config.https,
    inline: config.reload,
    watchContentBase: config.watch,
    watchOptions: {
      poll: true,
      ignored: [ /PAGE\.ts/ ],
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true'
    },
    disableHostCheck: true,
  }
}

/**
 * Configure webpack.resolve.
 * If you have external modules to look for please add them the lib pipeline
 */
export function resolve(w: Configuration, config: WKConfig) {
  w.resolve = {}
  w.resolve.extensions = ['.js', '.ts', '.mjs']
  w.resolve.alias = {
    'vue$': 'vue/dist/vue.esm.js'
  }
  w.resolve.modules = [
    'node_modules',
    'app/scripts',
    'app/vendors'
  ]
}

/**
 * Configure webpack.module
 * See "./loaders.ts" for predefined loaders
 */
export function modules(w: Configuration, config: WKConfig) {
  w.module = {
    rules: [
      ejs_rule(w, config),
      styl_rule(w, config),
      ts_rule(w, config),
      raw_rule(w, config),
      file_rule(w, config),
      mjs_rule(w, config),
    ]
  }
}

/**
 * Configure webpack.optimization.
 * TODO: Enhance split chunks
 */
export function optimization(w: Configuration, config: WKConfig) {
  w.optimization = {}
  w.optimization.nodeEnv = w.mode

  if (config.compress) {
    w.optimization.minimize = true
  }
}

/**
 * Configure webpack.plugins
 */
export function plugins(w: Configuration, config: WKConfig) {
  w.plugins = []
  w.plugins.push(new DataPlugin(config))
}

/**
 * Configure ejs helpers
 */
export function ejs_helpers(w: Configuration, config: WKConfig) {
  config.ejs.helpers = config.ejs.helpers || {}

  config.ejs.helpers.asset_path = function () {
    return function (path: string, from?: string) {
      return config.assets.resolve.path(path, from)
    }
  }

  config.ejs.helpers.asset_url = function () {
    return function (path: string, from?: string) {
      return config.assets.resolve.url(path, from)
    }
  }
}

/**
 * Configure the deployment plugin
 */
export function deployment(w: Configuration, config: WKConfig) {
  w.plugins.push(new AWSDeployPlugin(config.deploy))
}