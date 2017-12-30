const path = require('path');

module.exports = {
  dir: {
    root: path.resolve(__dirname, '../'),
    source: path.resolve(__dirname, '../src'),
    build: path.resolve(__dirname, '../dist'),
  },
  network: {
    host: '0.0.0.0',
    port: 50091,
  },
  webpack: {
    outputDir: 'assets',
    publicPath: 'assets/',
    cleanOutputBeforeBuild: true,
  },
  webpackDevServer: {
    publicPath: '/assets/',
    HMRPublicPath: '/sockjs-node',
  },
};
