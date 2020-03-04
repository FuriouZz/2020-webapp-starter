import * as Fs from 'fs';
import * as Path from 'path';
import { DeployOptions } from './types';
import { deploy, invalidate_paths } from './deploy';

export class AWSDeployPlugin {

  constructor(private options: DeployOptions) {
    this.apply = this.apply.bind(this)
    this.deploy = this.deploy.bind(this)
  }

  apply(compiler: any) {
    compiler.hooks.done.tap('aws-deploy', this.deploy)
  }

  async deploy() {
    await deploy(this.options)
    if (this.options.cloudfront) {
      await invalidate_paths(this.options.cloudfront)
    }
  }

}