import Airtable from 'airtable';
import { omit, flat } from 'lol/js/object';
import * as Fs from 'fs';
import * as Path from 'path';
import { template2 } from 'lol/js/string/template';
import * as kramed from 'kramed';
import { html } from '../utils/unescape';

export interface I18nFetchOptions {
  apiKey: string,
  appId: string,
  tab: string,
  view: string,
  output?: string,
  ignoreFields?: string[],
  map?: {
    key?: string,
    category?: string,
  }
}

export interface I18nLoadOptions extends I18nFetchOptions {
  fetch: boolean
}

export interface I18nData {
  [key: string]: Record<string, string>
}

const TemplateOptions = {
  open: '#{',
  body: '[a-z@$#-_?!]+',
  close: '}'
}

function format(data: any) {
  const flat_data: I18nData = {}

  // Iterate over locales
  Object.keys(data).forEach((locale) => {

    const locale_data = data[locale]

    // Iterate over categories
    Object.keys(locale_data).forEach((category) => {
      const category_data = locale_data[category]

      // Iterate over keys
      Object.keys(category_data).forEach((key) => {
        // Replace #{} variables with data of the same category
        category_data[key] = template2(category_data[key], category_data, TemplateOptions)
        // Replace markdown to HTML tags
        category_data[key] = kramed.inlineLexer(category_data[key], [], { gfm: false })
        // unescape special chars
        category_data[key] = html.unescape(category_data[key])
      })
    })

    flat_data[locale] = flat(data[locale])
  })

  return flat_data
}

/**
 * Fetch locales to Airtables grouped by locale
 */
export async function fetch(options: I18nFetchOptions) : Promise<I18nData> {
  const table = new Airtable({ apiKey: options.apiKey }).base(options.appId)

  options.ignoreFields = Array.isArray(options.ignoreFields) ? options.ignoreFields : [ 'ID', 'key', 'description', 'category' ]

  options.map = options.map || {}
  options.map.key = 'key'
  options.map.category = 'category'

  const result = await table(options.tab)
  .select({ view: options.view })
  .all()
  .then(records => {
    const locales = Object.keys(omit(records[0].fields, ...options.ignoreFields))
    const data: any = {}

    locales.forEach((locale) => {
      records.forEach((record: any) => {
        const key = record.get(options.map.key)
        const category = record.get(options.map.category)

        const localeObj   = data[locale]        = data[locale] || {}
        const categoryObj = localeObj[category] = localeObj[category] || {}

        categoryObj[key] = record.get(locale) || `${locale}.${category}.${key}`
        categoryObj[key] = categoryObj[key].trim()
      })
    })

    const flat_data: I18nData = format(data)

    if (options.output) {
      Fs.writeFileSync(options.output, JSON.stringify(flat_data, null, 2))
    }

    return flat_data
  }).catch(console.log)

  console.log('[i18n] Locales loaded')
  return result ? result : {}
}

/**
 * Load locales
 *
 * If no output file found or the fetch option is true, a call to airtable is done
 */
export async function load(options: I18nLoadOptions) {
  if (!options.fetch) {
    try {
      console.log(`[i18n] Reading "${options.output}" ...`)
      const flat_data = Fs.readFileSync(options.output, 'utf-8')
      return JSON.parse(flat_data) as I18nData
    } catch (e) {
      console.log(`[i18n] Can't parse "${options.output}"`)
    }
  }

  console.log('[i18n] Load locales from Airtable')
  return fetch(options)
}