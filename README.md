# ipublic-server
Logs client IP addresses and exposes them as DNS subdomains locally or on a supported DNS provider

### Deployment

- Run `npm install`
- Copy needed configuration files from `./config` into `./config/local` and adjust configuration
- Run `node index`

### IPublic records

Place your IPublic configurations into `./config/ipublic`, or alternatively configured directory as TOML files with `.ipublic.toml` extension.

Example configuration:
```toml
  # Basic info
  key = 'myUniqueId'
  auth = [
    'myauthkey1',
    'myauthkey2',
    'myauthkey3'
  ]

  # Local DNS server registration(s)
  dns = [
    # DNS record:
    # - type: DNS record type
    # - name: DNS record property taht will accept regitered IPublic IP value
    # - ttl: Broadcast TTL of the record
    # - sync: Array of configured DNS providers to sync the record with (supported: "cloudflare")
    { type = 'A', name = 'test.ipublic.com', ttl = 300, sync = ["cloudflare"] }
  ]
```

### Usage

#### Register IPublic record's current IP

```sh
curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{ "key": "myUniqueId", "auth": "tralala!" }'
```

#### List registered records

```sh
curl -X GET http://localhost:3000
```

#### Use as Name server to resolve registered IPs
```sh
nslookup test.ipublic.com localhost
```
