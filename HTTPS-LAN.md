# HTTPS on the AMIS LAN URL

The URL `http://192.168.1.4:3000` is HTTP, so browsers correctly show `Not secure`. HTTPS requires a certificate for the hostname or IP and that certificate authority must be trusted by each device.

## Recommended local setup

Install `mkcert` on the server machine, then run PowerShell as Administrator:

```powershell
mkcert -install
New-Item -ItemType Directory -Force frontend\certs
mkcert -cert-file frontend\certs\amis.pem -key-file frontend\certs\amis-key.pem 192.168.1.4 localhost 127.0.0.1
```

Install the generated local CA on every phone or computer that will access AMIS. Do not commit `frontend/certs` or the private key.

For production, use a real DNS name and a certificate from a trusted public certificate authority. A public certificate normally cannot be issued for a private `192.168.x.x` address.

The Java API must also be served through the same HTTPS reverse proxy or configured with its own TLS certificate. The frontend now derives the API host from the browser URL, so accessing AMIS over HTTPS will call the API on the same host and port.
