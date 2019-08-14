// IPublic DNS record configuration class
// -----------------------------------------------------------------------------

// IPublic data model
class IPublicDnsRecord {

  constructor ({
    type = 'A',
    name = null,
    ttl = 300
  } = {}) {

    // Store properties
    if (type !== null) { this.type = type; }
    if (name !== null) { this.name = name; }
    if (ttl !== null) { this.ttl = ttl; }

  }

}

// Export data model
module.exports = IPublicDnsRecord;
