// HAPI HTTP server IPublic management route definitsion
// -----------------------------------------------------------------------------

// Load dependencies
const config              = require('../../../services').config,
      IPublicRegistration = require('../../../data').IPublicRegistration;

// Route definition
module.exports = [
  // Get management UI
  {
    method: config.httpserver.ipublic.management.method,
    path:   config.httpserver.ipublic.management.path,
    handler: async (request, h) => {
      return h
        .response(`
          <ul>
          ${
            IPublicRegistration.all
              .map((ipreg) => {
                return `<li>${ipreg.key}: ${ipreg.ip}, ${(new Date(ipreg.time)).toString()}</li>`
              })
              .join()
          }
          </ul>
        `)
        .code(200);
    }
  }
];
