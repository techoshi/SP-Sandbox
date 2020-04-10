module.exports = function (index, evalcond, options) {

    var thisCond = isNaN(index) ? ("'" + index + "' " + evalcond) : (index + evalcond);

    if (eval(thisCond)) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}