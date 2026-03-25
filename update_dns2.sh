TOKEN="gaWMTf1H4WHBUeVgHQgjdVRgslhgjqrgl-jz5c1T"
ZONE="950937a65ed73cfe611c8dd187593abb"

# Update mac.dev.paranomad.de
curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records/5b22d474ccaf9f8b73e4bea63508a84c" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" --data '{"type":"A","name":"mac.dev.paranomad.de","content":"100.64.0.1","proxied":false}'

# Update *.mac.dev.paranomad.de
curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records/3f284a5708bbe2604154e1b20b286e0b" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" --data '{"type":"A","name":"*.mac.dev.paranomad.de","content":"100.64.0.1","proxied":false}'

