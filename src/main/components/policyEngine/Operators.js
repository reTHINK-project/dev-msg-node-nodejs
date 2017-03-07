/**
 * Created by Hao on 2017/3/6.
 */

import moment from "moment";

class Operators {

    // ====================================== logic operations ===================================

    allOf(params) {
        /**
        * @param a list of boolean expressions
        * @return boolean: true if all true, false if any false
        * */
        if (!(params instanceof Array)) throw new Error(`${params} is not an array.`);
        if (!params.length) return false;
        let result = true;
        for (let i in params) {
            if (!params.hasOwnProperty(i)) continue;
            result = params[i] && result;
            if (!result) return result;
        }
        return result;
    }

    anyOf(params) {
        /**
        * @param a list of boolean expressions
        * @return boolean: true if any true, false if all false
        * */
        if (!(params instanceof Array)) throw new Error(`${params} is not an array.`);
        if (!params.length) return true;
        let result = false;
        for (let i in params) {
            if (!params.hasOwnProperty(i)) continue;
            result = params[i] || result;
            if (result) return result;
        }
        return result;
    }

    not(param) {
        /**
         * @param a key to be negated
         * */
        return !param;
    }

    // ==================================== comparative operations ====================================

    between(value, param, attribute) {
        /**
        * @param [string] a string containg two parameters separated by a space.
        * @return boolean: true if the value is in section (start, end).
        * */
        let start = param.split(" ")[0];
        let end   = param.split(" ")[1];
        switch (attribute) {
            case "time":
                // in case only time is specified
                start = moment(start, "HH:mm:ss");
                end = moment(end, "HH:mm:ss");
                if (end < start) end.add(1, "d");
                break;
            case "date":
                // in case date is specified
                start = moment(start);
                end = moment(end);
                break;
            case "weekday":
                // in case only weekday is specified
                start = moment(start, "dddd");
                end = moment(start, "dddd");
                break;
            default:
                console.log(`${attribute} is not supported for between operation.`);
        }
        return (value > start && value < end);
    }

    equals(value, param, attribute = null) {
        /**
         * @param [number/string] a parameter for comparison
         * */
        return String(param)==='*' || String(param)===String(value);
    }

    moreThan(value, param, attribute = null) {
        /**
         * @param [number/string] a parameter for comparison
         * */
        return parseInt(value) > parseInt(param);
    }

    lessThan(value, param, attribute = null) {
        /**
         * @param [number/string] a parameter for comparison
         * */
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
        if (!(typeof value === "string") || !(typeof param === "string")){
            throw new Error("operator like not applicable");
        }
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
}

export default Operators;