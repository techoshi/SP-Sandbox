//@ts-ignore
module.exports = function (conditional: any, options: any) {
    if (conditional == undefined || conditional == "" || conditional == "null") {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}