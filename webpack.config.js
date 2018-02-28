var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    filename: 'public/build/bundle.js',
    sourceMapFilename: 'public/build/bundle.map'
  },
  devtool: '#source-map',
  // instructions for transpiling
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    }]
  }
}


// Webpack version 4 syntax ...close to workin but theres a bug
// const path = require('path')
//
// module.exports = {
//   entry: {
//     app: './src/app.js'
//   },
//   output: {
//     path: path.resolve(__dirname, "public"),
//     filename: 'bundle.js',
//   },
//   devtool: 'source-map',
//   // instructions for transpiling
//   mode: 'development',
//   module: {
//     rules: [{
//       test: /\.jsx?$/,
//       include: path.resolve(__dirname, "/src/app"),
//       exclude: /(node_modules)/,
//       loader: 'babel-loader',
//       query: {
//         presets: ['es2015', 'react']
//       }
//     }]
//   }
// }
