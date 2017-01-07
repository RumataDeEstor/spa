let path = require('path');

module.exports = {
  entry: path.join(__dirname, "public", "index.js"),
  output: {
    path: path.join(__dirname, "public", "build"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.css$/, loader: 'style!css' }
    ]
  }
}
