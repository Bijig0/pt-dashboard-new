const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// Let Metro know where to resolve packages
// Only use scanner's node_modules to avoid pulling in incompatible packages from root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
];

// Force React to resolve from the scanner's node_modules to avoid duplicate instances
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, "node_modules/react"),
  "react-dom": path.resolve(projectRoot, "node_modules/react-dom"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
