// IPublic configuration class
// -----------------------------------------------------------------------------

// Load dependencies
const path    = require('path'),
      fs      = require('fs-extra'),
      toml    = require('toml'),
      config  = require('../../services/').config;

// Holds all stored IPublic instances
let instances = null;

// IPublic data model
class IPublic {

  /**
   * Gets all existing IPublic instances
   * @readonly
   * @static
   */
  static async getInstances (key = null) {
    try {
      return (instances || (instances = await load())).filter((ipublic) => {
        return (key === null) || (ipublic.key === key);
      });
    } catch (err) { throw err; }
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
          ipubs = [];
    for (const file of ipublicFiles) {
      if (path.basename(file).substr(-1 * '.ipublic.toml'.length) === '.ipublic.toml') {
        ipubs.push(
          new IPublic(toml.parse((await fs.readFile(file)).toString()))
        );
      }
    }
    return ipubs;
  } catch (err) { throw err; }
}
