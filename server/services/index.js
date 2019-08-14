// Services
// -----------------------------------------------------------------------------

module.exports = {

  // Export configuration service
  get config () { return require('./config'); },

  // Export DNS server service
  get dns () { return require('./dns'); },

  // Export DNS provider integration service
  get dnsproviders () { return require('./dnsproviders'); },

};
