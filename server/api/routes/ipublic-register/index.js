// HAPI HTTP server IPublic register route definitsion
// -----------------------------------------------------------------------------

// Load dependencies
const config              = require('../../../services').config;
      IPublic             = require('../../../data').IPublic,
      IPublicRegistration = require('../../../data').IPublicRegistration;

// Route definition
module.exports = [
  {
    method: config.httpserver.ipublic.registration.method,
    path:   config.httpserver.ipublic.registration.path,
    handler: async (request, h) => {
      
      // Find IPublic being registered
      const key = request.payload.key,
            ipublic = IPublic.getInstance(key);
      if (!ipublic) {
        return h.response(`Key ${key} not allowed!`).code(500)
      }
      // Check auth
      const auth = request.payload.auth;
      if ((ipublic.auth.indexOf(auth) === -1) && (config.ipublic.auth.indexOf(auth) === -1)) {
        return h.response(`Failed authenticating!`).code(500)
      }
      // Check if already registered, if not register
      let ipreg = IPublicRegistration.getInstance(key);
      if (!ipreg) { ipreg = new IPublicRegistration({ key }); }
      // Register updated IP
      try {
        const ip = request.payload.ip // Spoofed IP
                || (request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'].split(',')[0] : null) // Reverse proxy
                || request.headers['x-real-ip'] // Reverse proxy, NGINX
                || request.info.remoteAddress; // Request IP
        return await ipreg.update(ip);
      } catch (err) {
        return h.response(err.message).code(500)
      }
    }
  }
];
