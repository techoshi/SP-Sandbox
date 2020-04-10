module.exports = function (find, regexMatch, replaceWith) {
    var temp = find.replace(new RegExp(regexMatch, "g"), replaceWith);
    return temp;
};