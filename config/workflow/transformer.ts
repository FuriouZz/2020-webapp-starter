import ts from "typescript";
import { WKConfig } from "./types";
import Fs from "fs";
import { render_template } from "./ejs-loader";

/**
 * [WIP] Experiment the possibility to resolve path or read text file on fly via Typescript transformer
 */
export function TransformersFactory(config: WKConfig) {
  return function Transformers(program: ts.Program) {
    return {
      before: [
        CommonFactory( config, program )
      ]
    }
  }
}

function CommonFactory(config: WKConfig, program: ts.Program) {

  const regex = {
    read: { match: /^@read:/, replace: /^@read:/g },
    asset_path: { match: /^@asset_path:/, replace: /^@asset_path:/g },
    asset_url: { match: /^@asset_url:/, replace: /^@asset_url:/g },
    ejs: { match: /^@ejs:/, replace: /^@ejs:/g }
  }

  const files = {}

  function read_file(path) {
    let content = files[path]
    if (!content) {
      path = config.assets.resolve.source(path, true)
      content = files[path] = Fs.readFileSync(path, { encoding: 'utf-8' })
    }
    return content
  }

  return function AssetTransformer(context: ts.TransformationContext) {
    function visitor(node: ts.Node) {
      // Print asset_path
      if ((ts.isStringLiteral(node) || ts.isStringTextContainingNode(node)) && node.text.match(regex.asset_path.match)) {
        const path = node.text.replace(regex.asset_path.replace, '').trim()
        return ts.createLiteral(config.assets.resolve.path(path))
      }

      // Print asset_url
      if ((ts.isStringLiteral(node) || ts.isStringTextContainingNode(node)) && node.text.match(regex.asset_url.match)) {
        const path = node.text.replace(regex.asset_url.replace, '').trim()
        return ts.createLiteral(config.assets.resolve.url(path))
      }

      // Read file
      if ((ts.isStringLiteral(node) || ts.isStringTextContainingNode(node)) && node.text.match(regex.read.match)) {
        const path = node.text.replace(regex.read.replace, '').trim()
        return ts.createLiteral(read_file(path))
      }

      // EJS
      if ((ts.isStringLiteral(node) || ts.isStringTextContainingNode(node)) && node.text.match(regex.ejs.match)) {
        const content = node.text.replace(regex.ejs.replace, '').trim()
        return ts.createLiteral(render_template(`<%= ${content} %>`, config.ejs))
      }

      return ts.visitEachChild(node, visitor, context)
    }

    return function visit(node: ts.Node) {
      return ts.visitNode(node, visitor)
    }
  }
}
