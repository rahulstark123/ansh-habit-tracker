const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add custom resolution for native modules that might have issues with path resolution in some environments
config.resolver.sourceExts.push("mjs");

module.exports = config;
