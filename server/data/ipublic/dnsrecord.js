// IPublic DNS record configuration class
// -----------------------------------------------------------------------------

// IPublic DNS record data model
class IPublicDnsRecord {

  constructor ({
    type = 'A',
    name = null,
    value = null,
    ttl = 300
  } = {}) {

    // Store properties
    if (type !== null)  { this.type = type; }
    if (name !== null)  { this.name = name; }
    if (value !== null) { this.value = value; }
    if (ttl !== null)   { this.ttl = ttl; }

  }

}

// Export data model
module.exports = IPublicDnsRecord;
