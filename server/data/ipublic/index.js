// IPublic configuration class
// -----------------------------------------------------------------------------

// Load dependencies
const path    = require('path'),
      fs      = require('fs-extra'),
      toml    = require('toml'),
      config  = require('../../services/').config;

// Holds all stored IPublic instances
let instances = {};

// IPublic data model
class IPublic {

  static async init () {
    try {
      instances = await load();
    } catch (err) { throw err; }
  }

  static get all () { return Object.values(instances); }
  static getInstance (key = null) {
    const found = Object.values(instances).filter((ipublic) => {
      return (ipublic.key === key);
    });
    return (found && found.length ? found[0] : null);
  }

  constructor ({
    key = null,
    auth = [],
    dns = []
  } = {}) {

    // Store properties
    if (key !== null) { this.key = key; }
    if (auth !== null) { this.auth = auth; }
    if (dns !== null) { this.dns = dns; }

  }

}

// Export data model
module.exports = IPublic;

/**
 * Loads IPublic instances' files
 */
async function load () {
  try {
    const storagePath = config.ipublic.path;
    await fs.ensureDir(storagePath);
    const ipublicFiles = (await fs.readdir(storagePath)).map((file) => { return path.join(storagePath, file); }),
          result = {};
    for (const file of ipublicFiles) {
      if (path.basename(file).substr(-1 * '.ipublic.toml'.length) === '.ipublic.toml') {
        const ipublic = new IPublic(toml.parse((await fs.readFile(file)).toString()));
        result[ipublic.key] = ipublic;
      }
    }
    return result;
  } catch (err) { throw err; }
}
