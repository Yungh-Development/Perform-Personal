
## To run the database service via docker:

### Start DB

```
docker-compose -f services.yml up -d
``` 

### Stop DB

```
docker-compose -f services.yml down
```

## Run API in a Container

```
docker-compose -f dev.yml up -d
```

## Stop API

```
docker-compose -f dev.yml down
```