//@ts-ignore
module.exports = function (index: any, evalcond: any, options: any) {

    var thisCond = isNaN(index) ? ("'" + index + "' " + evalcond) : (index + evalcond);

    if (eval(thisCond)) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}