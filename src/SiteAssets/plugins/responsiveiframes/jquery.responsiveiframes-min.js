/*
 jquery.responsiveiframes
 git://github.com/danielgindi/jquery.responsiveiframes.git
*/
(function(d,a){"function"===typeof define&&define.amd?define("jquery.responsiveiframes",["jquery"],a):"object"===typeof exports?module.exports=a(require("jquery")):a(d.jQuery)})(this,function(d){d(window).on("resize load",function(){d("iframe,embed").not(".no-aspect-ratio").not(".disable-responsive-iframes").each(function(){var a=d(this);if(!a.parent().hasClass("backstretch-item")&&!a.closest("disable-responsive-iframes").length){var b=a.data("aspect-ratio"),c=a.data("max-width");null==b&&(c=parseFloat(a.css("width"))?
a.width():Infinity,b=a.height()/a.width(),a.data({"aspect-ratio":b,"max-width":c}).removeAttr("height").removeAttr("width").css({width:"",height:""}));for(b=a.parent();"inline"===b.css("display");)b=b.parent();b.length&&(c=Math.min(c,b.width()),a.width(c).height(c*a.data("aspect-ratio")))}})})});
