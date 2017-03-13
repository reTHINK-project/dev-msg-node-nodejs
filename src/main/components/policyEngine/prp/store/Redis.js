const IStore = require("./IStore");
class RedisStore extends IStore{

    constructor (){
        this.name = "RedisStore";
    }

    getPolicy(message){
        //todo get policy from redis
    }
}

export default RedisStore;
