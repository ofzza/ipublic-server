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
      for (const ipreg of IPublicRegistration.all) {
        // Search for matching DNS record
        const dns = ipreg.ipublic.dns.find((dns) => {
          return (dns.type === record.type) && (dns.name === record.name);
        });
        // If matched DNS record, resolve either preset record value or registered IPublic IP
        if (dns) {
          res.answer.push({
            type: dns.type,
            name: dns.name,
            data: (dns.value || ipreg.ip),
            ttl:  dns.ttl
          });
          return res.end();
        }
      }

      // Resolve resolution failed
      res.end();

    }
  } catch (err) { throw err; }
}
