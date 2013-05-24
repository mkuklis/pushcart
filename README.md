pushcart
========

Pushcart is a small HTTP-service for distributing messages from one or more producer applications to various client consumers.

# Install

In addition to installing MongoDB and Redis, install Pushcart from NPM:

    $ npm install -g pushcart

# Server

    $ pushcart server

The Pushcart server is configured via a number of environment variables:

* `PORT`
* `MONGODB_URL`
* `REDIS_URL`
* `AUTH_TOKEN`

# Applications

Message producers are referred to as "applications" and must be registered with Pushcart:

    $ pushcart addapp
    Name: My App

    OK
    id: 519f9471fb85da32f7000001
    token: eac3538e-07d3-485f-82a5-6e0e78866cc8

Applications can then create messages by POST-ing to `/messages` and providing the app token:

    POST /messages HTTP/1.1
    Host: mypushcartserver.com
    Content-Type: application/json
    X-App-Token: eac3538e-07d3-485f-82a5-6e0e78866cc8

    { "hello": "world" }

# Clients

Message consumers are referred to as "clients" and must also be registered with Pushcart.  The client program can register itself by POST-ing to `/clients`:

    POST /clients HTTP/1.1
    Host: mypushcartserver.com
    Content-Type: application/json
    X-Auth-Token: secret

    { "type": "test" }

Example response:

    {
        "_id": "...",
        "type": "test",
        "token": "13c5287d-4801-41ec-98d6-8ef986e3adfe"
    }

Clients should store the client token in order to consume messages.

# Messages

Messages can be consumed in bulk by GET-ing `/messages`:

    GET /messages HTTP/1.1
    Host: mypushcartserver.com
    X-Client-Token: 13c5287d-4801-41ec-98d6-8ef986e3adfe

Example response:

    [
        {
            "_id": "519f713c22744d85d8000001",
            "hello": "world",
            "app": {
                "_id": "519f6c5cfb650fdbc6000001",
                "name": "My App"
            }
        },
        ...
    ]

Clients can also fetch only those messages created after a particular `_id` by sepcifying a `since` query string parameter:

    GET /messages?since=519f713c22744d85d8000001 HTTP/1.1
    Host: mypushcartserver.com
    X-Client-Token: 13c5287d-4801-41ec-98d6-8ef986e3adfe

# Pubsub

Messages are published to Redis when created.  Other applications can listen for these messages by subscribing to the `pushcart:messages` channel:

    $ redis-cli
    $ subscribe pushcart:messages

# Test

    $ npm test