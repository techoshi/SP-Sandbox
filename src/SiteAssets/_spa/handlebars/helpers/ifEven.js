module.exports = function (value, options) {
    //https://github.com/wycats/handlebars.js/issues/927
    Handlebars.__switch_stack__.push({
        switch_match: false,
        switch_value: value
    });
    var html = options.fn(this);
    Handlebars.__switch_stack__.pop();
    return html;
};