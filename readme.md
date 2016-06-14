## dev-msg-node-nodejs

### Overview

The NodeJS based Message Node is one of the reference implementations of the Message Node component in the reTHINK Architecture.

Like other Message Nodes, it has responsibilities to perform messages delivering between different hyperties.
And by design, it interact with other Rethink components like the domain registry or runtime.

So, that implies to have an running instance of the domain registry to get the nodejs message node running correctly.

You will find a general documentation and guideline Message nodes Development in [Message Nodes and Protostubs Development](https://github.com/reTHINK-project/dev-service-framework/blob/d3.2-working-docs/docs/manuals/development-of-protostubs-and-msg-nodes.md).


### User View

#### Setup Environment

This documentation does not provide an OS dependant instructions : this NodeJS message node can be used on any OS compatible with redis & nodejs tools.
In case you don't have redis & nodejs tools installed on your local environement. A dockerfile is provided, so it can be integrated in a docker instance as well, see ` Installation with Docker ` section.

##### Quick Start

First you need to clone this repository:
```
git clone https://github.com/reTHINK-project/dev-msg-node-nodejs.git
cd dev-msg-node-nodejs
```
Then run the command :
```
$ npm run init-setup
```
##### Installation and execution with Docker
You can skip this part, in case you have redis & nodejs installed.

In order to build dev-msg-node-nodejs you must have docker running. Otherwise docker can be installed from [docker installation](https://docs.docker.com/). 
After having intsalled correctly docker, run the following command to build :
``` 
$ docker build -t msg-node-nodejs .

```
Afterwards, run the following command :

``` 
$ docker build -t msg-node-nodejs .

```
After running successfully this command you will have 2 folders (node_modules and vendor), these folders are excluded from the commit process, and are only for development.

Check the server configuration file for custom setting (url, port, ...) :  

Now start server with the following command :  

``` 
$ node src/main/server.js

```

You should see a notice like that :  
[Date] [INFO] server - [S] HTTP & WS server listening on 9090



if you already have the project configured on your machine, you only need run the command ```npm install``` to update package & new dependencies.

##### Javascript Environment
JavaScript code should be written in ES6.

Please follow instructions on [official nodejs installation documentation](https://nodejs.org/en/download/package-manager/) to setup the NodeJS environnement.  
This include the npm manager for node modules.

##### dependencies:
* nodejs
* npm
* karma - A simple tool that allows you to execute JavaScript code in multiple real browsers. See more on [karma](http://karma-runner.github.io/0.13/index.html)
* mocha - Unit test tool. See more on [http://mochajs.org](http://mochajs.org/)
* gulp - Automate and enhance your workflow. See more about gulp on [gulp](http://gulpjs.com/)

#### Service architecture

The figure below illustrates the service architecture of the NodeJS Messaging Node.  

Combine with node redis sentinel client, each node share session datas with each others through redis storage.  
Redis-Sentinel monitor & notify redis cluster of data change between nodejs instance.

![NodeJS & Redis clustering using Redis-Sentinel](nodejs-redis-cluster.png)


For security consideration, it's advized to use a proxy (as describe in the following scheme) in front of node instance to not give direct access to nodejs instance.
It's recommanded to use NGinx server for that ([from NGiNX](https://www.nginx.com/blog/nginx-nodejs-websockets-socketio/), [from Socket.io](http://socket.io/docs/using-multiple-nodes/#)).  
By the way it also provide a good load balancer solution (HAProxy is another good one).  


![Web proxy in front of node instances](web-proxy-node.png)


#### Hyperty development
To use the message nodes in client side, please refer to [Hyperty development tutorial](https://github.com/reTHINK-project/dev-service-framework/blob/d3.2-working-docs/docs/manuals/development-of-hyperties.md)



### Developer View

#### Repository structure
This repository is ready to start working on development.  
The code will go to the **src** folder, it contains also the main server script in src/main/ folder.  

The unit tests will be on **test** folder, following the name standard <component>.spec.js  

Server (config.js) & tools (gulp, karma, etc...) configuration is located in root folder.


#### Code Style and Hinting
On the root directory you will find **.jshintrc** and **.jscsrc**, these files are helpers to maintain syntax consistency, it signals syntax mistakes and makes the code equal for all developers.

- [jscs](http://jscs.info/) - Maintain JavaScript Code Style
- [jshint](http://jshint.com/) - Detect errors and potential problems in JavaScript code.

Most IDEs and Text Editors can handle these tools.


#### Documentation
To generates api documentation you can run :  
$ **gulp doc**    
This will generate HTML documentation in docs/ folder.


#### Unit Testing
We use Karma test runner to execute mocha test.

To run unit test, you need first to lauch a server node with command :  
$ **node src/main/server.js**  
... then start karma test runner (from main directory) :  
$ **karma start**  

Karma will launch the browser (chromium in this case) to execute all tests in test/ folder and show result in console.
Tests are automatically redone when code is modified.



#### Server components

##### NodeJS

###### Socket.io
Socket.io is a well-known library that provide real-time bidirectionnal event-based communication.  
It able to handle the connection transparently for developpers :  

- the protocol negociation (long-polling, websocket,etc...) with client depending of network capabilities
- connection always on with heartbeat packets
- message broadcasting
- session datas
- clustering consideration with multiple data storage drivers

###### ExpressJS
Express.js is a minimalist web framework commonly used in front of socket.io server.  
It provide a robust set of features for web and mobile applications, like request routing, and a solid stack for third-party middleware.

##### Redis
Redis is an in-memory data structure store, used as database, cache and message broker. It supports various type of data structures such as string, hashes, lists...
It have a persistent mode, but it's mainly used to store temporary datas like session or connection information.  

Redis has built-in replication, and provides high availability via Redis Sentinel and automatic partitioning with Redis Cluster.


#### Core components

This section describe the functional blocks of the Messaging Node architecture.

The graphic below describe message event processing with components.
![MsgNode event message](event-mgmt.png)


##### Entry point
Msg node start with server.js script that read configuration from config.js and instanciate <<MsgNode>> class.

This unique class initialize main components and start listening for incoming websocket client.
On each new protostub connection, socket.io events are bind to <<Client>> instance associated with socket ressource.

##### Registry
A global Registry class is used by MsgNode to manage internal components and configuration.
It allow internal component to share reference to configuration and others components.

##### SessionManager
The SessionManager class handle client connection state change.
###### Note
Link with identity service ?


##### Message bus
MessageBus class provide a message system that publish information to all components.  

###### Note
/!\ Redis bus manager is not implemented yet, so message cannot be broadcast in a msg node cluster : code in place allow only to publish message through current node instance.


##### Address allocation management
The class AddressAllocationManager handle hyperty URLs allocation once client ask for registration.  

###### Note
/!\ For the moment, foreign hyperty instance pool are not managed.
Link with global domain registry ?


##### Message
On each message received from protostub, MsgNode built a ClientMessage instance containing Message, and dispatch to Client instance.
It's also used as container to built reply on client.
