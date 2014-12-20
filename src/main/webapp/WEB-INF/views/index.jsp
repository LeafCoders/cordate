<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="jwr" uri="http://jawr.net/tags" %>

<!doctype html>
<html lang="en" ng-app="myApp">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Cordate</title>

    <jwr:style src="/bundles/bootstrap.css" />
    <jwr:style src="/bundles/app.css" />

    <link rel="shortcut icon" href="img/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon-57-precomposed.png">
</head>

<body ng-controller="MainController" ng-switch="hasLoadedApp">

<div ng-switch-when="false" style="text-align: center; padding: 20px;">Laddar...</div>

<div ng-switch-when="true">
<div class="navbar navbar-default navbar-static-top" role="navigation">
    <div class="container" ng-cloak>
        <div class="navbar-header hidden-xs">
            <a class="navbar-brand" href="#/"><img src="img/logo.png" alt="Logo" width="55" height="30"></a>
        </div>
        <ul class="main-menu nav navbar-nav">
            <li permission="view:events" class="hidden-xs"><a href="#/eventWeeks/current">{{ 'navbar.label.events' | t }}</a></li>
            <li permission="view:posters" class="hidden-xs"><a href="#/posters">{{ 'navbar.label.posters' | t }}</a></li>
            <li permission="view:bookings" class="hidden-xs"><a href="#/bookings">{{ 'navbar.label.bookings' | t }}</a></li>
            <li permission="view:uploads" class="hidden-xs"><a href="#/uploads">{{ 'navbar.label.uploads' | t }}</a></li>

            <li class="dropdown">
                <a permission="view:locations,view:resourceTypes,view:eventTypes,view:users,view:groups,view:groupMemberships,view:permissions"
                   href="" class="hidden-xs dropdown-toggle top-header" data-toggle="dropdown">
                    {{ 'navbar.label.admin' | t }} <b class="caret"></b>
                </a>
                <a href="" class="visible-xs dropdown-toggle top-header" data-toggle="dropdown">
                    <img src="img/logo.png" alt="Logo" width="55" height="30" style="margin-right:10px">
                    <div class="menu-toggle">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </div>
                </a>
                <ul class="dropdown-menu">
                    <li permission="view:events" class="visible-xs"><a href="#/eventWeeks/current">{{ 'navbar.label.events' | t }}</a></li>
                    <li permission="view:posters" class="visible-xs"><a href="#/posters">{{ 'navbar.label.posters' | t }}</a></li>
                    <li permission="view:bookings" class="visible-xs"><a href="#/bookings">{{ 'navbar.label.bookings' | t }}</a></li>
                    <li permission="view:uploads" class="visible-xs"><a href="#/uploads">{{ 'navbar.label.uploads' | t }}</a></li>

                    <li permission="view:events,view:posters,view:bookings,view:uploads" class="divider visible-xs"></li>

                    <li permission="view:locations"><a href="#/locations">{{ 'navbar.label.locations' | t }}</a></li>
                    <li permission="view:resourceTypes"><a href="#/resourceTypes">{{ 'navbar.label.resourceTypes' | t }}</a></li>
                    <li permission="view:eventTypes"><a href="#/eventTypes">{{ 'navbar.label.eventTypes' | t }}</a></li>

                    <li permission="view:locations,view:resourceTypes,view:eventTypes" class="divider"></li>

                    <li permission="view:users"><a href="#/users">{{ 'navbar.label.users' | t }}</a></li>
                    <li permission="view:groups"><a href="#/groups">{{ 'navbar.label.groups' | t }}</a></li>
                    <li permission="view:groupMemberships"><a href="#/groupMemberships">{{ 'navbar.label.groupMemberships' | t }}</a></li>
                    <li permission="view:permissions"><a href="#/permissions">{{ 'navbar.label.permissions' | t }}</a></li>

                    <li permission="view:users,view:groups,view:groupMemberships,view:permissions" class="divider visible-xs"></li>

                    <li class="dropdown-header visible-xs">${username}</li>
                    <li class="visible-xs">
                        <a href="logout">{{'navbar.label.logout' | t}}</a>
                    </li>
                </ul>
            </li>
        </ul>
        <ul class="nav navbar-nav navbar-right hidden-xs">
            <li class="dropdown">
                <a href="" class="dropdown-toggle" data-toggle="dropdown">
                    <span class="glyphicon glyphicon-user"></span>
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu">
                    <li class="dropdown-header">${username}</li>
                    <li class="divider"></li>
                    <li><a href="logout">{{'navbar.label.logout' | t}}</a></li>
                </ul>
            </li>
        </ul>
    </div>
</div>

<div class="container">
    <div id="alerts" ng-if="alerts">
        <div ng-repeat="alert in alerts">
            <div class="alert alert-{{alert.type}}">
                <span ng-if="alert.type=='success'"class="glyphicon glyphicon-ok"></span>
                <span ng-if="alert.type=='danger'"class="glyphicon glyphicon-remove"></span>
                {{ alert.text | t: alert.values }}
            </div>
        </div>
    </div>
    <div id="content">
        <div ng-view></div>
    </div>
</div>
</div>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<jwr:script src="/bundles/bootstrap.js"/> 
<jwr:script src="/bundles/angular.js"/> 
<jwr:script src="/bundles/angular-strap.js"/> 
<jwr:script src="/bundles/app.js"/> 

<script type="text/javascript">
    <%-- For collapsing the menu when clicking a link in the menu --%>
    $('.main-menu a').click(function() {
        $('.navbar-collapse.in').collapse('hide');
    })
</script>

</body>
</html>
