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
							search: [''],
							singular: 'Contractor',
							config : true
						},
						{
							name: 'S11',
							search: [''],
							singular: 'Project',
							config : true
						},
						{
							name: 'M11',
							search: [''],
							singular: 'Contractor',
							config : true
						},
						{
							name: 'PC11',
							search: [''],
							singular: 'Project',
							config : true
						},
						{
							name: 'LP1',
							search: [''],
							singular: 'Project',
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