<!doctype html>
<html lang="en" ng-app="myApp" ng-cloak>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Cordate</title>

    <link href="css/bootstrap.css" rel="stylesheet" media="screen">
    <link rel="stylesheet" href="css/app.css"/>

    <link rel="shortcut icon" href="img/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon-57-precomposed.png">
</head>

<body ng-controller="MainController">

<div class="navbar navbar-default navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" id="navbar-toggle-button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#/"><img src="img/logo.png" alt="Logo" width="55" height="30"></a>
        </div>
        <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="events-menu" ng-class="{active: currentPage=='eventweek' || currentPage=='events'}"><a href="#/eventweeks/current">{{'navbar.events' | t}}</a></li>
                <li class="users-menu" ng-class="{active: currentPage=='users'}"><a href="#/users">{{'navbar.users' | t}}</a></li>
                <li class="groups-menu" ng-class="{active: currentPage=='groups'}"><a href="#/groups">{{'navbar.groups' | t}}</a></li>
                <li class="groupMemberships-menu" ng-class="{active: currentPage=='groupMemberships'}"><a href="#/groupMemberships">{{'navbar.groupMemberships' | t}}</a></li>
                <li class="permissions-menu" ng-class="{active: currentPage=='permissions'}"><a href="#/permissions">{{'navbar.permissions' | t}}</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li class=""><a href="logout">{{'navbar.logout' | t}}</a></li>
            </ul>
        </div>
    </div>
</div>

<div class="container">
    <div id="alerts" ng-if="alerts">
        <div ng-repeat="alert in alerts">
            <div class="alert alert-{{alert.type}}">
                <span ng-if="alert.type=='success'"class="glyphicon glyphicon-ok"></span>
                <span ng-if="alert.type=='danger'"class="glyphicon glyphicon-remove"></span>
                {{ alert.text | t }}
            </div>
        </div>
    </div>
    <div id="content">
        <div ng-view></div>
    </div>
</div>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="lib/angular.js"></script>
<script src="lib/angular-route.js"></script>
<script src="lib/angular-resource.js"></script>
<script src="lib/bootstrap.min.js"></script>

<script src="js/app.js"></script>
<script src="js/services.js"></script>
<script src="js/controllers.js"></script>
<script src="js/filters.js"></script>
<script src="js/directives.js"></script>

<script src="js/i18n/sv_SE.js"></script>

<script type="text/javascript">
    <%-- For collapsing the menu when clicking a link in the menu --%>
    $('.nav a').click(function() {
        $('.navbar-collapse.in').collapse('hide');
    })
</script>

</body>
</html>
