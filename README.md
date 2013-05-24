pushcart
========

Pushcart is a small HTTP-service for distributing messages from one or more producer applications to various client consumers.

# Getting Started

    npm install -g pushcart
    pushcart start

The Pushcart server is configured via a number of environment variables:

* `PORT`
* `MONGODB_URL`
* `REDIS_URL`
* `AUTH_TOKEN`