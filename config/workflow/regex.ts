export const STYL_REG = /\.styl$/i
export const EJS_REG = /\.ejs$/i
export const TS_REG = /\.(ts|tsx|js|jsx)$/i
export const MJS_REG = /\.(mjs)$/i
export const NO_FILE_EXTRACT_REG = /\.(ts|tsx|js|jsx|styl|json)$/i
export const RAW_REG = /\.(html|svg|vert|frag|glsl)$/i

export const TRANSFORM_REGEX = {
  asset_path: { match: /^@asset_path:/, replace: /^@asset_path:/g, },
  asset_url: { match: /^@asset_url:/, replace: /^@asset_url:/g, },
  ejs: { match: /^@ejs:/, replace: /^@ejs:/g, },
  read: { match: /^@read:/, replace: /^@read:/g, },
}

