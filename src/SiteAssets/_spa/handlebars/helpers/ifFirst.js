module.exports = function (index, options) {
    if (index == 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

};