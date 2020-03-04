import stylus from "stylus";
import { WKConfig } from "./types";

export function StylusPluginFactory( config: WKConfig ) {

  const nodes  = stylus.nodes

  return function(styl: any) {

    const filename = styl.options.filename

    function asset_path(p: string) {
      return config.assets.resolve.path(p, filename)
    }

    function asset_url(p: string) {
      return config.assets.resolve.url(p, filename)
    }

    styl.define('asset_path', function( strObject ) {
      return new nodes.Literal('url("' + asset_path( strObject.string ) + '")')
    })

    styl.define('asset_path_src', function( strObject ) {
      return new nodes.Literal(asset_path( strObject.string ))
    })

    styl.define('asset_url', function( strObject ) {
      return new nodes.Literal('url("' + asset_url( strObject.string ) + '")')
    })

    styl.define('asset_url_src', function( strObject ) {
      return new nodes.Literal(asset_url( strObject.string ))
    })

  }

}