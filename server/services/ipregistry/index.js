// IP registry service
// -----------------------------------------------------------------------------

// Load dependencies
const path                = require('path'),
      fs                  = require('fs-extra'),
      config              = require('../').config,
      IPublic             = require('../../data').IPublic,
      IPublicRegistration = require('../../data').IPublicRegistration;

// Initialize registry
let storage = {};

/**
 * IP Registry class
 * @class IPRegistry
 */
module.exports = class IPRegistry {

  static async init () {
    try {
      storage = await load();
    } catch (err) { throw err; }
  }

  static register (ipublic, ip) {
    // Register
    storage[ipublic.key] = new IPublicRegistration({
      ipublic,
      ip
    });
    // Store changes
    try {
      save(storage);
    } catch (err) { throw err; }
  }

  static list () {
    return Object.values(storage);
  }

}

/**
 * Loads IP registry from storage file
 */
async function load () {
  try {
    const storagePath = config.ipublic.path,
          storegeFilename = path.join(storagePath, 'registry.json');
    await fs.ensureFile(storegeFilename);
    const registryContent = (await fs.readFile(storegeFilename)).toString(),
          registry = (registryContent && registryContent.length ? JSON.parse(registryContent) : {}),
          result = {};
    for (const key in registry) {
      const raw = registry[key];
      if (raw.key) {
        const ipreg = new IPublicRegistration(raw);
        if (await ipreg.getIPublic()) {
          result[key] = ipreg;
        }
      }
      
    }
    return result;
  } catch (err) { throw err; }
}

/**
 * Saves IP registry to a storage file
 * @param {*} registry
 */
async function save (registry) {
  try {
    const storagePath = config.ipublic.path,
          storegeFilename = path.join(storagePath, 'registry.json');
    await fs.writeFile(storegeFilename, JSON.stringify(registry, null, 2));
  } catch (err) { throw err; }
}
