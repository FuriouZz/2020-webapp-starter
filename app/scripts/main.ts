async function main() {
  // Transformers (see: config/workflow/transformer.ts)

  // Get asset path, give relative path
  // WARN: The parameter is a key, not a path. Do not set a relative path. See tmp/manifest-assets.json
  console.log("ASSET_PATH:", "@asset_path: assets/flags.png")

  // Get asset url, give an absolute path (if a host given else works like asset_path)
  // WARN: The parameter is a key, not a path. Do not set a relative path. See tmp/manifest-assets.json
  console.log("ASSET_URL:", "@asset_url: assets/flags.png")

  // Print environment name
  console.log("ENV NAME:", "@ejs: global.environment.name")

  // Print commit
  console.log("CURRENT_COMMIT:", "@ejs: global.environment.commit")

  // Print all EJS variables
  console.log("GLOBAL_OBJECT:", JSON.parse("@ejs: JSON.stringify(global)"))
}

window.addEventListener('DOMContentLoaded', main)