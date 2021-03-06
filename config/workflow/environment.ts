import { WKEnv } from "./types";
import YAML from 'js-yaml';
import * as Fs from 'fs';
import * as Path from 'path';
import { merge } from 'lol/js/object';
import template from "lodash.template";

export function loadYML(path: string) {
  try {
    let content = Fs.readFileSync(path, 'utf-8')
    return YAML.safeLoad(content) || {}
  } catch(e) {
    throw `Missing environment file "${path}"`
  }
}

export function parse(config: WKEnv = { environment: 'development' }, callback?: (config: WKEnv) => void) {
  const environment = config.environment = config.environment || 'development'

  let yml = loadYML(`./config/environments/${environment}.yml`)
  if (typeof yml.extend === 'string') yml = merge(loadYML(Path.join(`./config/environments/`, yml.extend)), yml)
  config = merge(yml, config)
  if (typeof callback == 'function') callback(config)

  config = JSON.parse(template(JSON.stringify(config))(config))

  return config
}