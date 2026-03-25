TOKEN="gaWMTf1H4WHBUeVgHQgjdVRgslhgjqrgl-jz5c1T"
ZONE="950937a65ed73cfe611c8dd187593abb"

# Update dev.paranomad.de
curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records/f0d228add429197b032a9e45bc05d690" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" --data '{"type":"A","name":"dev.paranomad.de","content":"159.195.49.196","proxied":false}'

# Update *.dev.paranomad.de
curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records/7b0c07d12102417bda616302481d5c27" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" --data '{"type":"A","name":"*.dev.paranomad.de","content":"159.195.49.196","proxied":false}'

