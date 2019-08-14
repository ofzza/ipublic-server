// Services
// -----------------------------------------------------------------------------

module.exports = {

  // Export configuration service
  get config () { return require('./config'); },

  // Export IPs data service
  get dns () { return require('./dns'); },

  // Export IPs data service
  get ipregistry () { return require('./ipregistry'); }

};
