

//@ts-ignore
module.exports = function (value, options) {
    globalThis.HandleBarGlobal = globalThis.HandleBarGlobal ? globalThis.HandleBarGlobal : {
        __switch_stack__: []
    }

    //https://github.com/wycats/handlebars.js/issues/927
    //@ts-ignore+
    globalThis.HandleBarGlobal.__switch_stack__.push({
        //@ts-ignore
        switch_match: false,
        //@ts-ignore
        switch_value: value
    });
    var html = options.fn(this);
    //@ts-ignore
    globalThis.HandleBarGlobal.__switch_stack__.pop();
    return html;

};