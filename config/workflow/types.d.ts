import { Pipeline } from "asset-pipeline/js/pipeline";
import { EJSOptions } from "./ejs-loader";
import { I18nLoadOptions } from "./i18n";
import { DeployOptions } from "./aws/types";

export interface WKConfig {
  watch: boolean
  reload: boolean
  compress: boolean
  https: boolean
  ejs: EJSOptions
  environment: string
  assets: Pipeline
  deploy?: DeployOptions
}

export interface WKEnv {
  environment?: string
  html?: boolean
  watch?: boolean
  reload?: boolean
  compress?: boolean
  copy?: boolean
  output?: string
  host?: string
  date?: string
  i18n?: I18nLoadOptions
  deploy?: DeployOptions
  https?: boolean
  cache?: boolean
}