Run docker with redis:

Start redis in Docker with a open port at localhost:6379:

```
docker run --name test-redis -p 6379:6379 -d redis
```

Connect to docker: ( winpty - windows only)

```
winpty docker exec -it test-redis sh
redis-cli
```

Access Redis from Another Docker Container:

```
docker run -it --rm --name test-2-redis --link test-redis:redis -d redis
winpty docker exec -it test-2-redis sh
redis-cli -h redis
```

source: https://phoenixnap.com/kb/docker-redis
