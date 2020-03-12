<%-- _lcid="1033" _version="16.0.19819" _dal="1" --%>
<%-- _LocalBinding --%>
<%@ Page language="C#" MasterPageFile="~masterurl/default.master"    Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c"  %> <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Import Namespace="Microsoft.SharePoint" %> <%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
	<SharePoint:ListItemProperty Property="BaseName" maxlength="40" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
	<meta name="GENERATOR" content="Microsoft SharePoint" />
	<meta name="ProgId" content="SharePoint.WebPartPage.Document" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="CollaborationServer" content="SharePoint Team Web Site" />
	<SharePoint:ScriptBlock runat="server">
	var navBarHelpOverrideKey = "WSSEndUser";
	</SharePoint:ScriptBlock>
<SharePoint:StyleBlock runat="server">
body #s4-leftpanel {
	display:none;
}
.s4-ca {
	margin-left:0px;
}
</SharePoint:StyleBlock>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderSearchArea" runat="server">
<SharePoint:FlightedContent runat="server" ExpFeature="Reserved_Server_ExpFeature30731" RenderIfInFlight="true">
	<SharePoint:SearchInNavBarEnabledContent runat="server" RenderIfEnabled="false">
		<SharePoint:DelegateControl runat="server" ControlId="SmallSearchInputBox" />
	</Sharepoint:SearchInNavBarEnabledContent>
	<SharePoint:SearchInNavBarEnabledContent runat="server" RenderIfEnabled="true">
		<SharePoint:WebTemplateBasedContent runat="server" WebTemplates="STS|BLANKINTERNET|CMSPUBLISHING|GROUP" RenderIfInWebTemplates="false">
			<SharePoint:DelegateControl runat="server" ControlId="SmallSearchInputBox" />
		</SharePoint:WebTemplateBasedContent>
	</Sharepoint:SearchInNavBarEnabledContent>
</SharePoint:FlightedContent>
<SharePoint:FlightedContent runat="server" ExpFeature="Reserved_Server_ExpFeature30731" RenderIfInFlight="false">
	<SharePoint:DelegateControl runat="server" ControlId="SmallSearchInputBox" />
</SharePoint:FlightedContent>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageDescription" runat="server">
	<SharePoint:ProjectProperty Property="Description" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">

	<!-- #region HANDLEBARS-->
	<script type="text/template" id="the_loader_template">
    
		<div class="modal-backdrop in the-Loader-wrap app-loader-text-centered {{id}}" style="opacity: 0; z-index: 999999;">
			<div class="app-loader">
				<div class="app-loader-text">
					<div id="" class="modal-backdrop the-Loader {{id}}" style="display: none; opacity: 0; z-index: 999999;">
						<div class=circleGWrap>
							<div id="circleG">
								<div id="circleG_1" class="circleG"></div>
								<div id="circleG_2" class="circleG"></div>
								<div id="circleG_3" class="circleG"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	
	</script>
	
	<script type="text/template" id="sp_tab_container">
	<div class="row">
		<div class="col-md-12 container" style="padding: 20px 0px 0px 50px">
			<ul class="nav nav-tabs spa-app-items">
			</ul>
			<div class="tab-content" id="sp-app-contents" style="padding: 20px 0px 0px 0px;">
			</div>
		</div>
	</div>
	</script>
	
	<script type="text/template" id="sp_file_attachment">
	<i class="fa fa-paperclip" />
	</script>
	
	<script type="text/template" id="sp_jstree_template">
		<div id="container_{{name}}">
			<h1>{{title}}</h2>
			<div id="tree_size_{{name}}">
				<ul>
					{{#d.results}}
						<li data-jstree='{"icon":"fa fa-file-o"}'>
							<a href="#">ObjectName : <strong>{{Title}}</strong></a>
							<ul>
								<li data-jstree='{"icon":"fa fa-cog"}'>Type: {{TypeAsString}}</li>
								{{#ifCondition TypeAsString ' == "Lookup"'}}<li data-jstree='{"icon":"fa fa-sitemap"}'>Lookup Field: {{LookupField}}</li>{{/ifCondition}}
								<li data-jstree='{"icon":"fa fa-filter"}'>Filterable: {{Filterable}}</li>
							</ul>					
						</li>
					{{/d.results}}
				</ul>
			</div>
		</div>
	</script>
	<script type="text/template" id="bootstrap-nav-li">
		<li class="nav-item"><a class="nav-link {{#if active}}active{{/if}}" id="nav-tab-{{name}}" data-owner="{{name}}" data-toggle="tab" href="#nav-{{name}}" role="tab" aria-controls="home" aria-selected="false">{{title}}</a></li>
	</script>
	<script type="text/template" id="bootstrap-nav-div">
		<div class="tab-pane {{#if active}}active{{/if}}" id="nav-{{name}}" role="" aria-labelledby="{{name}}-tab">{{> listTabs}}</div>
	</script>
	<script type="text/template" id="list-family">
	<ul class="nav nav-tabs" id="lf-item-container-{{name}}" role="lf-item-container-{{name}}">
		  <li class="nav-item">
			<a class="nav-link active" id="data-tab" data-toggle="tab" href="#lf-list-{{name}}" data-hastable="true" data-tablename="{{name}}" role="tab" aria-controls="data-tab" aria-selected="true">Data</a>
		  </li>
		  <!--li class="nav-item">
			<a class="nav-link" id="form-tab" data-toggle="tab" href="#lf-form-{{name}}" role="tab" aria-controls="form-tab" aria-selected="false">Form</a>
		  </li-->
		  <li class="nav-item">
			<a class="nav-link" id="tree-tab" data-toggle="tab" href="#lf-tree-{{name}}" role="tab" aria-controls="tree-tab" aria-selected="false">Tree</a>
		  </li>
	</ul>
	<div class="tab-content" id="lf-content-container-{{name}}" style="padding-top: 20px;">
		  <div class="tab-pane fade show active" id="lf-list-{{name}}" role="tabpanel" aria-labelledby="data-tab">
			  <div class="row no-horizontal-margin">
				  <div class="col-md-10" id="spTable-wrap-{{name}}" style="padding-right: 0;">{{> spTable}}</div>
				  <div class="col-md-2 no-horizontal-padding" id="spActions-wrap-{{name}}"></div>
			  </div>
		  </div>
		  <!--div class="tab-pane fade" id="lf-form-{{name}}" role="tabpanel" aria-labelledby="form-tab">{{> spForm}}</div-->
		<div class="tab-pane fade" id="lf-tree-{{name}}" role="tabpanel" aria-labelledby="tree-tab">{{> jsTree}}</div>
	</div>
	</script>
	<script type="text/template" id="tabs-template">
	<ul class="nav nav-tabs" id="tab-item-container-{{name}}" role="lf-item-container-{{name}}">
		{{#tabs}}		
		  <li class="nav-item">
			<a 
				{{#if active}}
					class="nav-link active" 
					aria-selected="true"
				{{else}}
					class="nav-link" 
					aria-selected="false"
				{{/if}}
				id="{{li_id}}" 
				data-toggle="tab" 
				href="#{{div_id}}" 
				data-tablename="{{name}}" 
				role="tab" 
				aria-controls="{{li_id}}"     		
				{{{li_attr}}}
			>
				{{li_title}}
			</a>
		  </li>  		
		  {{/tabs}}
	</ul>
	<div class="tab-content" id="tab-content-container-{{name}}" style="padding-top: 10px;">
		{{#tabs}}
		  <div 
			  {{#if active}}
			  class="tab-pane fade show active" 
			  {{else}}
			  class="tab-pane fade"
			{{/if}}
			  id="{{div_id}}" 
			  role="tabpanel" 
			  aria-labelledby="{{li_id}}"
			  {{{div_attr}}}>
			  {{{htmlContent}}}
		  </div>
		  {{/tabs}}
	</div>
	
	</script>
	<script type="text/template" id="sp_delete_item">
	<div class="form col-md-12 form-container" id="form-{{formType}}-{{name}}" data-source="{{name}}" data-formtype="{{formType}}"	 data-basetemplate="{{baseTemplate}}">
		<input type="hidden" name="{{@root.name}}.ID" data-name="ID"/>
		<h2>You are about to delete an item. Continue?</h2>
		<button type="button" class="btn btn-primary delete-data" data-source="{{name}}" data-sptype="{{title}}" data-owner="form-{{formType}}-{{name}}" data-action="Delete">Delete</button>
	</div>
	</script>
	<script type="text/template" id="sp_forms_template">
		{{#switch formType}}
			{{#case "create"}}{{setVar "formType" "create"}}{{/case}}
			{{#case "view"}}{{setVar "formType" "view"}} {{setVar "hasID" true}}{{/case}}
			{{#case "edit"}}{{setVar "formType" "edit"}} {{setVar "hasID" true}}{{/case}}
			{{#default}}{{setVar "formType" "create"}}{{/default}}
		{{/switch}}
	
	
		<div class="form row form-container" id="form-{{formType}}-{{name}}" data-source="{{name}}" data-formtype="{{formType}}" data-basetemplate="{{baseTemplate}}" style="margin-right: 0;">
			{{#if hasID}}
				<input type="hidden" name="{{@root.name}}.ID" data-name="ID" data-entity="ID"/>
			{{/if}}
			{{#d.results}}
				{{#if spLoadObject}}
				<div class="form-group {{#switch TypeAsString}}{{#case "Attachments" "File" }}col-md-12{{/case}}{{#default}}col-md-6{{/default}}{{/switch}}">
					{{#switch TypeAsString}}
						{{#case "Text" "Choice" "MultiChoice" "Lookup" "Note" "UserMulti" "Attachments" "File" "User" "DateTime" "Number" "Currency"}}
							<label for="{{Title}}" style="{{#ifCondition Title '== "Title"'}}{{#ifCondition formType '== "create"'}}Display:none;{{/ifCondition}}{{/ifCondition}} width: 100%;">{{{replace Title '_' ' '}}}{{#if Required}}<span style="color:red;">*</span>{{/if}}</label>
						{{/case}}			
					{{/switch}}				
					{{#switch TypeAsString}}
						{{#case "Text"}}
							<input type="text" id="{{uiID}}" class="form-control" style="{{#ifCondition Title '== "Title"'}}{{#ifCondition formType '== "create"'}}Display:none;{{/ifCondition}}{{/ifCondition}}" name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}" data-name="{{Title}}" aria-describedby="{{Title}}Help" placeholder="Enter {{{replace Title '_' ' '}}}" data-defaultvalue="{{DefaultValue}}" value="{{DefaultValue}}" {{#if Required}}required{{/if}}/>
						{{/case}}
						{{#case "Number"}}
							<input type="text" id="{{uiID}}" class="form-control sp-Number" style="" name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}" data-name="{{Title}}" aria-describedby="{{Title}}Help" placeholder="Enter {{{replace Title '_' ' '}}}" data-defaultvalue="{{DefaultValue}}" value="{{DefaultValue}}" {{#if Required}}required{{/if}}/>
						{{/case}}
						{{#case "Currency" }}
							<input type="text" id="{{uiID}}" class="form-control sp-Currency" style="" name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}" data-name="{{Title}}" aria-describedby="{{Title}}Help" placeholder="Enter {{{replace Title '_' ' '}}}" data-defaultvalue="{{DefaultValue}}" value="{{DefaultValue}}" {{#if Required}}required{{/if}}/>
						{{/case}}
						{{#case "MultiChoice"}}
							<select multiple type="text" id="{{uiID}}" class="form-control select2-js" name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}" data-name="{{Title}}"  aria-describedby="{{Title}}Help" placeholder="Enter {{Title}}" data-defaultvalue="{{DefaultValue}}" {{#if Required}}required{{/if}}>
								{{!<option value="">Please Select {{replace Title '/_/' ' '}}</option>}}
								{{#Choices.results}}
									<option value="{{this}}">{{this}}</option>
								{{/Choices.results}}
							</select>
						{{/case}}
						{{#case "Boolean"}}
							<input type="checkbox" id="{{uiID}}" class="" name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}" data-name="{{Title}}" {{#if Required}}required{{/if}}>
							<label class="" for="{{uiID}}">Check this custom checkbox</label>
							<div class="invalid-feedback"></div>
						{{/case}}
						{{#case "Choice"}}
							{{#switch EditFormat}}
								{{#case 0}}
									<select type="text" id="{{uiID}}" class="form-control select2-js" name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}" data-name="{{Title}}"  aria-describedby="{{Title}}Help" placeholder="Enter {{Title}}" data-defaultvalue="{{DefaultValue}}" {{#if Required}}required{{/if}}>
										<option value="">Please Select {{replace Title '/_/' ' '}}</option>
										{{#Choices.results}}
											<option value="{{this}}">{{this}}</option>
										{{/Choices.results}}
									</select>	
									{{#if FillInChoice}}
										{{#switch @root.formType}}
											{{#case "create" "edit"}}
												<a href="javascript:void(0);" for="{{uiID}}" class="sp-fill-in" data-choicetype="dropdown" data-toggle="popover" name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}" data-source="{{@root.name}}" data-owner="{{Title}}" data-editformat="{{EditFormat}}" data-trigger="hover" data-placement="top" title="Add New Value" data-content="Your desired value is not in the list? Click the plus and add it."><i class="fa fa-plus-circle"></i></a>						    		
											{{/case}}
										{{/switch}}
									{{/if}}	    					
								{{/case}}
								{{#case 1}}
									{{! <div class="form-check form-check-inline"> }}
									<div id="{{uiID}}" class="sp-radio-wrapper" data-uuid="{{uiID}}" data-source="{{@root.name}}"  data-entity="{{EntityPropertyName}}" data-for="{{Title}}" data-action="{{@root.formType}}">
										{{#Choices.results}}
											<div class="form-check">
												  <input class="form-check-input" for="{{../uiID}}" type="radio" name="{{@root.name}}.{{../Title}}" data-entity="{{../EntityPropertyName}}" id="{{@root.formType}}.{{@root.name}}.{{../Title}}{{@index}}" data-name="{{../Title}}" value="{{this}}" >
												  <label class="form-check-label" for="">{{this}}</label>
											</div>
										{{/Choices.results}}
									</div>
									{{#if FillInChoice}}
										{{#switch @root.formType}}
											{{#case "create" "edit"}}
												<div class="">
													<a href="javascript:void(0);" for="{{uiID}}" class="sp-fill-in" data-choicetype="radio" style="position: relative; padding: 0px;" data-toggle="popover" name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}" data-source="{{@root.name}}" data-owner="{{Title}}" data-editformat="{{EditFormat}}" data-trigger="hover" data-placement="top" title="Add New Value" data-content="Your desired value is not in the list? Click the plus and add it."><i class="fa fa-plus-circle"></i> Add new value</a>						    		
												</div>
											{{/case}}
											
										{{/switch}}
									{{/if}}
					
								{{/case}}
								{{#case 2}}
									<select multiple type="text" id="{{uiID}}" class="form-control select2-js" name="{{@root.name}}.{{../Title}}" data-entity="{{EntityPropertyName}}" data-name="{{Title}}"  aria-describedby="{{../Title}}Help" placeholder="Enter {{Title}}" data-defaultvalue="{{DefaultValue}}" {{#if Required}}required{{/if}}>
										<option value="">Please Select {{replace Title '/_/' ' '}}</option>
										{{#Choices.results}}
											<option value="{{this}}">{{this}}</option>
										{{/Choices.results}}
									</select>
									{{#if FillInChoice}}
										{{#switch @root.formType}}
											{{#case "create" "edit"}}
												<a href="javascript:void(0);" class="sp-fill-in" data-choicetype="dropdown" data-toggle="popover" name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}" data-source="{{@root.name}}" data-owner="{{Title}}" data-editformat="{{EditFormat}}" data-trigger="hover" data-placement="top" title="Add New Value" data-content="Your desired value is not in the list? Click the plus and add it."><i class="fa fa-plus-circle"></i></a>						    		
											{{/case}}
										{{/switch}}
									{{/if}}		    					
								{{/case}}
							{{/switch}}
						{{/case}}
						{{#case "Lookup"}}
							<select type="text" id="{{uiID}}" class="form-control sp-lookup" name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}Id" data-owner="{{@root.name}}" data-name="{{Title}}Id" data-selectname="{{Title}}" aria-describedby="{{Title}}Help" placeholder="Enter {{Title}}" data-defaultvalue="{{DefaultValue}}" {{#if Required}}required{{/if}} {{#if hasDropDownRelationship}}data-child="{{dropDownRelationship.child}}" data-lookupfield="{{dropDownRelationship.lookupField}}"{{/if}}>
								<option value="">Please Select {{replace Title '/_/' ' '}}</option>
								{{#LookupData.results}}
									<option value="{{Id}}">{{lookupText}}</option>
								{{/LookupData.results}}
							</select>
						{{/case}}
						{{#case "User" "UserMulti"}}
							<input type="hidden" id="{{uiID}}" name="{{@root.formType}}.{{@root.name}}.{{Title}}" data-name="{{Title}}" data-owner="{{@root.name}}" data-entity="{{EntityPropertyName}}" data-multi="{{AllowMultipleValues}}" class="people-picker-data">
							<div id="{{randomUUID}}" type="sp-people" data-name="{{@root.formType}}.{{@root.name}}.{{Title}}" class="people-picker"  data-owner="{{@root.name}}" data-multi="{{AllowMultipleValues}}" data-type="{{#ifCondition SelectionMode '== 0'}}User{{else}}Group{{/ifCondition}}" data-selectiongroup="{{SelectionGroup}}"></div>
							<div class="picker-meta-data" data-name="{{@root.formType}}.{{@root.name}}.{{Title}}"></div>
						{{/case}}
						{{#case "Note"}}
							<textarea id="{{uiID}}" type="text" class="form-control" name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}" data-name="{{Title}}" aria-describedby="{{Title}}Help" placeholder="Enter {{{replace Title '_' ' '}}}" value="{{DefaultValue}}" {{#if Required}}required{{/if}}/>
						{{/case}}
						{{#case "DateTime"}}
							<input type="text" id="{{uiID}}" class="form-control sp-calendar" style="" name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}" data-name="{{Title}}" aria-describedby="{{Title}}Help" placeholder="Enter {{{replace Title '_' ' '}}}" data-defaultvalue="{{DefaultValue}}" value="{{DefaultValue}}" {{#if Required}}required{{/if}}/>
						{{/case}}
						{{#case "Attachments" "File"}}
							<div class="file_inventory" data-filecontainer="{{@root.formType}}-{{@root.name}}-attachments" >
								<div class="box__inventory">
								</div>
							</div>
							{{#switch @root.formType}}
							{{#case "create" "edit"}}
							<div class="box {{@root.name}}-attachments" id="{{@root.formType}}-{{@root.name}}-attachments">						
								<div class="box__input">
									<svg class="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path></svg>
									<input class="box__file" id="{{uiID}}" type="file" name="{{@root.formType}}.{{@root.name}}.{{Title}}" data-name="{{@root.name}}.{{Title}}" data-entity="{{EntityPropertyName}}" id="{{@root.formType}}.{{@root.name}}.{{Title}}" data-multiple-caption="{count} files selected" {{#ifCondition multiple ' == false'}} {{else}}multiple="multiple"{{/ifCondition}} {{#if Required}}required{{/if}}/>
									<label class="box__file_label" for="{{@root.formType}}.{{@root.name}}.{{Title}}"><strong>Choose a file</strong><span class="box__dragndrop"> or drag it here</span>.</label>
									{{#ifCondition multiple ' == false'}} 
										<label class="box__file_label" for="{{@root.formType}}.{{@root.name}}.{{Title}}"><strong>Single File Upload</strong><span class="box__dragndrop"> This Uploader only uploads one file at a time.</span>.</label> 
									{{else}}
										<label class="box__file_label" for="{{@root.formType}}.{{@root.name}}.{{Title}}"><strong>Multi File Upload</strong><span class="box__dragndrop"> This uploader can only uploads multiple files.</span>.</label> 
									{{/ifCondition}}
									<button class="box__button" type="submit">Upload</button>
								</div>
								<div class="box__uploading">Uploading&hellip;</div>
								<div class="box__success">Done!</div>
							<div class="box__error">Error! <span></span>.</div>	
							</div>	
							{{/case}}
							{{/switch}}								 
						{{/case}}
						{{#case "Computed"}}
						{{/case}}
						{{#default}}{{TypeAsString}}{{/default}}
					{{/switch}}
					<small id="{{@root.name}}.{{Title}}.Help" class="form-text text-muted"></small>			
				</div>
				{{/if}}
			{{/d.results}}
			{{#switch formType}}
				{{#case "edit"}}
					<button type="button" class="btn btn-primary save-data" data-source="{{name}}" data-sptype="{{title}}" data-owner="form-{{formType}}-{{name}}" data-action="Update">Update Form</button>
				{{/case}}
				{{#case "view"}}{{/case}}
				{{#default}}{{setVar "formType" "create"}}
					<button type="button" class="btn btn-primary save-data" data-source="{{name}}" data-sptype="{{title}}" data-owner="form-{{formType}}-{{name}}" data-action="Save">Save Form</button>
					<button type="button" class="btn btn-success clear-data" data-source="{{name}}" data-sptype="{{title}}" data-owner="form-{{formType}}-{{name}}" data-action="Reset">Reset Form</button>
				{{/default}}
			{{/switch}}
	
			
		</div>
	</script>
	
	<script type="text/template" id="sp_table_template">
		<table class="table table-sm" id="{{name}}" data-table="{{name}}" >
			<thead>
			<tr>
			{{#d.results}}		
			{{#if spLoadObject}}	
				{{#switch TypeAsString}}
					{{#case "Attachments"}}
						<th class="css_dt_{{@root.name}} css_{{replace EntityPropertyName ' ' '_'}}" scope="col" data-name="{{EntityPropertyName}}" data-type="{{TypeAsString}}">{{{replace Title '_' ' '}}}</th>
					{{/case}}
					{{#default}}{{/default}}
				{{/switch}}
			{{/if}}
			{{/d.results}}
			{{#d.results}}	
				{{#if spLoadObject}}		
					{{#switch TypeAsString}}
						{{#case "Text" "Choice" "MultiChoice" "Lookup" "Note" "UserMulti" "Computed" "File" "User" "DateTime" "Boolean" "Number" "Currency"}}
							<th class="css_dt_{{@root.name}} css_{{replace EntityPropertyName ' ' '_'}}" scope="col" data-name="{{EntityPropertyName}}" data-type="{{TypeAsString}}">{{{replace Title '_' ' '}}}</th>
						{{/case}}
						{{#default}}{{/default}}
					{{/switch}}
				{{/if}}		{{/d.results}}
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</script>
	
	<script type="text/template" id="sp_file_inventory_template">
		<table class="table">
			<thead>
				<tr>
					<th>File</th>
					{{#if officeLinks}}<th>Edit Options</th>{{/if}}
					<th>Last Modified</th>
					{{#if create}}<th>Size</th>{{/if}}
					
					{{#unless view}}<th></th>{{/unless}}
				</tr>
			</thead>
			<tbody>
				{{#files}}			
				<tr>
					<td style="width: 50%">
						<i class="fa fa-paperclip" /> {{#if ServerRelativeUrl}}<a target="_blank" href="{{ServerRelativeUrl}}">{{FileName}}</a>{{else}}{{name}}{{/if}}
					</td>				
					{{#if ../officeLinks}}
					<td>
						{{#switch extension}}
							{{#case "docx" "doc" "xlsx" "xls" "ppt" "pptx"}}
								<a href="{{ServerRelativeUrl}}?Web=1" target="_blank" title="Open Document in Office Online." class="fileDownloadSimpleRichExperience" style="text-decoration:underline;color:#256cba"><i><b>Edit Online</b></i></a>
							{{/case}}
							{{#default}}
								<a href="{{ServerRelativeUrl}}?Web=1" target="_blank" title="Download {{extension}}." class="fileDownloadSimpleRichExperience" style="text-decoration:underline;color:#256cba"><i><b>Download</b></i></a>
							{{/default}}
						{{/switch}}
	
						{{#switch extension}}
						{{#case "docx" "doc"}} | <a href="ms-word:ofe|u|{{exactURL}}?Web=1" target="_blank" title="Open Document in Word."  class="fileDownloadSimpleRichExperience" style="text-decoration:underline;color:#256cba"><i><b>MS Word</b></i></a>{{/case}}
						{{#case "xlsx" "xls"}} | <a href="ms-excel:ofe|u|{{exactURL}}?Web=1" target="_blank" title="Open Document in Excel." class="fileDownloadSimpleRichExperience" style="text-decoration:underline;color:#256cba"><i><b>MS Excel</b></i></a>{{/case}}
						{{#case "ppt" "pptx"}} | <a href="ms-powerpoint:ofe|u|{{exactURL}}" target="_blank" title="Open Document in PowerPoint." class="fileDownloadSimpleRichExperience" style="text-decoration:underline;color:#256cba"><i><b>MS PowerPoint</b></i></a>{{/case}}
						{{#default}}{{/default}}
						
						{{/switch}}
					</td>
					{{/if}}	
					<td style="width: 20%">
						{{fileDate lastModified}}
					</td>
					{{#if ../create}}<td style="width: 10%">{{#if ServerRelativeUrl}}{{else}}{{size}} Bytes{{/if}}</td>{{/if}}	
							
					{{#unless ../view}}
						<td style="width: 10%; text-align:center;"><a href="javascript:void(0);" data-owner="{{../owner}}" data-item="{{#if ../itemURL}}{{../itemURL}}{{/if}}" data-name="{{FileName}}" class="{{#if ../create}}Remove-File{{else}}Delete-Attachment-File{{/if}}"><i class="fa fa-trash"/></a></td>
					{{/unless}}
				</tr>
				{{/files}}
			</tbody>
		</table>
	</script>
	
	<script type="text/template" id="datatable_refresh_html">
		<a type="button" href="javascript:void(0);" class="actionRefresh btn btn-default iris-pager-nav iris-pager-nav-btn" style="margin: -9px 0px 0px 0px;" data-owner="{{owner}}" title="Refresh Data From SharePoint Server">
			<span class="fa fa-refresh" style="color: #aaaaaa !important"></span>
		</a>
	</script>
	
	<script type="text/template" id="list-anchor-items-template">
	<ul class="list-anchors" id="list-anchor-items-{{name}}">
		{{#actions}}		
		  <li class="list-anchor-items">
			<a class="{{classes}}" id="{{id}}" href="{{href}}" {{{attributes}}}> {{{i}}} {{title}}</a>
		  </li>  		
		  {{/actions}}
	</ul>
	</script>
	
	
	<script type="text/template" id="sp-modal-template">
	<div class="modal fade" id="modal-{{id}}" data-action="{{action}}" data-owner="{{owner}}" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="{{id}}Title" aria-hidden="true">
	<!-- Modal -->
		<div class="modal-dialog {{#if modalcentered}}modal-dialog-centered{{/if}}" role="document" style="{{#if minWidth}}min-width: {{minWidth}};{{/if}}">
			<div class="modal-content">
				  <div class="modal-header">
					<h5 class="modal-title" id="modal-title-{{id}}">{{title}}</h5>
					   <button type="button" class="close" data-dismiss="modal" aria-label="Close">
						  <span aria-hidden="true">&times;</span>
					   </button>
				  </div>
				  <div class="modal-body modal-overflow">
					{{{content}}}
				 </div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				</div>
			</div>
		  </div>
	</div>
	</script>
	
	<script type="text/template" id="sp-search-condition">
	{{#columns}}
		o["{{name}}"].toString().toLowerCase().indexOf("{{toLowerCase ../search.value}}") > -1 {{#if @last}}{{else }}  || {{/if}}
	{{/columns}}
	</script>
	
	
	<script type="text/template" id="sp-modal-fillin-template">
	{{#d.results}}
	<div class="modal fade fillin-modal" id="modal-fillin-{{@root.name}}-{{Title}}" data-choicetype="{{EditFormat}}" data-action="{{@root.action}}" data-source="{{@root.name}}" data-entity="{{EntityPropertyName}}" data-for="{{Title}}" data-uiid="{{uiID}}" data-c data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="{{id}}Title" aria-hidden="true">
	<!-- Modal -->
		<div class="modal-dialog modal-dialog-centered" role="fill-in-modal" style="min-width: 600px;">
			<div class="modal-content">
				  <div class="modal-header">
					<h5 class="modal-title" id="modal-fillin-title-{{Title}}">Add new value for {{@root.name}} {{Title}}</h5>
					   <button type="button" class="close" data-dismiss="modal" aria-label="Close">
						  <span aria-hidden="true">&times;</span>
					   </button>
				  </div>
				  <div class="modal-body modal-overflow">
					  <label for="{{Title}}" style="width: 100%;">{{{replace Title '_' ' '}}}<span style="color:red;">*</span></label>
					<input name="fillin-{{@root.name}}-{{Title}}" class="form-control fill-in-value" data-uiid="{{uiID}}"></input>
				 </div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary fill-in-btn" data-dismiss="modal" data-choicetype="{{EditFormat}}" data-action="{{@root.action}}" data-entity="{{EntityPropertyName}}" data-source="{{@root.name}}" data-for="{{Title}}" data-uiid="{{uiID}}">Add to List</button>
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				</div>
			</div>
		  </div>
	</div>
	{{/d.results}}
	</script>
	
	
	<script type="text/template" id="prompt-modal-template">
	<div class="modal fade" id="{{promptID}}" data-choicetype="{{EditFormat}}" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="{{id}}Title" aria-hidden="true">
	<!-- Modal -->
		<div class="modal-dialog modal-dialog-centered" role="{{promptID}}-modal" style="min-width: {{width}};">
			<div class="modal-content" style="height: {{height}}">
				  <div class="modal-header">
					<h5 class="modal-title" id="{{promptID}}-modal-title}">{{header}}</h5>
					{{#unless removeClose}}
					   <button type="button" class="close" data-dismiss="modal" aria-label="Close">
						  <span aria-hidden="true">&times;</span>
					   </button>
					   {{/unless}}
				  </div>
				  <div class="modal-body modal-overflow">
					  <div>{{body}}</div>
				 </div>
				<div class="modal-footer">
				{{#buttons}}
					<button id="{{../promptID}}-btn-{{@index}}" type="button" {{#if close}}data-dismiss="modal"{{/if}} class="btn {{#if active}}btn-primary{{else}}btn-secondary{{/if}}{{btnClasses}}" {{!data-dismiss="modal"}}>{{text}}</button>
				{{/buttons}}
				</div>
			</div>
		  </div>
	</div>
	</script>
	
	<script type="text/template" id="sp-lookup-dropdown">
		<option value="">Please Select {{replace Title '/_/' ' '}}</option>
		{{#LookupData.results}}
			<option value="{{Id}}">{{lookupText}}</option>
		{{/LookupData.results}}
	</script>
	
	<script type="text/template" id="bootstrap-alert">
	<div class="alert alert-{{type}}" role="alert">
	{{content}}
	</div>
	</script>
	<!-- #endregion -->
	<!-- #region Styles-->
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/jQuery/jquery-ui-1.12.1/jquery-ui.min.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/materialDesign-webfont-master/css/materialdesignicons.min.css"/>

	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/bootstrap/css/bootstrap.min.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/font-awesome-4.7.0/css/font-awesome.min.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/toastr/toastr.min.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/jstree/themes/default/style.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/select2/select2.min.css"/>

	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/dataTables/datatables-1.10.20/css/dataTables.bootstrap4.min.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/datatables/autofill-2.3.4/css/autoFill.bootstrap4.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/datatables/buttons-1.6.1/css/buttons.bootstrap4.min.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/datatables/fixedheader-3.1.6/css/fixedHeader.bootstrap4.min.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/datatables/keytable-2.5.1/css/keyTable.bootstrap4.min.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/datatables/responsive-2.2.3/css/responsive.bootstrap4.min.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/datatables/rowgroup-1.1.1/css/rowGroup.bootstrap4.min.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/plugins/datatables/select-1.3.1/css/select.bootstrap4.min.css"/>
		
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/styles/loader.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/styles/style1.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/styles/style2.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/styles/style3.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/styles/style4.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/styles/style5.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/styles/style5.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/styles/style6.css"/>
	<link rel="stylesheet" type="text/css" href="/Sandbox/SitePages/styles/style7.css"/>
	<!-- #endregion -->
	<!-- #region Javascript-->
	<script type="text/javascript" src="/Sandbox/SitePages/scripts/polyfills.js?202003112300"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/scripts/matth.uuid.js?202003112300"></script>

	<script type="text/javascript" src="/Sandbox/SitePages/plugins/jQuery/jquery-1.12.4.min.js" ></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/jQuery/jquery-ui-1.12.1/jquery-ui.min.js" ></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/handlebars/handlebars-v4.7.3.js" ></script>

	<script type="text/javascript" src="/Sandbox/SitePages/plugins/bootstrap/js/bootstrap.bundle.min.js" ></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/lodash/lodash.js" ></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/moment/moment.js" ></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/toastr/toastr.min.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/jstree/jstree.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/select2/select2.min.js"></script>

	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/datatables-1.10.20/js/jquery.dataTables.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/datatables-1.10.20/js/dataTables.bootstrap4.min.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/autofill-2.3.4/js/dataTables.autoFill.min.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/autofill-2.3.4/js/autoFill.bootstrap4.min.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/buttons-1.6.1/js/dataTables.buttons.min.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/buttons-1.6.1/js/buttons.bootstrap4.min.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/buttons-1.6.1/js/buttons.html5.min.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/fixedheader-3.1.6/js/dataTables.fixedHeader.min.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/keytable-2.5.1/js/dataTables.keyTable.min.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/responsive-2.2.3/js/dataTables.responsive.min.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/responsive-2.2.3/js/responsive.bootstrap4.min.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/rowgroup-1.1.1/js/dataTables.rowGroup.min.js"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/plugins/datatables/select-1.3.1/js/dataTables.select.min.js"></script>

	<script type="text/javascript" src="/Sandbox/SitePages/scripts/handlebars-helper.js" ></script>
	<script type="text/javascript" src="/Sandbox/SitePages/scripts/jquery.spEnv.js?202003112300"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/scripts/jquery.spAsyncQueue.js?202003112300"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/scripts/jquery.spCommon.js?202003112300"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/scripts/jquery.spQuery.js?202003112300"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/scripts/jquery.spPrompt.js?202003112300"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/scripts/dt-helper.js?202003112300"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/scripts/jquery.spCRUD.js?202003112300"></script>
	<script type="text/javascript" src="/Sandbox/SitePages/scripts/jquery.spDB.js?202003112300"></script>


	<script src="/_layouts/15/sp.runtime.js"></script>  
	<script src="/_layouts/15/sp.js"></script>  
	<script src="/_layouts/15/1033/strings.js"></script>  
	<script src="/_layouts/15/clienttemplates.js"></script>  
	<script src="/_layouts/15/clientforms.js"></script>  
	<script src="/_layouts/15/clientpeoplepicker.js"></script>  
	<script src="/_layouts/15/autofill.js"></script>  
	<!-- #endregion -->
  
	<script type="text/javascript" src="/Sandbox/SitePages/apps/cm/cm.db.js?202003112300"></script>
	
	<div class="ms-hide">
	<WebPartPages:WebPartZone runat="server" title="loc:TitleBar" id="TitleBar" AllowLayoutChange="false" AllowPersonalization="false" Style="display:none;" />
  </div>
  <table class="ms-core-tableNoSpace ms-webpartPage-root" width="100%">
				<tr>
					<td id="_invisibleIfEmpty" name="_invisibleIfEmpty" valign="top" width="100%"> <WebPartPages:WebPartZone runat="server" Title="loc:FullPage" ID="FullPage" FrameType="TitleBarOnly"/> </td>
				</tr>
				<SharePoint:ScriptBlock runat="server">if(typeof(MSOLayout_MakeInvisibleIfEmpty) == "function") {MSOLayout_MakeInvisibleIfEmpty();}</SharePoint:ScriptBlock>
		</table>
</asp:Content>


