// Cloudflare DNS provider integration
// -----------------------------------------------------------------------------

// Load dependencies
const request = require('request-promise-native'),
      config  = require('../../').config;

module.exports = async (ipreg, provider) => {
  try {
    // Find DNS records to sync
    const ip = ipreg.ip,
          apikey = provider.apikey;
    // Update all records matching a zone
    const zones = await getZones(provider);
    for (const record of provider.dns) {
      const zone = zones.find((z) => {
        return (record.name.length >= z.name.length) && (record.name.substr(-1 * z.name.length).toLowerCase() === z.name.toLowerCase());
      });
      if (zone) {
        await updateRecord(provider, zone.id, record, ipreg.ip);
        return `Successfully updated ${provider.provider} record [${record.type} ${record.name}] as ${ipreg.ip}.`;
      } else {
        return `Failed finding a zone containing record [${record.type} ${record.name}]!`;
      }
    }
  } catch (err) { throw err; }
}

async function getZones (provider) {
  try {
    const res = await request({
      method: 'GET',
      uri: `https://api.cloudflare.com/client/v4/zones/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apikey}`
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

async function updateRecord (provider, zoneId, record, ip) {
  try {
    // Get target record
    const res = await request({
      method: 'GET',
      uri: `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apikey}`
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
          'Authorization': `Bearer ${provider.apikey}`
        },
        body: {
          type: record.type,
          name: record.name,
          content: ip,
          ttl: record.ttl
        },
        json: true
      });

    } else {
      throw new Error(
        `Cloudflare update ERROR: Failed finding record [${record.type} ${record.name}]!`
      );
    }

  } catch (err) {
    throw new Error(
      'Cloudflare update ERROR: '
      + err.error.errors.map((err) => {
          return err.message;
        }).join('; ')
    );
  }
}
