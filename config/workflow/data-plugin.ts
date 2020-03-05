import { Compiler } from 'webpack'
import { WKConfig } from './types'
import { writeFile } from 'lol/js/node/fs'
import { join } from 'path'

export class DataPlugin {

  constructor(protected config: WKConfig) {
    this.apply = this.apply.bind(this)
    this.generate = this.generate.bind(this)
  }

  apply(compiler: Compiler) {
    compiler.hooks.done.tap('data-generate', this.generate)
  }

  async generate() {
    const data = this.config.ejs.data || {}
    await writeFile(`export const PAGE = ${JSON.stringify(data, null, 2)}`, join(this.config.assets.source.all(true)[0], 'scripts/data/PAGE.ts'))
  }

}