var webpack = require('webpack');

module.exports = {
  entry: [
    './app/index'
  ],
  output: {
    path: __dirname + '/build/',
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
	     compress: {
	         warnings: false
	     }
	 })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx','.css']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['react-hot', 'jsx?harmony'], exclude: /node_modules/ },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.scss$/, loader: "style!css!sass" },
      { test: /.*\.svg$/,loaders: ['file-loader','svgo-loader?useConfig=svgoConfig1'] }
    ]
  },
  svgoConfig1: {
    plugins: [
      {removeTitle: true},
      {convertColors: {shorthex: false}},
      {convertPathData: false}
    ]
  }
};