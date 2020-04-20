import * as $ from 'jquery';
import * as spEnv from "./spa.spEnv";

export var promptDialog = function promptDialog() {

    function _prompt(model:any) {
    
    	model.height = model.height == undefined ? 'auto' : model.height;
    	model.width = model.width == undefined ? 'auto' : model.width;
    	model.closeOnEscape = model.closeOnEscape == undefined ? true : model.closeOnEscape;
    	model.removeClose = model.removeClose == undefined ? false : model.removeClose;

        if ($('#' + model.promptID + '').length > 0) {
            $('#' + model.promptID + '').modal('hide');        
            $('#' + model.promptID + '').remove();
        }

        $('body').append(spEnv.$pa.env.promptModal(model));       
        
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
    }

    return {
        prompt: function (model) {
            _prompt(model);
        }
    };
}();
