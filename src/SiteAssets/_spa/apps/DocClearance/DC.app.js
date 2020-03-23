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
										'width': '300px',
										'min-width': '300px'
									}
								}]
							},
							children: [{
								listName: 'WKFL',
								name: 'WKFL',
								sectionName: "Approval/Review Area",
								condition: "DCMain eq {{ID}}",
								repeatable: { enable : true, hasReorder: true },
								wholeForm: false,
								columns: {
									visible: ["RoleType", "Participant", "Status", "DateApproved"],
									hidden: ["Title", "DCMain"]
								},
								availableParent: ["edit"],
								singular: 'Participant',
								
							}]
						},
						{
							name: 'WKFL',
							tabTitle: 'Document Clearance Flow',
							search: [''],
							singular: 'Document Clearance Flow',
							hidden: true,
							table: {
								css: {
									'width': '200px',
									'min-width': '200px'
								},
								columns: [{
									name: 'Title',
									css: {
										'width': '300px',
										'min-width': '300px'
									}
								}]
							},
						},
						{
							name: 'P11',
							tabTitle: 'Clearance Priorities',
							search: [''],
							singular: 'Clearance Priority',
							config: true
						},
						{
							name: 'S11',
							tabTitle: 'Clearance Sources',
							search: [''],
							singular: 'Clearance Source',
							config: true
						},
						{
							name: 'M11',
							tabTitle: 'Markings',
							search: [''],
							singular: 'Marking',
							config: true
						},
						{
							name: 'PC11',
							tabTitle: 'Portfolio Categories',
							search: [''],
							singular: 'Portfolio Category',
							config: true
						},
						{
							name: 'LP11',
							tabTitle: 'Lead Portfolios',
							search: [''],
							singular: 'Lead Portfolio',
							config: true
						},
						{
							name: 'ST11',
							tabTitle: 'Doc Status',
							search: [''],
							singular: 'Document Status',
							config: true
						},
						{
							name: 'UT11',
							tabTitle: 'Role Types',
							search: [''],
							singular: 'Role Type',
							config: true
						}
					]
				});
			}
		}, 50);

	} else {
		$('#DeltaPlaceHolderMain').append('<h1>The JS Application does not load during SharePoint Edit Mode</h1>');
	}
});