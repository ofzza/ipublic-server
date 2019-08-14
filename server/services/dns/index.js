// DNS server service
// -----------------------------------------------------------------------------

// Load dependencies
const dnsd                = require('dnsd'),
      config              = require('../').config,
      IPublicRegistration = require('../../data').IPublicRegistration;

module.exports.init = async () => {
  try {
    const server = dnsd.createServer(dnsRequestHandlerFn);
    server.listen(
      config.dnsserver.port,
      config.dnsserver.interface
    )
  } catch (err) { throw err; }
};

async function dnsRequestHandlerFn (req, res) {
  try {
    if ((req.opcode === 'query') && (req.question.length)) {
      const record = req.question[0];

      // Search for registered IPublic record with requested domain
      const found = IPublicRegistration.all
        .find((ipreg) => {
          if (ipreg.ipublic && ipreg.ipublic.dns && ipreg.ipublic.dns.length) {
            const matched = ipreg.ipublic.dns.find((dns) => {
              return (dns.type === record.type) && (dns.name === record.name);
            });
            return !!matched;
          } else {
            return false;
          }
        });

      // Resolve IP
      res.end(found ? found.ip : null);

    }
  } catch (err) { throw err; }
}
