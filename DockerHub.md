# Cordate

User and admin client for Rosette REST API server. Read more about Cordate at GitHub [LeafCoders/cordate](https://github.com/LeafCoders/cordate).

## Running with Docker Compose

This image uses nginx to serve the static assets of the Cordate application. The application name and the url to Rosette server shall be specified with environment variables.

```yaml
# docker-compose.yml
version: '3'

services:
  cordate-client:
    image: leafcoders/cordate:0.2
    depends_on:
      - rosette-server
    restart: always
    ports:
      - 80:80
    environment:
      - ROSETTE_URL=${ROSETTE_URL:?Must specify ROSETTE_URL in environment} // Public url to rosette server
      - APPLICATION_NAME=${CORDATE_APPNAME:?Must specify CORDATE_APPNAME in environment} // Short name of the application. Eg. "Cordate"
    command: /bin/bash -c "envsubst '$$ROSETTE_URL $$APPLICATION_NAME' < /etc/nginx/conf.d/cordate_conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
```

Start with:
```
$ export CORDATE_APPNAME='Cordate'
$ export CORDATE_URL='https://myserver.app/cordate'
$ docker-compose up -d
```
