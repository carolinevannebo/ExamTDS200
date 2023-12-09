// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */

module.exports = (async () => {
    const {
      resolver: { sourceExts, assetExts },
    } = await getDefaultConfig(__dirname);
  
    return {
      transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
        assetPlugins: ['expo-asset/tools/hashAssetFiles'],
      },
      resolver: {
        assetExts: [...assetExts, 'svg'],
        sourceExts: [...sourceExts, 'cjs', 'svg'],
      },
    };
  })();

/*const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('cjs');
config.resolver.sourceExts.push('svg');
//config.resolver.assetExts.filter((ext) => ext !== 'svg');

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

module.exports = config;*/
