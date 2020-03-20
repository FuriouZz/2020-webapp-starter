import { Compiler, compilation } from 'webpack'
import { WKConfig } from './types'
import { writeFile, isDirectory, isFile } from 'lol/js/node/fs'
import { join, dirname } from 'path'
import { IAsset } from 'asset-pipeline/js/types'

export class DataPlugin {

  constructor(protected config: WKConfig) {
    this.apply = this.apply.bind(this)
    this.generate = this.generate.bind(this)
    this.watch = this.watch.bind(this)
  }

  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tapPromise('data:generate', this.generate)
    compiler.hooks.afterCompile.tapPromise('data:watch', this.watch)
  }

  /**
   * Fetch new assets
   * and generate app/scripts/data/PAGE.ts
   */
  async generate() {
    const data: any = this.config.ejs.data || {}

    await this.config.assets.fetch(true) // Force fetching new files
    data.global.assets = this.config.assets.manifest.all_outputs_by_key()

    await writeFile(`export const PAGE = ${JSON.stringify(data, null, 2)}`, join(this.config.assets.source.all(true)[0], 'scripts/data/PAGE.ts'))
  }

  /**
   * Watch new directories
   */
  async watch(c: compilation.Compilation) {
    const assets: Record<string, IAsset> = this.config.assets.manifest.all_by_key()

    Object.values(assets).forEach(asset => {
      let path = this.config.assets.source.with(asset.source, asset.input, true)

      if (isFile(path)) {
        path = dirname(path)
      }

      if (isDirectory(path)) {
        c.contextDependencies.add(path)
      }
    })
  }

}