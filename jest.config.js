module.exports = {
  preset: '@react-native/jest-preset',
  // The RN preset ignores everything in node_modules except react-native
  // packages, which leaves PNG assets required by @react-navigation/elements
  // untransformed (SyntaxError: Invalid or unexpected token). Allow-listing
  // @react-navigation lets the preset's assetFileTransformer handle them.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation)/)',
  ],
};
