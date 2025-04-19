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
};