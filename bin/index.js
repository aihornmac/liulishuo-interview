/* eslint-disable no-console */

const path = require('path');
const _ = require('lodash');
const ARGV = require('./argv');
const getConfig = require('../config');

main(ARGV);

function main (argv) {
  const command = argv._[0];
  if (command === 'build') {
    build(argv);
  } else {
    dev(argv);
  }
}

function build (argv) {
  if (argv.production) {
    process.env.NODE_ENV = 'production';
  }

  let contextualConfig = {};
  if (argv.config) {
    contextualConfig = loadConfigFromFile(argv.config);
  }
  const config = getConfig(contextualConfig);

  if (argv.outputDir) {
    _.set(config, 'dir.build', argv.outputDir);
  }

  const webpackConfig = require('../config/webpack/client')(config);
  const webpackProdConfig = require('../config/webpack/client.prod')(config, webpackConfig);
  const BuildClient = require('./build');
  const buildClient = new BuildClient(webpackProdConfig);

  buildClient.run();
}

function dev (argv) {
  let contextualConfig = {};
  if (argv.config) {
    contextualConfig = loadConfigFromFile(argv.config);
  }
  const config = getConfig(contextualConfig);

  if (argv.host) {
    _.set(config, 'network.host', argv.host);
  }
  if (argv.port) {
    _.set(config, 'network.port', argv.port);
  }

  const webpackConfig = require('../config/webpack/client')(config);
  const webpackDevConfig = require('../config/webpack/client.dev')(config, webpackConfig);
  const devServerConfig = require('../config/webpack/devServer')(config);
  const DevelopmentServer = require('./dev');
  const devServer = new DevelopmentServer(webpackDevConfig, devServerConfig);

  devServer.run();
}

function loadConfigFromFile (filePath) {
  const fullFilePath = path.resolve(
    process.cwd(),
    filePath
  );

  try {
    require.resolve(fullFilePath);
  } catch (e) {
    console.error(`cannot resolve "${filePath}" from "${process.cwd()}", are you sure the file exists?`);
    return;
  }

  return require(fullFilePath);
}
