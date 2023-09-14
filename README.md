# discord-bot-journey
Practicing discord bot features




## Twitch Authorization
[Twitch Console](https://dev.twitch.tv/console)

### Authorization code grant flow
```
https://id.twitch.tv/oauth2/authorize
    ?response_type=code
    &client_id=xhhqddf6e0aluju0ankrrxeawz73cd
    &redirect_uri=http://localhost:3000
    &scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls
    &state=c3ab8aa609ea11e793ae92361f002671
```

Response:

Success:
```
http://localhost:3000/
    ?code=gulfwdmys5lsm6qyz4xiz9q32l10
    &scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls
    &state=c3ab8aa609ea11e793ae92361f002671
```

Error:
```
http://localhost/?error=redirect_mismatch&error_description=Parameter+redirect_uri+does+not+match+registered+URI&state=c3ab8aa609ea11e793ae92361f002671
```


### Use the authorization code to get a token

The second step in this flow is to use the authorization code (see above) to get an access token and refresh token.

```sh
curl -X POST \
    https://id.twitch.tv/oauth2/token \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'client_id=hof5gwx0su6owfnys0yan9c87zr6t \
    &client_secret=41vpdji4e9gif29md0ouet6fktd2 \
    &code=gulfwdmys5lsm6qyz4xiz9q32l10 \
    &grant_type=authorization_code \
    &redirect_uri=http://localhost:3000'
```

If the request succeeds, it returns an access token and refresh token.

```json
{
  "access_token": "rfx2uswqe8l4g1mkagrvg5tv0ks3",
  "expires_in": 14124,
  "refresh_token": "5b93chm6hdve3mycz05zfzatkfdenfspp1h1ar2xxdalen01",
  "scope": [
    "channel:moderate",
    "chat:edit",
    "chat:read"
  ],
  "token_type": "bearer"
}
```



[XC Tasks](https://github.com/joerdav/xc)
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
