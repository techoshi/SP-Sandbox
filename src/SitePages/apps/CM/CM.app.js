
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
							/*{ name : 'Bureaus', search : ['Bureau_Name'], singular : 'Bureau', 
								table : { 
									css : { 'width' : '200px', 'min-width' : '200px'},
									columns : [
										{ 
											name : 'Title', 
											css : { 'width' : '100px', 'min-width' : '100px' } 
										},
										{
											name : 'Bureau_Name', 
											css : { 'width' : '300px', 'min-width' : '300px' } 
										}
									] 
								}
							}, 
							{ name : 'Offices', search : ['Office_Name'], singular : 'Office', path : _spPageContextInfo.webAbsoluteUrl  },
							{ name : 'Divisions', search : ['Division_Name'], singular : 'Division' }, 
							{ name : 'Positions', search : ['Position_Title'], singular : 'Position' }, 
							{ name : 'Billets', singular : 'Billet' }, 
							{ name : 'Duties', singular : 'Duty' }, 
							{ name : 'Activities', singular : 'Activity', 
								relationships: [ 
								{ parent : 'Office', child : 'Division', lookupField: 'Division' },
								{ parent : 'Division', child : 'Billet', lookupField: 'Billet_Identifier' },
								{ parent : 'Billet', child : 'Duty' }
							] },
							{ name : 'Procedures', singular : 'Procedure' },
							{ name : 'Personnel', singular : 'Person' }		*/										
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
