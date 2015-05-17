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

    <jwr:style src="/bundles/all.css"/> 

    <link rel="shortcut icon" href="img/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon-57-precomposed.png">
</head>

<body ng-controller="MainController" ng-switch="hasLoadedApp">

    <div ng-switch-when="false" style="text-align: center; padding: 20px;">Laddar...</div>

    <div ng-switch-when="true">
        <div class="navbar navbar-default navbar-static-top" role="navigation" ng-cloak>
            <div class="container">
                <div class="navbar-header hidden-xs">
                    <a class="navbar-brand" href="#/"><img src="img/logo.png" alt="Logo" width="55" height="30"></a>
                </div>
                <ul class="main-menu nav navbar-nav">
                    <li permission="events:view" class="hidden-xs"><a href="#/eventWeeks">{{ 'navbar.label.events' | t }}</a></li>
                    <li permission="posters:view" class="hidden-xs"><a href="#/posters">{{ 'navbar.label.posters' | t }}</a></li>
                    <li permission="bookings:view" class="hidden-xs"><a href="#/bookings">{{ 'navbar.label.bookings' | t }}</a></li>
                    <li permission="uploads:view" class="hidden-xs"><a href="#/uploads">{{ 'navbar.label.uploads' | t }}</a></li>
        
                    <li class="dropdown">
                        <a permission="locations:view;resourceTypes:view;eventTypes:view;signupUsers:view;users:view;groups:view;groupMemberships:view;permissions:view"
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
                            <li permission="events:view" class="visible-xs"><a href="#/eventWeeks">{{ 'navbar.label.events' | t }}</a></li>
                            <li permission="posters:view" class="visible-xs"><a href="#/posters">{{ 'navbar.label.posters' | t }}</a></li>
                            <li permission="bookings:view" class="visible-xs"><a href="#/bookings">{{ 'navbar.label.bookings' | t }}</a></li>
                            <li permission="uploads:view" class="visible-xs"><a href="#/uploads">{{ 'navbar.label.uploads' | t }}</a></li>
        
                            <li permission="events:view;posters:view;bookings:view;uploads:view" class="divider visible-xs"></li>
        
                            <li permission="locations:view"><a href="#/locations">{{ 'navbar.label.locations' | t }}</a></li>
                            <li permission="resourceTypes:view"><a href="#/resourceTypes">{{ 'navbar.label.resourceTypes' | t }}</a></li>
                            <li permission="eventTypes:view"><a href="#/eventTypes">{{ 'navbar.label.eventTypes' | t }}</a></li>
                            <li permission="uploadFolders:view"><a href="#/uploadFolders">{{ 'navbar.label.uploadFolders' | t }}</a></li>
        
                            <li permission="locations;resourceTypes:view;eventTypes:view;uploadFolders:view" class="divider"></li>
        
                            <li permission="signupUsers:view"><a href="#/signupUsers">{{ 'navbar.label.signupUsers' | t }}</a></li>
                            <li permission="users:view"><a href="#/users">{{ 'navbar.label.users' | t }}</a></li>
                            <li permission="groups:view"><a href="#/groups">{{ 'navbar.label.groups' | t }}</a></li>
                            <li permission="groupMemberships:view"><a href="#/groupMemberships">{{ 'navbar.label.groupMemberships' | t }}</a></li>
                            <li permission="permissions:view"><a href="#/permissions">{{ 'navbar.label.permissions' | t }}</a></li>
        
                            <li permission="signupUsers:view;users:view;groups:view;groupMemberships:view;permissions:view" class="divider visible-xs"></li>
        
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
            <div id="alerts" ng-if="alerts" ng-cloak>
                <div ng-repeat="alert in alerts" class="alert alert-{{ alert.type }}">
                    <span ng-if="alert.type=='success'"class="glyphicon glyphicon-ok"></span>
                    <span ng-if="alert.type=='danger'"class="glyphicon glyphicon-remove"></span>
                    <span ng-if="alert.header"><b>{{ alert.header | t: alert.headerParams }}</b> </span>
                    {{ alert.text | t: alert.textParams }}
                </div>
            </div>
            <div id="content">
                <div ng-view></div>
            </div>
        </div>
    </div>
    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <jwr:script src="/bundles/all.js"/>
    
    <script type="text/javascript">
        <%-- For collapsing the menu when clicking a link in the menu --%>
        $('.main-menu a').click(function() {
            $('.navbar-collapse.in').collapse('hide');
        })
    </script>
    
</body>
</html>
