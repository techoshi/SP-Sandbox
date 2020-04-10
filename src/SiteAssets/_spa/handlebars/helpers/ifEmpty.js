module.exports = function (conditional, options) {
    if (conditional == undefined || conditional == "" || conditional == "null") {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}