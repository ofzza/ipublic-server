// IPublic registration class
// -----------------------------------------------------------------------------

// Load dependencies
const IPublic = require('../').IPublic;

// IPublic data model
class IPublicRegistration {

  constructor ({
    key = null,
    ip = null,
    time = Date.now()
  } = {}) {

    // Store properties
    if (key !== null) { this.key = key; }
    if (ip !== null) { this.ip = ip; }
    if (time !== null) { this.time = time; }

  }

  async getIPublic () {
    const ipublics = await IPublic.getInstances(this.key);
    return (ipublics && ipublics.length ? ipublics[0] : null);
  }

}

// Export data model
module.exports = IPublicRegistration;
