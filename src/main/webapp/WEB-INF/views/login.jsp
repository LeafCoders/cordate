<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="jwr" uri="http://jawr.net/tags" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Cordate</title>

    <jwr:style src="/bundles/all.css"/> 

    <style type="text/css">
        .form-signin {
            max-width: 330px;
            padding: 15px;
            margin: 0 auto;
        }
        .form-signin .form-signin-heading,
        .form-signin .checkbox {
            margin-bottom: 10px;
        }
        .form-signin .checkbox {
            font-weight: normal;
        }
        .form-signin .form-control {
            position: relative;
            font-size: 16px;
            height: auto;
            padding: 10px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
        }
        .form-signin .form-control:focus {
            z-index: 2;
        }
        .form-signin input[type="email"] {
            margin-bottom: -1px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
        .form-signin input[type="password"] {
            margin-bottom: 10px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    </style>

    <link rel="shortcut icon" href="img/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon-57-precomposed.png">
</head>
  
<script type="text/javascript">
    function focus() {
    	document.getElementById("username").focus();
		<c:if test="${loginFailed == true}">
			document.getElementById("password").focus();
		</c:if>	
    }
</script>

<body onLoad="focus();">

<div class="navbar navbar-default navbar-static-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="#"><img src="img/logo.png" alt="Logo" width="55" height="30"> Cordate</a>
        </div>
    </div>
</div>

<div class="container">
    <div id="alerts">
        <c:if test="${errorMessage != null}">
            <div class="alert alert-danger">
                <c:if test="${loginFailed}">
                    <strong>Misslyckad inloggning</strong>
                    <br/>
                </c:if>
                ${errorMessage}
            </div>
        </c:if>
        <c:if test="${successMessage != null}">
            <div class="alert alert-success">
                ${successMessage}
            </div>
        </c:if>
    </div>

    <div id="content">
      <form method="post" action="sessions" class="form-signin">
          <input id="username" type="email" value="${username}" name="username" class="form-control" placeholder="E-postadress" autofocus>
          <input id="password" type="password" name="password" class="form-control" placeholder="Lösenord">
          <button class="btn btn-lg btn-primary btn-block" type="submit">Logga in</button>
      </form>
      <p class="text-center">
          <a href="signup">Ny användare?</a>
      </p>
    </div>
</div>
</body>
  

</html>
