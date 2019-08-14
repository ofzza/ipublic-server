// Server main entry point
// -----------------------------------------------------------------------------

// Load static dependencies
const config  = require('./services').config;

// Run server
(async () => {

  // Catch rejected, awaited promises
  try {

    // Initialize configuratoin
    try {
      await config.load();
    } catch (err) { throw err; }

    // Load IPublic configurations
    try {
      const IPublic = require('./data').IPublic;
      await IPublic.init();
    } catch (err) { throw err; }

    // Load IPublic registrations
    try {
      const IPublicRegistration = require('./data').IPublicRegistration;
      await IPublicRegistration.init();
    } catch (err) { throw err; }

    // Register DNS providers listening for IPublicRegistration changes
    try {
      const IPublicRegistration = require('./data').IPublicRegistration,
            dnsproviders = require('./services/').dnsproviders;
      IPublicRegistration.addListener(dnsproviders);
    } catch (err) { throw err; }

    // Initialize HTTP server
    try {
      const api = require('./api');
      await api.init();
    } catch (err) { throw err; }

    // Initialize DNS server
    try {
      const dns = require('./services').dns;
      await dns.init();
    } catch (err) { throw err; }

  } catch (err) {
    console.error(err.message);
    console.error(err.stack);
    throw err;
  }

  // Handle unhandled errors
  process.on('unhandledRejection', (err) => {
    console.error(err.message);
    console.error(err.stack);
    throw err;
  });

})()
