import { loader } from "webpack";
import Path from "path";
import Fs from "fs";
import template from "lodash.template";
import { TemplateOptions, Dictionary } from "lodash";
import FM from "front-matter";
import { merge } from "lol/js/object";

export type EJSHelper = (this: EJSLoaderContext) => (...args: any[]) => any

export interface EJSOptions extends TemplateOptions {
  data?: object,
  helpers?: Dictionary<EJSHelper>
}

export interface EJSLoaderContext {
  context: loader.LoaderContext,
  options: EJSOptions,
  source: string
}

interface IFrontMatterAttributes {
  layout: string,
  content: string,
  page: string,
  [key: string]: any
}

export function render_template(source: string, options: EJSOptions = {}) {
  return template(source, {
    escape: options.escape,
    evaluate: options.evaluate,
    imports: options.imports,
    interpolate: options.interpolate,
    sourceURL: options.sourceURL,
    variable: options.variable
  })(options.data)
}

function render(this: EJSLoaderContext) {
  const source = this.source
  const options = this.options
  const context = this.context

  if (!FM.test(source)) {
    return render_template(source, options)
  }

  let template: string

  // Render front-matter with data
  const fm_rendered = FM<IFrontMatterAttributes>(source)
  template = render_template(fm_rendered.frontmatter, options)
  const fm_attrs_rendered = FM<IFrontMatterAttributes>(`---\n${template}\n---`)

  // Merge attributes with EJS data
  options.data['layout'] = null
  options.data['content'] = fm_rendered.body
  options.data['page'] = Path.basename(context.resourcePath).split('.')[0]
  options.data = merge(options.data, fm_attrs_rendered.attributes)

  if (options.data.hasOwnProperty('layout') && typeof options.data['layout'] == "string") {
    const dirname = Path.dirname(this.context.resourcePath)
    const layout_path = Path.resolve(dirname, options.data['layout'])
    this.context.addDependency(layout_path)
    const layout = Fs.readFileSync(layout_path, 'utf-8')
    template = render_template(layout, options)
  }

  return render_template(template, options)
}

function add_helpers(this: EJSLoaderContext) {
  const self = this

  const _internals = {
    include: function(path: string) {
      const dirname = Path.dirname(self.context.resourcePath)
      const resolved_path = Path.resolve(dirname, path)
      self.context.addDependency( resolved_path )
      var source = Fs.readFileSync(resolved_path, 'utf-8')
      return render_template(source, self.options)
    }
  }

  Object.keys(this.options.helpers).forEach((key) => {
    const helper = this.options.helpers[key]
    this.options.imports[key] = helper.call(self)
  })

  this.options.imports.include = _internals.include
}

export default function EJSLoader(this: loader.LoaderContext, source: string | Buffer) {
  let options: EJSOptions = (typeof this.query == 'object' && this.query) ? this.query : {}

  options.imports = options.imports || {}
  options.helpers = options.helpers || {}
  options.data    = options.data || {}

  const loader: EJSLoaderContext = {
    context: this,
    options,
    source: source as string
  }

  add_helpers.call(loader)
  const result = render.call(loader)

  return "module.exports = " + JSON.stringify(result)
}