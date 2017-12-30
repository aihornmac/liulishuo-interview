module.exports = config => {
  const path = require('path');
  const os = require('os');
  const chalk = require('chalk');
  const _ = require('lodash');
  const webpack = require('webpack');
  const ProgressBarPlugin = require('progress-bar-webpack-plugin');
  const WebpackMd5Hash = require('webpack-md5-hash');
  const Visualizer = require('webpack-visualizer-plugin');
  const HappyPack = require('happypack');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  const node_modules = path.resolve(config.dir.root, 'node_modules');

  const postcssPlugins = [
    require('autoprefixer')({
      browsers: ['last 3 versions', '> 1%']
    }),
    require('postcss-pxtorem')({
      rootValue: 16,
      propWhiteList: [],
    }),
    require('css-mqpacker'),
    require('postcss-nested'),
    require('postcss-discard-comments')({
      removeAll: true
    }),
    require('cssnano'),
  ];

  return {
    target: 'web',
    devtool: 'source-map',
    context: config.dir.source,
    entry: {
      main: ['./entry']
    },
    output: {
      path: path.resolve(config.dir.build, config.webpack.outputDir),
      publicPath: config.webpack.publicPath,
      filename: '[name].[chunkhash].js',
      chunkFilename: '[id].[chunkhash].js',
      sourceMapFilename: 'sourcemaps/[file].map',
    },
    resolve: {
      extensions: ['.web.js', '.js', '.json'],
      alias: {
        styles: path.resolve(config.dir.source, 'styles'),
        static: path.resolve(config.dir.root, 'static'),
        images: path.resolve(config.dir.root, 'static/images'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(jpe?g|png|gif|mp3|ogg|wav|ogv|mov|mp4|svg|ttf|eot|woff|tsv)/,
          loader: 'file-loader',
          options: {
            limit: 2000
          }
        },
        {
          test: /\.jsx?$/,
          exclude: [
            node_modules
          ],
          // loader: 'babel-loader',
          loader: 'happypack/loader?id=js',
        },
        {
          name: 'sass',
          test: /\.s(a|c)ss$/,
          exclude: [
            node_modules
          ],
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                context: '/',
                modules: true,
                importLoaders: 1,
                localIdentName: '[hash:base64]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: postcssPlugins,
              },
            },
            'sass-loader',
          ]
        },
        {
          name: 'css',
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: postcssPlugins,
              },
            },
          ]
        }
      ]
    },
    plugins: _.filter([
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.HashedModuleIdsPlugin(),
      new WebpackMd5Hash(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        },
      }),
      new HappyPack({
        id: 'js',
        threads: os.cpus().length,
        loaders: ['babel-loader'],
      }),
      new HtmlWebpackPlugin({
        title: `流利说面试 - 发送短信`
      }),
      new Visualizer({
        filename: './stats.html',
      }),
      new ProgressBarPlugin({
        format: `${chalk.blue.bold('Building client bundle')} [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
        renderThrottle: 100,
        summary: false,
        customSummary: t => console.log(chalk.blue.bold(`Built client in ${t}.`)) // eslint-disable-line no-console
      }),
    ])
  };
};
