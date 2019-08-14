// DNS server service
// -----------------------------------------------------------------------------

// Load dependencies
const dnsd        = require('dnsd'),
      config      = require('../').config,
      ipregistry  = require('../').ipregistry;

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
      const record = req.question[0]
      if (record.type === 'A') {
        const domain = record.name;

        // Search for registered IPublic record with requested domain
        const ipregs = {},
              ipublics = {};
        for (const ipreg of ipregistry.list()) {
          const key = ipreg.key;
          ipregs[key] = ipreg;
          ipublics[key] = await ipreg.getIPublic();
        }
        const ipublic = Object.values(ipublics)
          .find((ipublic) => {
            if (ipublic.dns && ipublic.dns.length) {
              return (ipublic.dns.indexOf(domain) !== -1)
            } else {
              return false;
            }
          })
        if (ipublic) {
          // Resolve IP
          res.end(ipregs[ipublic.key].ip);
        } else {
          // Fail resolving
          res.end();
        }

      }
    }
  } catch (err) { throw err; }
}
