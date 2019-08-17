// IPublic DNS provider configuration class
// -----------------------------------------------------------------------------
// Load dependencies
const IPublicDnsRecord    = require('./dnsrecord');

// IPublic DNS provider data model
class IPublicDnsProvider {

  static create (config) {

    // Detect and import CloudFlare provider
    if (config.provider === 'cloudflare.com') {
      return new CloudFlareDnsProvider(config);
    }

    // Default provider
    return new IPublicDnsProvider(config);

  }

  constructor ({
    provider,
    dns = []
  } = {}) {

    // Store properties
    if (provider !== null) { this.provider = provider; }
    if (dns !== null) {
      this.dns = dns.map((d) => new IPublicDnsRecord(d));
    }

  }

}

// Export data model
module.exports = IPublicDnsProvider;

// Cloudflare  DNS provider
class CloudFlareDnsProvider extends IPublicDnsProvider {

  constructor ({
    provider,
    apikey,
    dns = []
  } = {}) {
    super({ provider, dns });
    
    // Store properties
    if (apikey !== null) { this.apikey = apikey; }

  }

}
