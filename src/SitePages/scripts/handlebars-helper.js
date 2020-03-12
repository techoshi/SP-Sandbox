function getFileExtension(fileNameOrURL, showUnixDotFiles) {
    /* First, let's declare some preliminary variables we'll need later on. */
    var fileName;
    var fileExt;

    /* Now we'll create a hidden anchor ('a') element (Note: No need to append this element to the document). */
    var hiddenLink = document.createElement('a');

    /* Just for fun, we'll add a CSS attribute of [ style.display = "none" ]. Remember: You can never be too sure! */
    hiddenLink.style.display = "none";

    /* Set the 'href' attribute of the hidden link we just created, to the 'fileNameOrURL' argument received by this function. */
    hiddenLink.setAttribute('href', fileNameOrURL);

    /* Now, let's take advantage of the browser's built-in parser, to remove elements from the original 'fileNameOrURL' argument received by this function, without actually modifying our newly created hidden 'anchor' element.*/
    fileNameOrURL = fileNameOrURL.replace(hiddenLink.protocol, ""); /* First, let's strip out the protocol, if there is one. */
    fileNameOrURL = fileNameOrURL.replace(hiddenLink.hostname, ""); /* Now, we'll strip out the host-name (i.e. domain-name) if there is one. */
    fileNameOrURL = fileNameOrURL.replace(":" + hiddenLink.port, ""); /* Now finally, we'll strip out the port number, if there is one (Kinda overkill though ;-)). */

    /* Now, we're ready to finish processing the 'fileNameOrURL' variable by removing unnecessary parts, to isolate the file name. */

    /* Operations for working with [relative, root-relative, and absolute] URL's ONLY [BEGIN] */

    /* Break the possible URL at the [ '?' ] and take first part, to shave of the entire query string ( everything after the '?'), if it exist. */
    fileNameOrURL = fileNameOrURL.split('?')[0];

    /* Sometimes URL's don't have query's, but DO have a fragment [ # ](i.e 'reference anchor'), so we should also do the same for the fragment tag [ # ]. */
    fileNameOrURL = fileNameOrURL.split('#')[0];

    /* Now that we have just the URL 'ALONE', Let's remove everything to the last slash in URL, to isolate the file name. */
    fileNameOrURL = fileNameOrURL.substr(1 + fileNameOrURL.lastIndexOf("/"));

    /* Operations for working with [relative, root-relative, and absolute] URL's ONLY [END] */

    /* Now, 'fileNameOrURL' should just be 'fileName' */
    fileName = fileNameOrURL;

    /* Now, we check if we should show UNIX dot-files, or not. This should be either 'true' or 'false'. */
    if (showUnixDotFiles == false) {
        /* If not ('false'), we should check if the filename starts with a period (indicating it's a UNIX dot-file). */
        if (fileName.startsWith(".")) {
            /* If so, we return a blank string to the function caller. Our job here, is done! */
            return "";
        };
    };

    /* Now, let's get everything after the period in the filename (i.e. the correct 'file extension'). */
    fileExt = fileName.substr(1 + fileName.lastIndexOf("."));

    /* Now that we've discovered the correct file extension, let's return it to the function caller. */
    return fileExt;
};

function ifEven(conditional, options) {
    if ((conditional % 2) == 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}

function ifEmpty(conditional, options) {
    if (conditional == undefined || conditional == "" || conditional == "null") {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}

function ifCondition(index, evalcond, options) {

    var thisCond = isNaN(index) ? ("'" + index + "' " + evalcond) : (index + evalcond);

    if (eval(thisCond)) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}

Handlebars.registerHelper('ifFirst', function (index, options) {
    if (index == 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
});

Handlebars.registerHelper('replace', function (find, regexMatch, replaceWith) {
    var temp = find.replace(new RegExp(regexMatch, "g"), replaceWith)
    return temp;
});

Handlebars.registerHelper('toLower', function (find) {
    var temp = find.toLowerCase();
    return temp;
});

Handlebars.registerHelper('fileDate', function (context) {
    return moment(context).format('MM/DD/YYYY hh:mm A');
});

Handlebars.registerHelper('if_even', ifEven);

Handlebars.registerHelper('ifCondition', ifCondition);

Handlebars.registerHelper('ifEmpty', ifEmpty);

Handlebars.registerHelper('noSpace', function (context) { return context.replace(/ /g, "_"); });

Handlebars.__switch_stack__ = [];

Handlebars.registerHelper("switch", function (value, options) {
    //https://github.com/wycats/handlebars.js/issues/927
    Handlebars.__switch_stack__.push({
        switch_match: false,
        switch_value: value
    });
    var html = options.fn(this);
    Handlebars.__switch_stack__.pop();
    return html;
});
Handlebars.registerHelper("case", function (value, options) {
    //https://github.com/wycats/handlebars.js/issues/927
    var args = Array.from(arguments);
    var options = args.pop();
    var caseValues = args;
    var stack = Handlebars.__switch_stack__[Handlebars.__switch_stack__.length - 1];

    if (stack.switch_match || caseValues.indexOf(stack.switch_value) === -1) {
        return '';
    } else {
        stack.switch_match = true;
        return options.fn(this);
    }
});
Handlebars.registerHelper("default", function (options) {
    //https://github.com/wycats/handlebars.js/issues/927
    var stack = Handlebars.__switch_stack__[Handlebars.__switch_stack__.length - 1];
    if (!stack.switch_match) {
        return options.fn(this);
    }
});

Handlebars.registerHelper("setVar", function (varName, varValue, options) {
    options.data.root[varName] = varValue;
});

Handlebars.registerHelper("randomUUID", function () {
    return Math.uuidFast();
});

Handlebars.registerHelper('getFileExtension', getFileExtension);

Handlebars.registerHelper("toLowerCase", function (e) {
    return e.toString().toLowerCase();
});
