// HAPI HTTP server IPublic management route definitsion
// -----------------------------------------------------------------------------

// Load dependencies
const config      = require('../../../services').config,
      ipregistry  = require('../../../services').ipregistry;
      IPublic     = require('../../../data').IPublic;

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
            ipregistry
              .list()
              .map((reg) => {
                return `<li>${reg.key}: ${reg.ip}, ${(new Date(reg.time)).toString()}</li>`
              })
              .join()
          }
          </ul>
        `)
        .code(200);
    }
  }
];
