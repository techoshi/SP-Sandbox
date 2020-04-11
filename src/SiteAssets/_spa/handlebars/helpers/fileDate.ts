import * as moment from 'moment';

//@ts-ignore
module.exports = function (context: any) {
    return  moment(context).format('MM/DD/YYYY hh:mm A');
};