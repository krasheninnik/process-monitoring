## Folder watcher

Folder watcher watch for target directory and processing added in the directory files:

- set "await processing" status for file
- add filename in Redis message query
- send signal for Executor, that there aded a new file
- send signal with filename for Monitoring

## Executor

- wait until watcher signaled about new file
- if there is free threads: start processing in free thread
- else: wait until thread will free, and then start processing

- while processing file:
- - send in Redis information about processing file

## Monitoring front

- wait until watcher signaled about new file
- pull status of the file processing:
- - `-1` is await for processing
- - `0...99` processing (%)
- - `>= 100` done

## Redis help:

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

## Web workers help:

How to use web workers with react-create-app and not ejection in the attempt

https://medium.com/@danilog1905/how-to-use-web-workers-with-react-create-app-and-not-ejecting-in-the-attempt-3718d2a1166b
