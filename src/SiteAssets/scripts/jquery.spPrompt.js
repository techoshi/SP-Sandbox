var promptDialog = function promptDialog() {

    function _prompt(model) {
    
    	model.height = model.height == undefined ? 'auto' : model.height;
    	model.width = model.width == undefined ? 'auto' : model.width;
    	model.closeOnEscape = model.closeOnEscape == undefined ? true : model.closeOnEscape;
    	model.removeClose = model.removeClose == undefined ? false : model.removeClose;

        if ($('#' + model.promptID + '').length > 0) {
            $('#' + model.promptID + '').modal('hide');        
            $('#' + model.promptID + '').remove();
        }

        $('body').append($.fn.spEnvironment.promptModal(model));       
        
        if(model.open && typeof model.open == "function")
        {
            $('#' + model.promptID).unbind('show.bs.modal', model.open);
        	$('#' + model.promptID).bind('show.bs.modal', model.open);
        }
        
        if(model.opened && typeof model.open == "function")
        {
        	$('#' + model.promptID).unbind('shown.bs.modal', model.opened);
        	$('#' + model.promptID).bind('shown.bs.modal', model.opened);
        }
        
        if(model.close && typeof model.close == "function")
        {
        	$('#' + model.promptID).unbind('hide.bs.modal', model.close);
        	$('#' + model.promptID).bind('hide.bs.modal', model.close);
        }
        
        if(model.closed && typeof model.closed == "function")
        {
        	$('#' + model.promptID).unbind('hidden.bs.modal', model.closed);
        	$('#' + model.promptID).bind('hidden.bs.modal', model.closed);
        }
		
		if(model.buttons)
		{
			for(var bi = 0; bi < model.buttons.length; bi++)
			{
				var thisButton = model.buttons[bi];
				if(typeof thisButton.click == "function")
				{
					var buttonSelector = '#' + model.promptID + '-btn-' + bi;
					$(buttonSelector ).unbind('click', thisButton.click);
					$(buttonSelector ).bind('click', thisButton.click);
					
					if (thisButton.active)
					{
						$(buttonSelector).focus();
					}
				}
			}
		}

		$('#' + model.promptID).modal({ show : true, keyboard: model.closeOnEscape, focus: true } );
       /* $('#' + model.promptID + '').dialog({
            resizable: model.resizable == undefined ? false : model.resizable,
            draggable: model.draggable == undefined ? false : model.draggable,
            closeOnEscape: model.closeOnEscape == undefined ? true : model.closeOnEscape,
            title: model.header == undefined ? 'Prompt' : model.header,
            modal: model.modal == undefined ? true : model.modal,
            width: model.width == undefined ? '400px' : model.width,
            height: model.height == undefined ? 'auto' : model.height,
            bgiframe: model.bgiframe == undefined ? false : model.bgiframe,
            hide: model.hide == undefined ? { effect: 'scale', duration: 400 } : model.hide,
            open: model.open == undefined ? undefind : model.open,
            beforeClose: function () {
                if (model.forceBackDrop) {
                    $('#forceBackDrop').remove();

                    //this will move the background/overlay back behiond the modal when closing a dialog that was opened over top of a modal
                    $('.modal-backdrop').css('z-index', '');
                }
            },
            buttons: model.buttons == undefined ? [
                {
                    text: 'OK',
                    click: function () {
                        $(this).dialog('close');
                    }
                }] : model.buttons
        });

        $('#' + model.promptID + '').parents('.ui-dialog').css('z-index', '99999');

        if (model.forceBackDrop) {
            var _forceBackDrop = '<div id="forceBackDrop" class="ui-widget-overlay ui-front" style="z-index: 99998;"></div>';

            //this will move the background/overlay above the modal (but behind the dialog) when opening a dialog on top of a modal window
            $('.modal-backdrop').css('z-index', '10052');

            $('body').append(_forceBackDrop);
        }*/
    }

    return {
        prompt: function (model) {
            _prompt(model);
        }
    };
}();
