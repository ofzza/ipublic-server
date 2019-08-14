// HAPI HTTP server IPublic register route definitsion
// -----------------------------------------------------------------------------

// Load dependencies
const config      = require('../../../services').config;
      ipregistry  = require('../../../services').ipregistry;
      IPublic     = require('../../../data').IPublic;

// Route definition
module.exports = [
  {
    method: config.httpserver.ipublic.registration.method,
    path:   config.httpserver.ipublic.registration.path,
    handler: async (request, h) => {
      
      // Find IPublic being registered
      const key = request.payload.key,            
            ipublics = await IPublic.getInstances(key);
      if (!ipublics || (ipublics.length !== 1)) {
        return h.response(`Key ${key} not allowed!`).code(500)
      }
      const ipublic = ipublics[0],
            auth = request.payload.auth;
      if ((ipublic.auth.indexOf(auth) === -1) && (config.ipublic.auth.indexOf(auth) === -1)) {
        return h.response(`Failed authenticating!`).code(500)
      }
      // Register updaed IP
      const remoteIP = request.info.remoteAddress;
      ipregistry.register(ipublic, remoteIP);
      // Return registered
      return 'ok';
    }
  }
];
