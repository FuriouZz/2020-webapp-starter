import { parse } from './utils/argv';
import { deflat } from 'lol/js/object';
import { WKEnv } from './workflow/types';
import { merge_options } from './build';
import * as i18n from './workflow/i18n';
import * as AWS from './workflow/aws/deploy';

async function main(argv: any) {

  const env = deflat<{ env: WKEnv }>(argv).env || { environment: 'development' }
  const options = merge_options(env)

  switch (argv["0"]) {

    /**
     * Load locales from Airtable datas
     */
    case "locale": {
      options.i18n.fetch = true
      i18n.load(options.i18n)
      break
    }

    case "deploy": {
      if (options.deploy) {
        AWS.deploy(options.deploy)
      }
      break
    }

    default:
  }

}

main(parse(process.argv.slice(2)))