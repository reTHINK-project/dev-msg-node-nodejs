/**
 * Created by Hao on 2017/3/6.
 */

let moment = require("moment");

class Operators {

    // ====================================== logic operations ===================================

    allOf(params) {
        /**
        * @param a list of boolean expressions
        * @return boolean: true if all true, false if any false
        * */
        if (!(params instanceof Array)) throw new Error(`${params} is not an array.`);
        return params.every(b=>{return b});
    }

    anyOf(params) {
        /**
        * @param a list of boolean expressions
        * @return boolean: true if any true, false if all false
        * */
        if (!(params instanceof Array)) throw new Error(`${params} is not an array.`);
        return params.some(b=>{return b});
    }

    not(param) {
        /**
         * @param a key to be negated
         * */
        return Array.isArray(param)? !param[0] : !param;
    }

    // ==================================== comparative operations ====================================

    between(value, param, attribute = null) {
        /**
        * @param [string] a string containg two parameters separated by a space.
        * @return boolean: true if the value is in section (start, end).
        * */
        let start = param.split(" ")[0];
        let end   = param.split(" ")[1];
        switch (attribute) {
            case "time":
                // in case only time is specified
                value = moment(value, "HH:mm:ss");
                start = moment(start, "HH:mm:ss");
                end = moment(end, "HH:mm:ss");
                if (end < start) end.add(1, "d");
                break;
            case "date":
                // in case date is specified
                value = moment(value, "YYYY-MM-DD");
                start = moment(start, "YYYY-MM-DD");
                end = moment(end, "YYYY-MM-DD");
                break;
            case "weekday":
                // in case only weekday is specified
                value = moment(value, "dddd");
                start = moment(start, "dddd");
                end = moment(start, "dddd");
                break;
            default:
                value = parseInt(value);
                start = parseInt(start);
                end = parseInt(end);
        }
        return (value > start && value < end);
    }

    equals(value, param, attribute = null) {
        /**
         * @param [number/string] a parameter for comparison
         * */
        if (Array.isArray(value) && Array.isArray(param)) {
            if (value.length === param.length) {
                return value.every((u, i)=>{
                    return u === param[i];
                });
            } else {
                return false;
            }
        } else if(Array.isArray(value) && typeof param === 'number'){
            return value.length === param;
        }
        return String(param)==='*' || String(param)===String(value);
    }

    moreThan(value, param, attribute = null) {
        /**
         * @param [number/string] a parameter for comparison
         * */
        if (Array.isArray(value) && Array.isArray(param)) {
            return value.length > param.length;
        } else if(Array.isArray(value) && typeof param === 'number'){
            return value.length > param;
        }
        return parseInt(value) > parseInt(param);
    }

    lessThan(value, param, attribute = null) {
        /**
         * @param [number/string] a parameter for comparison
         * */
        if (Array.isArray(value) && Array.isArray(param)) {
            return value.length < param.length;
        } else if(Array.isArray(value) && typeof param === 'number'){
            return value.length < param;
        }
        return parseInt(value) < parseInt(param);
    }

    contains(value, param, attribute = null){
        /**
         * @param [string] a key to be detected
         * */
        return value.includes(param);
    }

    like(value, param, attribute = null){
        /**
         * @param [string] a pattern with wildcards (one or more "*")
         * */
        if (value === undefined) return false;
        let keys = param.split("*");
        for (let i in keys){
            if (!(keys.hasOwnProperty(i))) continue;
            let key = keys[i], index = value.indexOf(key);
            if (index<0){
                return false;
            }
            value = value.slice(index+key.length);
        }
        return true;
    }

    in(value, param, attribute = null) {
        /**
         * @param [array] a list
         * */
        return param.includes(value);
    }
}

module.exports = Operators;