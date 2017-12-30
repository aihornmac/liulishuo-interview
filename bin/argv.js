const yargs = require('yargs');

const { argv } = yargs
  .command(
    'build',
    'build client && server code',
    y => y.reset()
      .strict()
      .string('config')
      .nargs('config', 1)
      .describe('config', 'custom configuration file path')
      .boolean('production')
      .describe('production', 'set process.env.NODE_ENV to production')
      .string('output-dir')
      .nargs('output-dir', 1)
      .describe('output-dir', 'set output directory')
  )
  .strict()
  .string('config')
  .nargs('config', 1)
  .describe('config', 'custom configuration file path')
  .number('port')
  .describe('port', 'port')
  .string('host')
  .describe('host', 'host')
  .help('h')
  .alias('h', 'help')
  ;

module.exports = argv;
