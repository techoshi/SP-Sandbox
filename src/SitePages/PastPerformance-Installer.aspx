<%@ Page language="C#" %>
<%@ Register Tagprefix="SharePoint" 
     Namespace="Microsoft.SharePoint.WebControls" 
     Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<!-- <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> -->

<html>
    <head>
        <link rel="shortcut icon" href="/_layouts/15/images/favicon.ico?rev=47" type="image/vnd.microsoft.icon" id="favicon">
        <link rel="stylesheet" type="text/css" href="/Sandbox/SiteAssets/_spa/plugins/materialDesign-webfont-master/css/materialdesignicons.min.css"/> 
        <link rel="stylesheet" type="text/css" href="/Sandbox/SiteAssets/_spa/plugins/font-awesome-4.7.0/css/font-awesome.min.css"/>
        <link rel="stylesheet" type="text/css" href="/Sandbox/SiteAssets/_spa/plugins/jstree/themes/default/style.css"/>
        <link rel="stylesheet" type="text/css" href="/_layouts/15/1033/styles/Themable/corev15.css"/>
        <title>Past Performance Installer</title>
    </head>
    <body>
        <form runat="server">
            <SharePoint:FormDigest ID="FormDigest1" runat="server"></SharePoint:FormDigest>
        </form>
        <script type="text/javascript" src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>

        <script src="/_layouts/15/sp.runtime.js"></script>  
        <script src="/_layouts/15/sp.js"></script>  
        <script src="/_layouts/15/1033/strings.js"></script>  
        <script src="/_layouts/15/clienttemplates.js"></script>  
        <script src="/_layouts/15/clientforms.js"></script> 
        <script src="/_layouts/15/clientpeoplepicker.js"></script>  
        <script src="/_layouts/15/autofill.js"></script>  
        
        <script type="text/javascript" src="/Sandbox/SiteAssets/_spa/webpack/PastPerformance.Installer.bundle.js"></script>
    </body>
</html>