<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

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
  
    <script type="text/javascript">
    function focus() {
    	document.getElementById("username").focus();
		<c:if test="${loginFailed == true}">
			document.getElementById("password").focus();
		</c:if>	
    }
</script>

<body onLoad="focus();">
  <div class="container">
	  <div id="header">
	  	<c:if test="${loginFailed}">
		  <div class="alert alert-error">
				<strong>Authentication failed</strong>
				<br/>
				The username or password you entered is incorrect.
			</div>
		</div>
		</c:if>
	  <div id="content">
	  
	  	<h1>Login</h1>
		<form method="post" action="sessions">
			<label>Username</label>
			<input id="username" name="username" type="text" value="${username}"/>
	
			<label>Password</label>  
			<input id="password" name="password" type="password"/>
	
			<div class="form-actions">
		    	<button type="submit" class="btn btn-primary save">Login</button>
			</div>
		</form>
	  </div>
  </div>
</body>
  

</html>
