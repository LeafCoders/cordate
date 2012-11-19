<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Rosette Client</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <link href="resources/css/bootstrap.min.css" rel="stylesheet">
    <style>body {padding-top:50px}</style>
    <link href="resources/css/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="resources/css/datepicker.css" rel="stylesheet">
    <link href="resources/css/timePicker.css" rel="stylesheet">
    <style type="text/css" media="screen">
      
      /* Jumbotrons
      -------------------------------------------------- */
      .jumbotron {
        position: relative;
      }
      .jumbotron h1 {
        margin-bottom: 9px;
        font-size: 81px;
        font-weight: bold;
        letter-spacing: -1px;
        line-height: 1;
      }
      .jumbotron p {
        margin-bottom: 18px;
        font-weight: 300;
      }
      .jumbotron .btn-large {
        font-size: 20px;
        font-weight: normal;
        padding: 14px 24px;
        margin-right: 10px;
        -webkit-border-radius: 6px;
           -moz-border-radius: 6px;
                border-radius: 6px;
      }
      .jumbotron .btn-large small {
        font-size: 14px;
      }

      /* Masthead (docs home) */
      .masthead {
        padding-top: 36px;
        margin-bottom: 72px;
      }
      .masthead h1,
      .masthead p {
        text-align: center;
      }
      .masthead h1 {
        margin-bottom: 18px;
      }
      .masthead p {
        margin-left: 5%;
        margin-right: 5%;
        font-size: 30px;
        line-height: 36px;
      }
    </style>
	
	<link href="resources/css/rosette.css" rel="stylesheet">
    
    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
    <link rel="shortcut icon" href="resources/icons/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="resources/icons/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="resources/icons/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="resources/icons/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="resources/icons/apple-touch-icon-57-precomposed.png">
  </head>

  <div class="container">
    <div id="header"></div>
    <div id="content"></div>
  </div>

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="resources/lib/jquery.js"></script>
    <script src="resources/lib/underscore-min.js"></script>
    <script src="resources/lib/backbone-min.js"></script>
	<script src="resources/lib/bootstrap.min.js"></script>
	<script src="resources/lib/bootstrap-datepicker.js"></script>
	<script src="resources/lib/jquery.timePicker.min.js"></script>
	<script src="resources/lib/handlebars-1.0.0.beta.6.js"></script>
    
	<script src="resources/javascripts/utils.js"></script>
	<script src="resources/javascripts/templateManager.js"></script>
    
    <script src="resources/javascripts/models/eventModel.js"></script>
    <script src="resources/javascripts/models/eventCollectionModel.js"></script>
    <script src="resources/javascripts/models/eventweekModel.js"></script>
    <script src="resources/javascripts/models/themeModel.js"></script>
    <script src="resources/javascripts/models/themeCollectionModel.js"></script>
    <script src="resources/javascripts/models/userModel.js"></script>
    <script src="resources/javascripts/models/userCollectionModel.js"></script>
    <script src="resources/javascripts/models/groupModel.js"></script>
    <script src="resources/javascripts/models/groupCollectionModel.js"></script>
    <script src="resources/javascripts/models/permissionModel.js"></script>
    <script src="resources/javascripts/models/permissionCollectionModel.js"></script>
    
    <script src="resources/javascripts/views/headerView.js"></script>
    <script src="resources/javascripts/views/homeView.js"></script>
    <script src="resources/javascripts/views/eventView.js"></script>
    <script src="resources/javascripts/views/eventCollectionView.js"></script>
    <script src="resources/javascripts/views/eventEditView.js"></script>
	<script src="resources/javascripts/views/eventweekView.js"></script>
	<script src="resources/javascripts/views/themeView.js"></script>
    <script src="resources/javascripts/views/themeCollectionView.js"></script>
    <script src="resources/javascripts/views/themeEditView.js"></script>
    <script src="resources/javascripts/views/userView.js"></script>
    <script src="resources/javascripts/views/userCollectionView.js"></script>
    <script src="resources/javascripts/views/userEditView.js"></script>
    <script src="resources/javascripts/views/groupView.js"></script>
    <script src="resources/javascripts/views/groupCollectionView.js"></script>
    <script src="resources/javascripts/views/groupEditView.js"></script>
    <script src="resources/javascripts/views/permissionView.js"></script>
    <script src="resources/javascripts/views/permissionCollectionView.js"></script>
    <script src="resources/javascripts/views/permissionEditView.js"></script>
    
    <script src="resources/javascripts/controllers/homeController.js"></script>
    <script src="resources/javascripts/controllers/eventController.js"></script>
    <script src="resources/javascripts/controllers/themeController.js"></script>
    <script src="resources/javascripts/controllers/userController.js"></script>
    <script src="resources/javascripts/controllers/groupController.js"></script>
    <script src="resources/javascripts/controllers/permissionController.js"></script>
    
    <script src="resources/javascripts/main.js"></script>

  </body>
</html>
