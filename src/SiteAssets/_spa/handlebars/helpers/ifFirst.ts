//@ts-ignore
module.exports = function (index: any, options: any) {
    if (index == 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

};