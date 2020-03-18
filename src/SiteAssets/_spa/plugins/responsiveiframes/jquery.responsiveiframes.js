// ==ClosureCompiler==
// @externs_url https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/jquery-1.9.js
// ==/ClosureCompiler==
/** @preserve jquery.responsiveiframes
 * git://github.com/danielgindi/jquery.responsiveiframes.git
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('jquery.responsiveiframes', ['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        /*root.responsiveiframes = */factory(root.jQuery);
    }
}(this, function ($) {
    'use strict';
    
    $(window).on('resize load', function() {
          
        $('iframe,embed').not('.no-aspect-ratio').not('.disable-responsive-iframes').each(function() {
            
            var $el = $(this);
            if ($el.parent().hasClass('backstretch-item')) return; // Avoid clashes with jquery.backstretch plugin
            if ($el.closest('disable-responsive-iframes').length) return; // Allow disabling nested responsibe iframes
            
            var aspectRatio = $el.data('aspect-ratio'), maxWidth = $el.data('max-width');
            
            if (aspectRatio == null) {
                
                maxWidth = parseFloat($el.css('width'))
                    ? $el.width()
                    : Infinity;
                
                aspectRatio = $el.height() / $el.width();
                
                $el.data({ 'aspect-ratio': aspectRatio, 'max-width': maxWidth })
                    .removeAttr('height')
                    .removeAttr('width')
                    .css({ 'width': '', 'height': '' });
            }
            
            var sizeParent = $el.parent();
            while (sizeParent.css('display') === 'inline') {
                sizeParent = sizeParent.parent();
            }
            
            if (sizeParent.length) {
                var width = Math.min(maxWidth, sizeParent.width());
                $el
                    .width(width)
                    .height(width * $el.data('aspect-ratio'));
            }
        });
        
    });
    
}));
