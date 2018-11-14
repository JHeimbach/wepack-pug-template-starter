const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function loadView () {
  const fs = require('fs')

  let configs = [];

  fs.readdirSync('./src/views').forEach( file => {
    let fileParts = file.split('.');
    if (fileParts.length === 2 && fileParts[1] === 'pug' && file.indexOf('_') !== 0) {
      configs.push(new HtmlWebpackPlugin({
        filename: fileParts[0] + '.html',
        template: './views/' + file
      }))
    }
  })

  return configs;
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env']
            }
          }
        ]
      },
      {
        test: /.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        use: [
          'html-loader',
          {
            loader: 'pug-html-loader',
            options: {
              data: require('./src/views/data')
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: 'file-loader',
              name: '[name].[ext]',
              outputPath: 'img/'
            }
          },
          {
            loader: 'img-loader',
            options: {
              plugins: [
                require('imagemin-gifsicle')({}),
                require('imagemin-mozjpeg')({}),
                require('imagemin-optipng')({}),
                require('imagemin-svgo')({})
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }),
    new CleanWebpackPlugin(['dist']),
  ].concat(loadView())

}
