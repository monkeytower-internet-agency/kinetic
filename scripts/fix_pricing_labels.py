import subprocess
import base64
import sys

# Parameters
uuid = 'd8kkkckswsskcgs4ssgos44o'
branch = 'pricing'
fqdn = f'https://{branch}.dev.paranomad.de'

# Labels template
labels = f"""traefik.enable=true
traefik.http.middlewares.gzip.compress=true
traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https
traefik.http.routers.http-0-{uuid}.entryPoints=http
traefik.http.routers.http-0-{uuid}.middlewares=gzip
traefik.http.routers.http-0-{uuid}.rule=Host(`{branch}.dev.paranomad.de`) && PathPrefix(`/`)
traefik.http.routers.http-0-{uuid}.service=http-0-{uuid}
traefik.http.services.http-0-{uuid}.loadbalancer.server.port=80
caddy_0.encode=zstd gzip
caddy_0.handle_path.0_reverse_proxy={{{{upstreams 80}}}}
caddy_0.handle_path=/*
caddy_0.header=-Server
caddy_0.try_files={{{{path}}}} /index.html /index.php
caddy_0={fqdn}
caddy_ingress_network=coolify"""

b64_labels = base64.b64encode(labels.encode()).decode()

# Construct the SQL with properly escaped single quotes for the shells
# We want: UPDATE applications SET fqdn = 'https://...', ...
sql = f"UPDATE applications SET fqdn = ''{fqdn}'', custom_labels = ''{b64_labels}'' WHERE uuid = ''{uuid}'';"

# Final command structure
# Local -> Marvin (ssh) -> Magrathea (ssh) -> Docker (exec) -> psql
remote_cmd = f"sudo docker exec coolify-db psql -U coolify -c \"{sql}\""
marvin_cmd = f"ssh -o StrictHostKeyChecking=no -o BatchMode=yes 100.64.0.7 '{remote_cmd}'"
cmd = ['ssh', '-q', 'marvin', marvin_cmd]

print(f"Executing: {' '.join(cmd)}")
result = subprocess.run(cmd, capture_output=True, text=True)
if "UPDATE 1" in result.stdout:
    print("SUCCESS: Labels updated.")
else:
    print("ERROR: Failed to update labels.")
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)
