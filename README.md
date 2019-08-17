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
  # - type: DNS record type
  # - name: DNS record name
  # - value: (Optional) DNS record value for records that are not to be dynamically registered - if omitted value will be the last registered IP
  # - ttl: Broadcast TTL of the record
  dns = [
    { type = 'A', name = 'dynamic.ipublic.com', ttl = 300 },
    { type = 'A', name = 'static.ipublic.com', value = '10.20.30.40', ttl = 300 }
  ]

  # DNS Providers to sync to (supported: provider="cloudflare.com")
  [providers]
    # CloudFlare DNS provider
    [providers.cloudflare]
      provider = 'cloudflare.com'
      apikey = 'abcdefghijkl...'
      # DNS server registration(s)
      # - type: DNS record type
      # - name: DNS record name
      # - ttl: Broadcast TTL of the record
      dns = [
        { type = 'A', name = 'dynamic.mydomain.com', ttl = 300 }
      ]
```

### Usage

#### Register IPublic record's current IP

Execute from machine with public IP `1.2.3.4`:

```sh
> curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{ "key": "myUniqueId", "auth": "myauthkey1" }'
```

... or, spoof registered IP as `1.2.3.4`:

```sh
> curl -X POST http://localhost:3000 -H "Content-Type: application/json" -d '{ "key": "myUniqueId", "auth": "myauthkey1", "ip": "1.2.3.4" }'
```

#### List registered records

```sh
> curl -X GET http://localhost:3000
```

#### Use integrated Name server to resolve registered IPs
```sh
> nslookup dynamic.ipublic.com localhost

Name:     dynamic.ipublic.com
Address:  1.2.3.4
```

#### Use synced DNS provider to resolve registered IPs
```sh
> nslookup dynamic.mydomain.com

Name:     dynamic.mydomain.com
Address:  1.2.3.4
```
