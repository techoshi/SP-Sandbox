
//@ts-ignore
module.exports = function (options) {
        //https://github.com/wycats/handlebars.js/issues/927
        //@ts-ignore
        var stack = globalThis.HandleBarGlobal.__switch_stack__[globalThis.HandleBarGlobal.__switch_stack__.length - 1];
        //@ts-ignore
        if (!stack.switch_match) {
            return options.fn(this);
        }
    
};