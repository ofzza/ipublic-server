// Cloudflare DNS provider integration
// -----------------------------------------------------------------------------

// Load dependencies
const request = require('request-promise-native'),
      config  = require('../../').config;

module.exports = async (ipreg) => {
  try {
    // Find DNS records to sync
    const ip = ipreg.ip,
          apikey = config.dnsproviders.cloudflare.apikey,
          records = ipreg.ipublic.dns.filter((dns) => {
            return (dns.sync.indexOf('cloudflare') !== -1);
          });
    // Update all records matching a zone
    const zones = await getZones();
    for (const record of records) {
      const zone = zones.find((z) => {
        return (record.name.length >= z.name.length) && (record.name.substr(-1 * z.name.length).toLowerCase() === z.name.toLowerCase());
      });
      if (zone) { await updateRecord(zone.id, record, ipreg.ip); }
    }
  } catch (err) { throw err; }
}

async function getZones () {
  try {
    const res = await request({
      method: 'GET',
      uri: `https://api.cloudflare.com/client/v4/zones/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.dnsproviders.cloudflare.apikey}`
      },
      json: true
    });
    return res.result;
  } catch (err) {
    throw new Error(
      'Cloudflare update ERROR: ' + err.error.errors.map((err) => {
        return err.message;
      }).join('; ')
    );
  }
}

async function updateRecord (zoneId, record, ip) {
  try {
    // Get target record
    const res = await request({
      method: 'GET',
      uri: `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.dnsproviders.cloudflare.apikey}`
      },
      json: true
    });
    const target = res.result.find((r) => {
      return (r.type.toLowerCase() === record.type.toLowerCase()) && (r.name.toLowerCase() == record.name.toLowerCase());
    });
    if (target) {

      // Update target record
      await request({
        method: 'PUT',
        uri: `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${target.id}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.dnsproviders.cloudflare.apikey}`
        },
        body: {
          type: record.type,
          name: record.name,
          content: ip,
          ttl: record.ttl
        },
        json: true
      });

    }
  } catch (err) {
    throw new Error(
      'Cloudflare update ERROR: ' + err.error.errors.map((err) => {
        return err.message;
      }).join('; ')
    );
  }
}
