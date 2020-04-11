//@ts-ignore
module.exports =  function (value: any, options: any) {
    //https://github.com/wycats/handlebars.js/issues/927
    var args = Array.from(arguments);
    var options = args.pop();
    var caseValues = args;

    var stack = globalThis.HandleBarGlobal.__switch_stack__[globalThis.HandleBarGlobal.__switch_stack__.length - 1];

    if (stack.switch_match || caseValues.indexOf(stack.switch_value) === -1) {
        return '';
    } else {
        stack.switch_match = true;
        return options.fn(this);
    }    
};