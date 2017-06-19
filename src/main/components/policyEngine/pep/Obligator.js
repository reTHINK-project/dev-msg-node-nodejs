/**
 * Created by hjiang on 25/04/2017.
 */
class Obligator {
    constructor(context){
        this.name = 'PEP';
        this.context = context;
        this.logger = context.registry.getLogger();
        this.develop = context.devMode;
    }

    obligate(response){
        response.obligations.forEach((params, key)=>{
            let msg = response.getMessage();
            switch (key) {
                case 'limitNumber':
                    let attri = Object.keys(params)[0];
                    let number= params[attri];
                    let value = this.context.getValueOfAttribute(attri, msg);
                    let newValue = value.slice(0, number);
                    response.setMessage(this.context.setValueOfAttribute(attri, msg, newValue));
                    break;
                default:
                    break;
            }
        });
        return response;
    }
}
module.exports = Obligator;