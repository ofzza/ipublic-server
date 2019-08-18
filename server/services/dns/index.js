// DNS server service
// -----------------------------------------------------------------------------

// Load dependencies
const path                = require('path'),
      fs                  = require('fs-extra'),
      toml                = require('toml'),
      dnsd                = require('dnsd'),
      config              = require('../').config,
      IPublicRegistration = require('../../data').IPublicRegistration,
      IPublicDnsRecord    = require('../../data/ipublic/dnsrecord');

// Holds all stored static DNS entries
let staticDNS = [];

module.exports.init = async () => {
  
  // Read static DNS entries
  try {
    staticDNS = await load();
  } catch (err) { throw err; }

  // Start DNS server
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
        const dns = [
          ...staticDNS,
          ...ipreg.ipublic.dns
        ].find((dns) => {
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

/**
 * Loads static DNS entries
 */
async function load () {
  try {
    const storagePath = config.ipublic.path,
          storegeFilename = path.join(storagePath, 'dns.toml');
    await fs.ensureFile(storegeFilename);
    const registryContent = (await fs.readFile(storegeFilename)).toString(),
          registry = (registryContent && registryContent.length ? toml.parse(registryContent) : {});
    return registry.dns.map((dns) => {
      return new IPublicDnsRecord(dns)
    });
  } catch (err) { throw err; }
}
