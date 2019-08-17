// IPublic registration class
// -----------------------------------------------------------------------------

// Load dependencies
const path    = require('path'),
      fs      = require('fs-extra'),
      toml    = require('toml'),
      config  = require('../../services').config,
      IPublic = require('../').IPublic;

// Holds all stored IPublic registration instances
let instances = {};
// Holds all registered update listeners
const listeners = [];

// IPublic data model
class IPublicRegistration {

  static async init () {
    try {
      instances = await load();
    } catch (err) { throw err; }
  }

  static get all () { return Object.values(instances); }
  static getInstance (key = null) {
    const found = Object.values(instances).filter((ipreg) => {
      return (ipreg.key === key);
    });
    return (found && found.length ? found[0] : null);
  }

  static addListener (listenerFn) {
    listeners.push(listenerFn);
  }

  constructor ({
    key = null,
    ip = null,
    ctime = Date.now(),
    mtime = Date.now()
  } = {}) {

    // Store properties
    if (key !== null) { this.key = key; }
    if (ip !== null) { this.ip = ip; }
    if (ctime !== null) { this.ctime = ctime; }
    if (mtime !== null) { this.mtime = mtime; }

    // Add to all instances
    if (key && !instances[key]) {
      instances[key] = this;
    }

  }

  get ipublic () { return IPublic.getInstance(this.key); }

  async update (ip) {
    // Update registration
    if (true||this.ip !== ip) {
      // Store changes
      this.ip = ip;
      this.mtime = Date.now();
      save(instances);
      // Notify listeners
      const result = [`Registered IP change: ${ip}`];
      for (const listenerFn of listeners) {
        try {
          const results = await listenerFn(this);
          for (const r of results) { result.push(r); }
        } catch (err) { throw err; }
      }
      return result;
    } else {
      return 'IP unchanged.'
    }
  }

}

// Export data model
module.exports = IPublicRegistration;

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
        if (ipreg.ipublic) {
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
