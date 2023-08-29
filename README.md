# discord-bot-journey
Practicing discord bot features


## Tasks

### main-build-push-test-env
Builds,tags,pushes to remote
Requires: build-test-image, tag-test-image-remote, push-test-image-remote, caprover-deploy-test


### build-test-image
Build Docker Image
```sh
docker build --pull --rm -t discord-bot-journey:latest .
```

### tag-test-image-remote
Tags local image with remote name

```sh
docker tag discord-bot-journey:latest $REGISTRY_ADDRESS/discord-bot-journey:latest
```

### push-test-image-remote
Pushes local image to remote

```sh
docker push $REGISTRY_ADDRESS/discord-bot-journey:latest
```

### caprover-deploy-test
Sends signal to Caprover deployment for this app

```sh
caprover deploy --imageName $REGISTRY_ADDRESS/discord-bot-journey:latest
```
