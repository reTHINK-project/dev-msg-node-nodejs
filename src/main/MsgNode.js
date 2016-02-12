'use strict';

// @link https://github.com/nomiddlename/log4js-node
let log4js = require('log4js');
let express = require('express');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');

// @link https://github.com/expressjs/session
let expressSession = require('express-session');

// @link https://www.npmjs.com/package/session-file-store
// lot of store are available, including rethinkDB :)
// => https://github.com/expressjs/session#compatible-session-stores
let FileStore = require('session-file-store')(expressSession);

let Client = require('./components/Client');
let Registry = require('./components/Registry');
let Message = require('./components/Message');

let AddressAllocationManager = require('./components/rethink/AddressAllocationManager');
let RegistryManager = require('./components/rethink/RegistryManager');
let SessionManager = require('./components/rethink/SessionManager');
let MessageBus = require('./components/rethink/MessageBus');


class MsgNode {

  /**
   * Nodejs ProtoStub creation
   * @param  {Object} config - Server configuration.
   * @return {NodejsProtoStub}
   */
  constructor(config) {
    let _this = this;

    this.config = config;

    // define logger configuration
    log4js.configure(this.config.log4jsConfig, {
      reloadSecs: 60,
      cwd: this.config.logDir
    });
    this.logger = log4js.getLogger('server');

    this.app = express();

    // define logger for express
    this.app.use(log4js.connectLogger(this.logger, {
      level: 'auto'
    }));
    this.app.set('trust proxy', 1);
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    let sessionManager = expressSession({
      key: this.config.sessionCookieName,
      secret: this.config.sessionCookieSecret,
      resave: true,
      saveUninitialized: true,
      store: new FileStore({logFn: function() {}})
    });
    this.app.use(sessionManager);

    // start listening HTTP & WS server
    this.io = require('socket.io').listen(this.app.listen(this.config.port), this.config.ioConfig);
//    this.io.use(require('socketio-wildcard')());
    // share session with socket.io socket handshake
    this.io.use(function(socket, next) {
      sessionManager(socket.handshake, {}, next);
    });

    //    // @link https://github.com/jaredhanson/passport
    //    let passport = require('passport');
    //    let LocalStrategy   = require('passport-local').Strategy;
    //
    //    // @link https://github.com/jfromaniello/passport.socketio
    //    let passportSocketIo = require('passport.socketio');
    //    passport.use(new LocalStrategy(
    //      function(username, password, done) {
    //        if (username === 'jose' && password === 'Pa123') {
    //          return done(null, {
    //            name: 'jose',
    //            mail: 'j@f.r'
    //          });
    //        } else {
    //          return done(null, false, {message: 'wrong user name or password'});
    //        }
    //      }
    //    ));
    //
    //    passport.serializeUser(function(req, user, done) {
    //      if (user.name !== 'jose') {
    //        return done('Invalid user', null);
    //      } else if (!req) {
    //        return done('Missing request', null);
    //      }
    //
    //      done(null, user);
    //    });
    //
    //    passport.deserializeUser(function(req, user, done) {
    //      if (user.name !== 'jose') {
    //        return done('Invalid user', null);
    //      } else if (!req) {
    //        return done('Missing request', null);
    //      }
    //
    //      done(null, user);
    //    });
    //
    //    this.app.use(passport.initialize());
    //    this.app.use(passport.session());

    //    this.register = new PipeRegistry(vertx, mgr, "ua.pt");

    // use passportjs to authenticate
    //    this.io.use(passportSocketIo.authorize({
    //      cookieParser: cookieParser, // the same middleware used in express
    //      key: this.config.sessionCookieName, // the name of the cookie where express/connect stores its session_id
    //      secret: this.config.sessionCookieSecret, // the session_secret to parse the cookie
    //      store: new FileStore({logFn: function() {}}), // TODO define another store, like mongo, redis...
    //      success: this.onAuthorizeSuccessed.bind(this),  // callback on success
    //      fail: this.onAuthorizeFailed.bind(this),     // callback on fail/error
    //    }));

    //    this.app.get('/', function(req, res) {
    //      res.send('OK');
    //    });

    //    this.io.on('connection', function(socket) {
    //      _this.onConnection(socket);
    //    });

    // global registry
    this.registry = new Registry(this.config.url);
    this.registry.setLogger(this.logger);
    this.registry.setWSServer(this.io);
    let alm = new AddressAllocationManager('domain://' + this.registry.getDomain()  + '/hyperty-address-allocation', this.registry);
    this.registry.registerComponent(alm);
    let sm = new SessionManager("mn:/session", this.registry);
    this.registry.registerComponent(sm);
    let rm = new RegistryManager("mn:/registry", this.registry);
    this.registry.registerComponent(rm);
    let bus = new MessageBus('MessageBus', this.registry, this.io);
    this.registry.registerComponent(bus);

    this.io.on('connection', this.onConnection.bind(this));

    this.logger.info('[S] HTTP & WS server listening on', this.config.port);
  }

//  onAuthorizeSuccessed(data, accept) {
//    //    this.logger.info('[S] HTTP & WS server listening on', this.config.port);
//    if (error)  throw new Error(message);
//
//    // send the (not-fatal) error-message to the client and deny the connection
//    return accept(new Error(message));
//  }
//
//  onAuthorizeFailed(data, message, error, accept) {
//    this.logger.info('[C->S] failed connection to ws server', message);
//    if (error)  throw new Error(message);
//    return accept();
//  }

  onConnection(socket) {
    let _this = this;
    //socket.id : socket.io id
    //socket.handshake.sessionID : express shared sessionId
    this.logger.info('[C->S] new client connection', socket.id, socket.handshake.sessionID);
//    socket.join(socket.id);
    let client = new Client(this.registry, socket);

//    socket.on('*', function(frame) {
//      if (frame.data[0] !== 'echo') { // exclude echo test event
//        let msgData = frame.data[1]; // retrieve msg data in wildcard event
//        _this.logger.info('[C->S] new event', msgData);
//        client.processMessage(new Message(msgData));
//      }
//    });
    socket.on('message', function(data) {
      _this.logger.info('[C->S] new event', data);
      client.processMessage(new Message(data));
    });

    socket.on('disconnect', function() {
      _this.logger.info('[C->S] client disconnect', socket.handshake.sessionID);
      client.disconnect();
    });

    socket.on('error', function(e) {
      _this.logger.info('[C->S] socket error', socket.handshake.sessionID, e);
    });

    // test ws route
    socket.on('echo', function(msg, callback) {
      _this.logger.info('[C->S] receive echo');
      callback = callback || function() {};

      _this.logger.info('[S->C] test ping back');
      socket.emit('echo', msg);
      callback(null, 'Done.');
    });
  }
}
module.exports = MsgNode;
