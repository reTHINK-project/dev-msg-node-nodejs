const moment = require('moment');
class Comparator {
    /**
     * @param {String} startAt format: hh:mm
     * @param {String} endAt
     * @returns boolean
     */
    time(startAt, endAt) {
        const now = new Date();
        startAt = moment(startAt, 'hh:mm').getDate();
        endAt = moment(endAt, 'hh:mm').getDate();
        return now >= startAt && now <= endAt;
    }
    /**
     * @param {String} weekday ex: monday
     * @returns boolean
     */
    weekday(weekday){
        return moment().format('dddd').toLowerCase() === weekday.toLowerCase();
    }
}
module.exports = new Comparator();
