/* eslint-disable no-console */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');

class DevelopmentServer {
  constructor (webpackConfig, devServerConfig) {
    this.webpackConfig = webpackConfig;
    this.devServerConfig = devServerConfig;
  }

  run () {
    const { webpackConfig, devServerConfig } = this;
    const clientCompiler = webpack(webpackConfig);

    const clientDevServer = new WebpackDevServer(
      clientCompiler,
      devServerConfig
    );

    clientDevServer.listen(
      devServerConfig.port,
      devServerConfig.host,
      () => {
        // get real address info
        const address = clientDevServer.listeningApp.address();
        const message = chalk.yellow(
          `\nWebpack Dev Server listening at ${address.address}:${address.port}\n`
        );
        console.log(message);
      }
    );
  }
}

module.exports = DevelopmentServer;
