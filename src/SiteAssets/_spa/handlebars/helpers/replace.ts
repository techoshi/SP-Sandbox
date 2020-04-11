//@ts-ignore
module.exports = function (find: any, regexMatch: any, replaceWith: any) {
    var temp = find.replace(new RegExp(regexMatch, "g"), replaceWith);
    return temp;
};