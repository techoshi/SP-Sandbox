import * as moment from 'moment';

//@ts-ignore
module.exports = function (context) {
    return  moment(context).format('MM/DD/YYYY hh:mm A');
};