// DNS providers integration
// -----------------------------------------------------------------------------

// Load dependencies
const config      = require('../').config,
      cloudflare  = require('./cloudflare');

module.exports = async (ipreg) => {
  try {
    // Check if syncing with cloudflare
    if (config.dnsproviders.cloudflare.sync) { await cloudflare(ipreg); }
  } catch (err) { throw err; }
}
