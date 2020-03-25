"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
var inEditMode = false;
var inTestMode = false;
var spSettings = {
    maxQueryItems: 5000
};
if (inDesignMode == "1") {
    inEditMode = true;
}
var tables = {};
var mGlobal = {
    page: {}
};
var spPermissions = {
    loaded: false,
    site: []
};
$.fn.extend({
    moveUp: function () {
        let before = $(this).prev();
        $(this).insertBefore(before);
    },
    moveDown: function () {
        let after = $(this).next();
        $(this).insertAfter(after);
    },
    getType: function () {
        return this[0].tagName == "INPUT" ? this[0].type.toLowerCase() : this[0].tagName.toLowerCase();
    }
});
$.fn.extend({
    spEnvironment: {
        updatePermission: function (m) {
            if (!spPermissions.loaded) {
                Object.defineProperty(spPermissions, "privileges", {
                    value: m,
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
                spPermissions.loaded = true;
                Object.freeze(spPermissions);
            }
        }
    }
});
//# sourceMappingURL=jquery.spEnv.js.map