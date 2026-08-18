const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase JS SDK usa una estructura de exports que Metro (desde Expo SDK 53)
// no resuelve bien por defecto. Esto evita el error 500 / "Component auth
// has not been registered yet" al construir el bundle.
config.resolver.unstable_enablePackageExports = false;
config.resolver.sourceExts.push('cjs');

module.exports = config;
