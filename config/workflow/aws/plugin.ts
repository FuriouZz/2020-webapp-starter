import { DeployOptions } from './types';
import { deploy, invalidate_paths } from './deploy';
import { Compiler } from 'webpack'

export class AWSDeployPlugin {

  constructor(private options: DeployOptions) {
    this.apply = this.apply.bind(this)
    this.deploy = this.deploy.bind(this)
  }

  apply(compiler: Compiler) {
    compiler.hooks.done.tap('aws-deploy', this.deploy)
  }

  async deploy() {
    await deploy(this.options)
    if (this.options.cloudfront) {
      await invalidate_paths(this.options.cloudfront)
    }
  }

}