const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.transformer.getTransformOptions=async()=>({transform:{experimentalImportSupport:false,inlineRequires:false}});
config.resolver.assetExts=[...config.resolver.assetExts,'cjs'];
module.exports=config;