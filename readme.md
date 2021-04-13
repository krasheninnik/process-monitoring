# Process-monitoring

Monitoring process of execution some tasks:

- Watch folder for added new files (TS);
- Distribute task on available threads and execute (C++);
- Display information about progress of execution (React).

Integration between services via Redis.

## Folder watcher

Folder watcher watch for target directory and process added in this directory files:

- set "await processing" status for file;
- add filename in Redis message query;
- send signal for Executor, that there added a new file;
- add filename in set of names (for Monitoring)

## Executor

- wait until Watcher signaled about new file, then get file from message query;
- if Executor have free threads: start processing file;
- else: wait until any thread will free, then start processing
- while processing file:
- - send in Redis information about progress in processing

## Monitoring

### Back-end

- poll redis at regular intervals to get all the files in progress and their status
- send obtained information to Front-end via WebSocket

### Front-end

- Listen WebSocker, show obtained information about task processing in three tasks groups, divided by status:
- - `-1` is await for processing
- - `0...99` processing (%)
- - `>= 100` done

# Some additional information:

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
