// HAPI HTTP server service
// -----------------------------------------------------------------------------

// Load dependencies
const Hapi    = require('@hapi/hapi'),
      config  = require('../services').config;

// Get HTTP route handlers
const routes = [
  // IPublic registration route
  ...require('./routes/ipublic-register'),
  // IPublic management route
  ...require('./routes/ipublic-manage')
];

module.exports.init = async () => {
  try {
    const server = Hapi.server({
        port: config.httpserver.port,
        host: config.httpserver.interface
    });
    for (const route of routes) {
      server.route(route);
    }
    await server.start();
  } catch (err) { throw err; }
};
