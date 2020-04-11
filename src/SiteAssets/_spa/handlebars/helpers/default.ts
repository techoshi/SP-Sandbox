//@ts-ignore
module.exports = function (options: any) {
    //https://github.com/wycats/handlebars.js/issues/927

    var stack = globalThis.HandleBarGlobal.__switch_stack__[globalThis.HandleBarGlobal.__switch_stack__.length - 1];

    if (!stack.switch_match) {
        return options.fn(this);
    }
};