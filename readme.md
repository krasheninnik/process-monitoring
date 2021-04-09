## Folder watcher

Folder watcher watch for target directory and processing added in the directory files:

- add filename in Redis message query
- set await status for file
- send signal for distributor, that there aded a new file

## Distributor

- wait until watcher signaled about new file
- if there is free threads: start processing in free thread
- else: wait until thread will free, and then start processing

- while processing file:
- - send in Redit information about processing file

## Monitoring front

- wait until watcher signaled about new file
- status of the file processing
- - `-1` is await for processing
- - `0...99` processing (%)
- - `>= 100` done

## Redit help:

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
