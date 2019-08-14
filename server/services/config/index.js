// Configuration service
// -----------------------------------------------------------------------------

// Load dependencies
const path    = require('path'),
      fs      = require('fs-extra')
      _       = require('lodash'),
      toml    = require('toml');

// Export configuration object
const config = module.exports = {};

/**
 * Loads configuration files
 */
module.exports.load = async () => {
  try {
    const configFilesDefaults = (await fs.readdir('./config')).map((file) => { return `./config/${file}`; }),
          configFilesLocal    = (await fs.readdir('./config/local')).map((file) => { return `./config/local/${file}`; }) ;
    for (const file of [...configFilesDefaults, ...configFilesLocal]) {
      if (path.extname(file) === '.toml') {
        const domain = path.basename(file, '.toml');
        config[domain] = _.merge(
          (config[domain] || {}),
          toml.parse((await fs.readFile(file)).toString())
        );
      }
    }
  } catch (err) { throw err; }
};
