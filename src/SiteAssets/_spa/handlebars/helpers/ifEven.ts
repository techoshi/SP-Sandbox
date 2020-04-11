//@ts-ignore
module.exports = function (conditional: any, options: any) {
    if ((conditional % 2) == 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}