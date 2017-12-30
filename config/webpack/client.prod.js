const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (CONF, config) => {
  config = _.cloneDeep(config);

  // add extract text plugin for sass
  {
    const sass = _.find(
      _.get(config, 'module.rules'),
      { name: 'sass' }
    );

    _.unset(sass, 'name');

    const loaders = _.get(sass, 'use');

    _.set(sass, 'loader', ExtractTextPlugin.extract({
      fallback: loaders[0],
      use: loaders.slice(1),
    }));

    _.unset(sass, 'use');
  }

  // add extract text plugin for css
  {
    const css = _.find(
      _.get(config, 'module.rules'),
      { name: 'css' }
    );

    _.unset(css, 'name');

    const loaders = _.get(css, 'use');

    _.set(css, 'loader', ExtractTextPlugin.extract({
      fallback: loaders[0],
      use: loaders.slice(1),
    }));

    _.unset(css, 'use');
  }

  // add assets plugin
  _.set(config, 'plugins',
    _.concat(
      _.filter([
        _.get(CONF, 'webpack.cleanOutputBeforeBuild') && new CleanWebpackPlugin([
          _.get(config, 'output.path')
        ], {
          root: path.resolve(_.get(config, 'output.path'), '..'),
          verbose: true,
          dry: false
        }),
        new ExtractTextPlugin({
          filename: '[name].[chunkhash].css',
          allChunks: true
        })
      ]),
      _.get(config, 'plugins'),
      _.filter([
        new webpack.NoEmitOnErrorsPlugin(),
        process.env.NODE_ENV === 'production' && new UglifyJSPlugin({
          sourceMap: true,
          parallel: true,
          uglifyOptions: {
            warnings: false,
            compress: true,
          },
        }),
        process.env.NODE_ENV === 'production' && new OptimizeCssAssetsPlugin()
      ])
    )
  );

  return config;
};
