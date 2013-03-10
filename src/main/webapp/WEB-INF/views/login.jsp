<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Rosette Client</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <style>body {padding-top:50px}</style>
    <link href="css/bootstrap-responsive.min.css" rel="stylesheet">
	<link href="css/app.css" rel="stylesheet">
    
    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
    <link rel="shortcut icon" href="icons/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="icons/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="icons/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="icons/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="icons/apple-touch-icon-57-precomposed.png">
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
