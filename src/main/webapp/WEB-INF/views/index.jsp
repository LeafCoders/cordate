<!doctype html>
<html lang="en" ng-app="myApp">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Rosette Client</title>

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <style>body {
        padding-top: 50px
    }</style>
    <link href="css/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="css/datepicker.css" rel="stylesheet">
    <link rel="stylesheet" href="css/app.css"/>

    <link rel="shortcut icon" href="img/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon-57-precomposed.png">
</head>

<body ng-controller="MainController">
<div class="container">
    <div id="header">
        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <ul class="nav">
                    <li class="events-menu" ng-class="{active: currentPage=='eventweek' || currentPage=='events'}"><a
                            href="#eventweek">Events</a></li>
                    <li class="users-menu" ng-class="{active: currentPage=='users'}"><a href="#users">Users</a></li>
                    <li class="groups-menu" ng-class="{active: currentPage=='groups'}"><a href="#groups">Groups</a></li>
                    <li class="permissions-menu" ng-class="{active: currentPage=='permissions'}"><a href="#permissions">Permissions</a>
                    </li>
                </ul>
                <ul class="nav pull-right">
                    <li class=""><a href="logout">Logout</a></li>
                </ul>
            </div>
        </div>
        <alert ng-repeat="alert in alerts" type="alert.type" close="closeAlert($index)">
            {{alert.text}}
        </alert>
    </div>
    <div id="content">
        <div ng-view></div>
    </div>
</div>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular-resource.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.2.2/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular-strap/0.6.6/angular-strap.min.js"></script>
<script src="lib/bootstrap-datepicker.js"></script>

<script src="js/app.js"></script>
<script src="js/services.js"></script>
<script src="js/controllers.js"></script>
<script src="js/filters.js"></script>
<script src="js/directives.js"></script>

</body>
</html>
