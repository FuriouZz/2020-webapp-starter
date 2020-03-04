export interface BasicOptions {
  profile?: string
  region?: string
  debug?: boolean
}

export interface InvalidationOption extends BasicOptions {
  distribution_id: string
  paths: string[]
}

export interface DeployOptions extends BasicOptions {
  bucket: string
  input: string
  exceptions?: Record<string, ObjectDescription>
  cloudfront?: InvalidationOption
}

export interface ObjectDescription {
  contentType: string,
  contentEncoding: string
}

export interface GZipOptions {
  patterns: Record<string, ObjectDescription>,
  base_dir: string
  debug?: boolean
}