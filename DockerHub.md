# Cordate

User and admin client for Rosette REST API server. Read more about Cordate at GitHub [LeafCoders/cordate](https://github.com/LeafCoders/cordate).

## Running with Docker Compose

This image uses nginx to serve the static assets of the Cordate application. The application name and the url to Rosette server shall be specified with environment variables.

```yaml
# docker-compose.yml
version: '3'

services:
  cordate-client:
    image: leafcoders/cordate:latest
    depends_on:
      - rosette-server
    restart: always
    ports:
      - 80:80
    environment:
      - ROSETTE_URL=${ROSETTE_URL:?Must specify ROSETTE_URL in environment} # Public url to rosette server
      - WEBSOCKET_URL= # Change to `${WEBSOCKET_URL:?Must specify WEBSOCKET_URL in environment}` if you want to override the default public url to websocket at Rosette server
      - APPLICATION_NAME=${CORDATE_APPNAME:?Must specify CORDATE_APPNAME in environment} # Short name of the application. Eg. "Cordate"
      - CORDATE_PATH=${CORDATE_PATH:?Must specify CORDATE_PATH in environment} # Url path of cordate uri ('/app/cordate' in https://myserver.com/app/cordate)
    command: /bin/bash -c "envsubst '$$ROSETTE_URL $$WEBSOCKET_URL $$APPLICATION_NAME $$CORDATE_PATH' < /etc/nginx/conf.d/cordate_conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
```

Start with:
```
$ export ROSETTE_URL='https://myserver.com/rosette'
$ export APPLICATION_NAME='Cordate'
$ export CORDATE_PATH='/app/cordate'
$ docker-compose up -d
```
