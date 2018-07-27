const webpack = require("webpack");
const path    = require("path");
const nib     = require("nib");

const projectName = "dong";
const src         = "src/";
const dest        = "../public_html/";
module.exports = {
  context: __dirname + '/' + src,
  entry: {
      main: './assets/js/main.js',
  },
  output: {
    path:path.join(__dirname,dest) + "assets/js",
    filename: '[name].js',
    sourcePrefix: '',
    devtoolLineToLine:false,
    pathinfo:false,
    jsonpFunction:projectName,
    publicPath:'/assets/js'
  },
  devtool:"inline-source-map",
  resolve :{
    extensions:['.webpack.js','.web.js','.js']
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader", query:{presets: ['react', 'es2015']}},
      { test : /\.styl$/, exclude: /node_modules/, loaders : ['style-loader', 'css-loader?minimize','stylus-loader']},
      {test:/\.pug$/,exclude:/node_modules/,loader:'pug-loader'},
    ]
  },
  plugins:[
    new webpack.LoaderOptionsPlugin({
      test : /\.styl$/,
      options: {
        stylus: {
          use    : [nib()],
          import : ['~nib/lib/nib/index.styl']
        }
      }
    }),
  new webpack.optimize.UglifyJsPlugin({
      minimize  : true,
      beautify  : false,
      mangle    : {toplevel  : true},
      sourceMap : false,
      comments  : false,
      compress  : { warnings : false },
      output    : { comments : false }
    }),
  ]
};