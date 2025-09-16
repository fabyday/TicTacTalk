const path = require('path');

module.exports = {
  mode: 'development',
  target: 'electron-main',
  entry: './src/electron/electron.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
  externals: {
    '@discordjs/opus': 'commonjs @discordjs/opus',
    'node-opus': 'commonjs node-opus',
    'ref': 'commonjs ref',
    'ref-struct': 'commonjs ref-struct',
    'ffi': 'commonjs ffi',
    'ogg-packet': 'commonjs ogg-packet',
    'bindings': 'commonjs bindings'
  },
};