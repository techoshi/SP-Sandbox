$(document).ready(function () {

	if (!inEditMode) {
		$('head').append('<style type="text/css">.ms-webpart-zone { display: none; } </style>');

		var loadWhenReady = setInterval(function () {

			if ($.fn && $.fn.spCRUD) {
				clearInterval(loadWhenReady);

				$.fn.spCRUD.clear({});

				$.fn.spCRUD.getList({
					objects: [{
							name: 'DCMain',
							tabTitle: 'Document Clearance',
							search: [''],
							singular: 'Document Clearance',
							table: {
								css: {
									'width': '200px',
									'min-width': '200px'
								},
								columns: [{
									name: 'Title',
									css: {
										'width': '100px',
										'min-width': '100px'
									}
								}]
							}
						},
						{
							name: 'P11',
							tabTitle: 'Clearance Priorities',
							search: [''],
							singular: 'Clearance Priority',
							config : true
						},
						{
							name: 'S11',
							tabTitle: 'Clearance Sources',
							search: [''],
							singular: 'Clearance Source',
							config : true
						},
						{
							name: 'M11',
							tabTitle: 'Markings',
							search: [''],
							singular: 'Marking',
							config : true
						},
						{
							name: 'PC11',
							tabTitle: 'Portfiolio Categories',
							search: [''],
							singular: 'Portfiolio Category',
							config : true
						},
						{
							name: 'LP11',
							tabTitle: 'Lead Portfolios',
							search: [''],
							singular: 'Lead Portfolio',
							config : true
						}
					]
				});
			}
		}, 50);

	} else {
		$('#DeltaPlaceHolderMain').append('<h1>The JS Application does not load during SharePoint Edit Mode</h1>');
	}
});