
class IStore{
    getPolicySet(context, message){
        throw new Error("method must be implemented");
    }

    /**
     * @returns String
     */
    getSource(){
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
     * @param srcPath
     */
    loadPolicies(srcPath){

    }
}
module.exports = IStore;