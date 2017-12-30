const url = require('url');
const _ = require('lodash');

module.exports = config => {
  const { publicPath } = config.webpackDevServer;

  return {
    host: _.get(config, 'network.host'),
    port: _.get(config, 'network.port'),
    compress: true,
    hot: true,
    inline: true,
    publicPath,
    disableHostCheck: true,
    historyApiFallback: {
      index: url.resolve(publicPath, 'index.html'),
      rewrites: [
        { from: /^\/sw\.js$/, to: url.resolve(publicPath, 'sw.js') },
        { from: /^\/sourcemaps\/sw\.js\.map$/, to: url.resolve(publicPath, 'sourcemaps/sw.js.map') },
      ],
    },
  };
};
