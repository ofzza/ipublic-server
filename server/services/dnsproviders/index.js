// DNS providers integration
// -----------------------------------------------------------------------------

// Load dependencies
const config      = require('../').config,
      cloudflare  = require('./cloudflare');

module.exports = async (ipreg) => {
  const result = [];

  try {
    // Check if syncing with cloudflare
    const providers = ipreg.ipublic.providers.filter((p) => {
      return (p.provider === 'cloudflare.com');
    });
    if (providers && providers.length) { 
      for (const provider of providers) {
        result.push(await cloudflare(ipreg, provider));
      }
    }
  } catch (err) { throw err; }

  return result;
}
