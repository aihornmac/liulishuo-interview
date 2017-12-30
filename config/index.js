const _ = require('lodash');
const defaultConfig = require('./default');

module.exports = contextualConfig => {
  let config = _.cloneDeep(defaultConfig);

  if (typeof contextualConfig === 'function') {
    const result = contextualConfig(config);
    if (typeof result !== 'undefined') {
      config = result;
    }
  } else {
    config = _.merge(config, contextualConfig);
  }

  return config;
};
