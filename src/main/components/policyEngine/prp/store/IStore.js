
class IStore{
    getPolicy(opt){
        throw new Error("method must be implemented");
    }

    /**
     * @param source
     * @returns Promise
     */
    getSource(source){
        throw new Error("method must be implemented");
    }

    /**
     * @param source
     * @returns Promise
     */
    setSource(source){
        throw new Error("method must be implemented");
    }

    /**
     *
     * @param policy_file
     */
    loadPolicy(policy_file){

    }
}
module.exports = IStore;