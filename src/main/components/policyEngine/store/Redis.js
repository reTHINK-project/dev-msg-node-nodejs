const IStore = require("./IStore");
class RedisStore extends IStore{
    getPolicy(opt){
        //todo get policy from redis
    }
}
module.exports = new RedisStore();
