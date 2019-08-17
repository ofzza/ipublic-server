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
                return (`
                  <li>
                    <h3>${ipreg.key}</h3>
                    Registered value: <strong>${ipreg.ip}</strong> (${(new Date(ipreg.mtime)).toString()})
                    <br/><br/>
                    <h4>Local DNS records</h4>
                    <br/>
                    ${ipreg.ipublic.dns.map((dns) =>  {
                      return (`
                        ${dns.type} ${dns.name} ${dns.value || `<strong>${ipreg.ip}</strong>`} ${dns.ttl}s
                      `);
                    }).join('<br/>')}
                    <br/><br/>
                    <h4>Synced DNS providers</h4>
                    ${Object.values(ipreg.ipublic.providers).map((provider) => {
                      return (`
                        <h5>${provider.provider}</h5>
                        ${provider.dns.map((dns) =>  {
                          return (`
                            ${dns.type} ${dns.name} <strong>${ipreg.ip}</strong> ${dns.ttl}s
                          `);
                        }).join('<br/>')}
                      `);
                    }).join('<br/>')}
                    <br/>
                  </li>
                `)
              })
              .join()
          }
          </ul>
        `)
        .code(200);
    }
  }
];
