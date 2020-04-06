
$(document).ready(function(){ 
	 	 	
	 	if(!inEditMode)
	 	{
	 		$('head').append('<style type="text/css">.ms-webpart-zone { display: none; } </style>');
	 	
	 		var loadWhenReady = setInterval(function(){
	 		
	 			if($.fn && $pa.spCRUD)
	 			{
	 				clearInterval(loadWhenReady);
	 				
	 				$pa.spCRUD.clear({});

					$pa.spCRUD.getList({
						objects : 
						[
							{ name : 'FOClearanceForm3', 
							  search : ['Office_Name'], 
							  singular : 'Office', 
							  path : "/sites/BP/BPi/SPApps", 
							  dtColumns : ["FO-Category", "FO-Type", "Title", "CurrentReviewer", "LastRole", "Date Received", "Due Date", "Stage", "Priority Level", "Lead Division", "LeadAnalyst"],
							  table : { 
									css : { 'width' : '200px', 'min-width' : '200px'},
									columns : [
										{ 
											name : 'Title', 
											css : { 'width' : '300px', 'min-width' : '300px' } 
										},
										{
											name : 'FO-Type', 
											css : { 'width' : '200px', 'min-width' : '200px' } 
										},
										{
											name : 'LeadAnalyst', 
											css : { 'width' : '300px', 'min-width' : '300px' } 
										},
										{
											name : 'Stage', 
											css : { 'width' : '300px', 'min-width' : '300px' } 
										},
										{
											name : 'Date Received', 
											css : { 'width' : '200px', 'min-width' : '200px' } 
										},
										{
											name : 'CurrentReviewer', 
											css : { 'width' : '300px', 'min-width' : '300px' } 
										},
										{
											name : 'FO-Category', 
											css : { 'width' : '200px', 'min-width' : '200px' } 
										}
									] 
								}							  
							}							
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
