import { Configuration, RuleSetRule } from "webpack";
import { WKConfig } from "./types";
import { TransformersFactory } from "./transformer";
import { StylusPluginFactory } from "./stylus-plugin";
import { NO_FILE_EXTRACT_REG, STYL_REG, TS_REG, EJS_REG, RAW_REG, MJS_REG } from "./regex";

/**
 * Use this rule if you want to emit a single file.
 * Every entry points are emitted (JS/CSS/HTML/...)
 */
export function file_rule(w: Configuration, config: WKConfig) : RuleSetRule {
  return {
    include: w.context,

    test(resourcePath: string) {
      if (resourcePath.match(NO_FILE_EXTRACT_REG)) return false
      const path = config.assets.resolve.parse(resourcePath)
      if (!path.source) return false
      return config.assets.manifest.has(path.key)
    },

    use: [
      {
        loader: 'file-loader',
        options: {
          outputPath(url: string, resourcePath: string) {
            const path = config.assets.resolve.parse(resourcePath)
            return path.key ? config.assets.resolve.path(path.key) : path.key
          }
        }
      },

      { loader: 'extract-loader' }
    ]
  }
}

/**
 * Use Raw Loader + Stylus for STYL file
 */
export function styl_rule(w: Configuration, config: WKConfig) : RuleSetRule {
  const file = file_rule(w, config)

  return {
    test: STYL_REG,
    include: w.context,
    use: [
      file.use[0],
      file.use[1],
      {
        loader: 'raw-loader'
      },
      {
        loader: 'stylus-loader',
        options: {
          use: [StylusPluginFactory(config)],
          set: {
            "include css": true,
            "compress": config.compress
          }
        }
      }
    ]
  }
}

/**
 * Use typescript loader for every TS or JS file
 */
export function ts_rule(w: Configuration, config: WKConfig) : RuleSetRule {
  return {
    test: TS_REG,
    include: w.context,
    use: [
      {
        loader: 'ts-loader',
        options: {
          getCustomTransformers: TransformersFactory(config)
        }
      }
    ]
  }
}

/**
 * Use our custom EJS pre-loader for every file ended with a EJS extension
 */
export function ejs_rule(w: Configuration, config: WKConfig) : RuleSetRule {
  return {
    test: EJS_REG,
    enforce: 'pre',
    include: w.context,
    use: [
      {
        loader: __dirname + '/ejs-loader.js',
        options: config.ejs
      }
    ]
  }
}

/**
 * Use raw loader every text files
 */
export function raw_rule(w: Configuration, config: WKConfig): RuleSetRule {
  return {
    test: RAW_REG,
    include: w.context,
    use: ['raw-loader']
  }
}

/**
 * Use default javascript loader every .mjs files
 */
export function mjs_rule(w: Configuration, config: WKConfig): RuleSetRule {
  return {
    test: MJS_REG,
    include: /node_modules/,
    type: "javascript/auto"
  }
}