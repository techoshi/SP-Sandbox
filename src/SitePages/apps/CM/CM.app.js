
$(document).ready(function(){ 
	 	 	
	 	if(!inEditMode)
	 	{
	 		$('head').append('<style type="text/css">.ms-webpart-zone { display: none; } </style>');
	 	
	 		var loadWhenReady = setInterval(function(){
	 		
	 			if($.fn && $.fn.spCRUD)
	 			{
	 				clearInterval(loadWhenReady);
	 				
	 				$.fn.spCRUD.clear ({});

					$.fn.spCRUD.getList({
						objects : [
							{ name : 'Contracts', search : ['Bureau_Name'], singular : 'Contract', 
								table : { 
									css : { 'width' : '200px', 'min-width' : '200px'},
									columns : [
										{ 
											name : 'Title', 
											css : { 'width' : '100px', 'min-width' : '100px' } 
										}
									] 
								}
							}, 
							{ name : 'Contractors', search : ['Office_Name'], singular : 'Contractor', path : _spPageContextInfo.webAbsoluteUrl  },
							{ name : 'Projects', search : ['Division_Name'], singular : 'Project' }										
						]
					});
	 			}
	 		
	 		}, 50);
			
		}
		else
		{
			$('#DeltaPlaceHolderMain').append('<h1>The JS Application does not load during SharePoint Edit Mode</h1>');
		}
	});
