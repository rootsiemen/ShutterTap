// Metro configuration for this Expo prebuild project.
// Uses Expo's defaults (which wrap React Native's) so the Expo virtual
// entry (".expo/.virtual-metro-entry") and asset extensions resolve.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
