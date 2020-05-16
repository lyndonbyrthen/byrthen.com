const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const resolve = require('resolve');
const paths = require('./paths');

const entries = {};
entries['index'] = path.resolve(paths.mainDir, 'index.tsx');
const files = fs.readdirSync(paths.appsDir);
files.forEach(filename=>{
    const {name, ext} = path.parse(filename);
    if (ext === '.tsx') {
        entries[name] = path.resolve(paths.appsDir,filename);
    }
});

module.exports = function () {

  return {
    mode: 'development',
    entry: entries,
    output: {
      // The build folder.
      path: paths.public_html,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: 'js/[name].js',
      futureEmitAssets: true,
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: 'js/[name].chunk.js',
      publicPath: './',
      globalObject: 'this'
    },
    // optimization: {
    //   splitChunks: {
    //     chunks: 'all',
    //   },
    // },
    resolve : {
      modules: ['node_modules'],
      extensions: ['.js','.jsx','.tsx','.ts']
    },
    module: {
      // strictExportPresence: true,
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          loader: require.resolve('babel-loader'),
        },
      ],
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
  };
}