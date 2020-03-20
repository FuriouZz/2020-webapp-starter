import { WKEnv } from "./types";
import YAML from 'js-yaml';
import * as Fs from 'fs';
import * as Path from 'path';
import { merge } from 'lol/js/object';
import template from "lodash.template";
import dotenv from "dotenv";


export function loadYML(path: string) {
  try {
    let content = Fs.readFileSync(path, 'utf-8')
    return YAML.safeLoad(content) || {}
  } catch (e) {
    throw `Missing environment file "${path}"`
  }
}


function parseEnvValue(value) {

  // if the value is wrapped in bacticks e.g. (`value`) then just return its value
  if (value.toString().indexOf('`') === 0
    && value.toString().lastIndexOf('`') === value.toString().length - 1) {
    return value.toString().substring(1, value.toString().length - 1);
  }

  // if the value ends in an asterisk then just return its value
  if (value.toString().lastIndexOf('*') === value.toString().length - 1
    && value.toString().indexOf(',') === -1) {
    return value.toString().substring(0, value.toString().length - 1);
  }

  // Boolean
  if (value.toString().toLowerCase() === 'true' || value.toString().toLowerCase() === 'false') {
    return value.toString().toLowerCase() === 'true';
  }

  // Number
  if (!isNaN(value)) {
    return Number(value);
  }

  // Array
  if (value.indexOf(',') !== -1) {
    return value.split(',').map(parseEnvValue);
  }

  return value;

}


export function parseEnvVars(config: any) {

  let keys = Object.keys(config);
  for (var i = 0; i < keys.length; i++) {
    if (typeof config[keys[i]] === "object") {
      parseEnvVars(config[keys[i]]);
    } else if (typeof config[keys[i]] === "string" && config[keys[i]].indexOf("ENV[") != -1) {

      config[keys[i]] = config[keys[i]].replace('ENV["', "");
      config[keys[i]] = config[keys[i]].replace('"]', "");
      let value: any = process.env[config[keys[i]]] || '';
      config[keys[i]] = parseEnvValue(value);

    }


  }

}

export function parse(config: WKEnv = { environment: 'development' }, callback?: (config: WKEnv) => void) {


  let dotenvpath = Path.resolve(process.cwd(), '.env.' + config.environment);
  if (!Fs.existsSync(dotenvpath))
    dotenvpath = Path.resolve(process.cwd(), ".env");

  dotenv.config({ path: dotenvpath });

  const environment = config.environment = config.environment || 'development'

  let yml = loadYML(`./config/environments/${environment}.yml`)
  if (typeof yml.extend === 'string') yml = merge(loadYML(Path.join(`./config/environments/`, yml.extend)), yml)
  config = merge(yml, config)
  parseEnvVars(config);
  if (typeof callback == 'function') callback(config)

  config = JSON.parse(template(JSON.stringify(config))(config))

  return config
}