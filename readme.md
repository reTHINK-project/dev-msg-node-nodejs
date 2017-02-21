## dev-msg-node-nodejs

### Overview

The Node.js based Messaging Node is one of the reference implementations of the CSP Messaging services in the reTHINK Architecture.

The role of Messaging Nodes in the reTHINK Architecture is described in detail in [Hyperty Messaging Framework](https://github.com/reTHINK-project/dev-service-framework/blob/master/docs/manuals/hyperty-messaging-framework.md). Overall, as part of CSP backend services, it interacts with other rethink CSP backend components like the CSP domain registry, CSP catalogue. On the other hand, the runtime device (browser or server) where the hyperty is executed.

You will find a general documentation and guideline Message nodes Development in [Message Nodes and Protostubs Development](https://github.com/reTHINK-project/dev-service-framework/blob/d3.2-working-docs/docs/manuals/development-of-protostubs-and-msg-nodes.md).


### User View

#### Setup Environment

This documentation does not provide an OS dependant instructions : this NodeJS message node can be used on any OS compatible with redis & nodejs tools.
In case you don't have redis & nodejs tools installed on your local environement. A dockerfile is provided, so it can be integrated in a docker instance as well, see ` Run using Docker ` section.

##### Quick Start

First you need to clone this repository:
```
git clone https://github.com/reTHINK-project/dev-msg-node-nodejs.git
cd dev-msg-node-nodejs
```

**Performance consideration**
You can find [some results](./docs/test-performance.md) executed with testbeds unit test.
To obtain better performance on production it strongly recommanded to use a high log level (e.g. "ERROR") in logLevel setting.

###### Run using Docker

You can skip this part, in case you have redis & Node.js installed.

In order to build dev-msg-node-nodejs you must have docker running. Otherwise, docker can be installed from [docker installation](https://docs.docker.com/).
After having installed correctly docker, run the following command :
```
$ docker build -t msg-node-rethink .

```
Afterwards, run the following :

```
$ docker run -e url=domain.tld -e PORT=9090 -e domainRegistryUrl=http://domain.tld:4567 msg-node-rethink

```

###### Run with [docker compose](https://docs.docker.com/compose/) :
This tools allow to start multiple docker container at once.
To be more convenient, a docker-compose.yml example configuration file is provide with start & stop script, this file also gives some example for environment configuration.
**Once you set the correct image name** (for msg-node & domain-registry), you can start with :
```
$ ./start.sh

```
 Then to stop :
```
$ ./stop.sh

```

###### Run using local environement

Then run the command :
```
$ npm run init-setup
```

After running successfully this command you will have 2 folders (node_modules and vendor), these folders are excluded from the commit process, and are only for development.

Check the server configuration file for custom setting (url, port, ...) :

Now start server with the following command :

```
$ node src/main/server.js

```

You should see a log like the following :

```
[Date] [INFO] server - [S] HTTP & WS server listening on 9090
```

##### Javascript Environment
JavaScript code should be written in ES6.

Please follow instructions on [official nodejs installation documentation](https://nodejs.org/en/download/package-manager/) to setup the Node.js environnement.
This include the npm manager for node modules.

##### dependencies:
* nodejs
* npm
* karma - A simple tool that allows you to execute JavaScript code in multiple real browsers. See more on [karma](http://karma-runner.github.io/0.13/index.html)
* mocha - Unit test tool. See more on [http://mochajs.org](http://mochajs.org/)
* gulp - Automate and enhance your workflow. See more about gulp on [gulp](http://gulpjs.com/)

#### Service architecture

The figure below illustrates the service architecture of the Node.js Messaging Node.

Combine with node redis sentinel client, each node shares data sessions with each others through redis storage.

Redis-Sentinel monitor & notify redis cluster of data changes between Node.js instances.

![NodeJS & Redis clustering using Redis-Sentinel](./docs/nodejs-redis-cluster.png)

### Developer View

#### Repository structure
This repository is ready to start working on development.
The code will go to the **src** folder, it contains also the main server script in src/main/ folder.

The unit tests will be on **test** folder, following the name standard <component>.spec.js

Server (config.js) & tools (gulp, karma, etc...) configurations are located in root folder.


#### Code Style and Hinting
On the root directory you will find **.jshintrc** and **.jscsrc**, these files are helpers to maintain syntax consistency.

- [jscs](http://jscs.info/) - Maintain JavaScript Code Style
- [jshint](http://jshint.com/) - Detect errors and potential problems in JavaScript code.

#### Documentation
To generates api documentation you can run :
$ **gulp doc**
This will generate HTML documentation in docs/ folder.


#### Unit Testing
We use Karma test runner to execute mocha test.

To run unit test, you need first to lauch a server node with command :

``
$ node src/main/server.js``

Then start karma test (from main directory) :

``
$ karma start``

Karma will launch the browser to execute all tests in test/ folder and show result in console.
Tests are automatically redone when code is modified.


#### Server components

##### NodeJS

###### Socket.io
Socket.io is a well-known library that provides real-time bidirectionnal event-based communications.
It handles the connection transparently for developpers :

- the protocol negociation (long-polling, websocket,etc...) with client depending of network capabilities
- connection always on with heartbeat packets
- message broadcasting
- session data
- clustering consideration with multiple data storage drivers

###### ExpressJS
Express.js is a minimalist web framework commonly used in front of socket.io server.
It provide a robust set of features for web and mobile applications, like request routing, and a solid stack for third-party middleware.

##### Redis
Redis is an in-memory data structure store, used as database, cache and message broker. It supports various type of data structures such as string, hashes, lists...
It support data persistency, but it's mainly used to store temporary datas like session or connection information.

Redis has built-in replication, and provides high availability via Redis Sentinel and automatic partitioning with Redis Cluster.


#### Core components

This section describes the functional blocks of the Messaging Node architecture.

The graph below describes message event processing with components.
![MsgNode event message](./docs/event-mgmt.png)


##### Entry point
Msg node starts with server.js script that reads configuration from config.js and instantiate <<MsgNode>> class.

This singleton class initialize main components and start listening for incoming clients' websockets .
On each new ProtoStub connection, socket.io events are binded to <<Client>> instance associated with socket id.

##### Registry
A global Registry class is used by MsgNode to manage internal components and configuration.
It allows internal components to share reference to with other components in the architecture.

##### SessionManager
The SessionManager class handles client connection state changes.


##### Message bus
MessageBus class provides a message system that publish information to all components.


##### Address allocation management
The class AddressAllocationManager handles hyperty URLs allocations once client ask for registration.


##### Message
On each message received from ProtoStub, MsgNode instantiate a ClientMessage instance containing Messages, and dispatch to Client instances.
