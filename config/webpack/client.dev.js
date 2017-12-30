const _ = require('lodash');
const webpack = require('webpack');

module.exports = (CONF, config) => {
  config = _.cloneDeep(config);

  // inject webpack HMR
  _.set(config, 'entry.main',
    _.concat(
      [
        'react-hot-loader/patch',
        `webpack-dev-server/client?${CONF.webpackDevServer.HMRPublicPath || '/sockjs-node'}`,
        'webpack/hot/dev-server'
      ],
      _.get(config, 'entry.main')
    )
  );

  // adjust output options
  _.set(config, 'output.pathinfo', true);
  _.set(config, 'output.filename', '[name].[hash].js');

  // hide performance warnings
  _.set(config, 'performance.hints', false);

  // sass css local name
  {
    const sass = _.find(
      _.get(config, 'module.rules'),
      { name: 'sass' }
    );

    _.unset(sass, 'name');

    _.set(
      _.find(
        _.get(sass, 'use'),
        { loader: 'css-loader' }
      ),
      'options.localIdentName',
      '[local]_[hash:base64:5]'
    );

    const css = _.find(
      _.get(config, 'module.rules'),
      { name: 'css' }
    );

    _.unset(css, 'name');
  }

  // add assets plugin
  _.set(config, 'plugins',
    _.union(
      _.get(config, 'plugins'),
      [
        new webpack.HotModuleReplacementPlugin()
      ]
    )
  );

  return config;
};
