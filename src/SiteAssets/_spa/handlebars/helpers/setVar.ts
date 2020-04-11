//@ts-ignore
module.exports = function (varName: any, varValue: any, options: any) {
    options.data.root[varName] = varValue;
};