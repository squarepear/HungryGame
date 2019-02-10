var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: {
    main: './src/client/js/client.js'
  },
  output: {
    path: path.resolve('./dist/client/js'),
    filename: 'client.js'
  },
  resolve: {
    alias: {
      p5js: path.resolve('./node_modules/p5/lib'),
      Shared: path.resolve('./src/shared')
    }
  },
  module: {
    noParse: /node_modules\/p5\/lib\/p5.min.js/,
    loaders: [{ loader: 'babel-loader' }]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}
