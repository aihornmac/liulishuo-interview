/* eslint-disable no-console */

const webpack = require('webpack');

class BuildClient {
  constructor (webpackConfig) {
    this.webpackConfig = webpackConfig;
  }

  run () {
    const { webpackConfig } = this;
    const compiler = webpack(webpackConfig);

    compiler.run((err, stats) => {
      if (err) {
        return console.error(err);
      }
      const message = stats.toString({
        colors: true,
        chunks: false
      });
      console.log(message);
    });
  }
}

module.exports = BuildClient;
