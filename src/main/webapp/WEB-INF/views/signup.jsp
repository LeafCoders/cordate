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

    <jwr:style src="/bundles/bootstrap.css" />

    <link rel="shortcut icon" href="img/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon-57-precomposed.png">

    <script>
        Element.prototype.hasClassName = function(name) {
            return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
        };

        Element.prototype.addClassName = function(name) {
            if (!this.hasClassName(name)) {
                this.className = this.className ? [this.className, name].join(' ') : name;
            }
        };

        Element.prototype.removeClassName = function(name) {
            while (this.hasClassName(name)) {
                var c = this.className;
                this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
            }
        };

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        function validatePassword(password) {
            var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,60}$/;
            return re.test(password);
        }
        
        function validateForm()
        {
            var isValid = true;
            var username = document.getElementById('username');
            var firstName = document.getElementById('firstName');
            var lastName = document.getElementById('lastName');
            var email = document.getElementById('email');
            var password = document.getElementById('password');
            var passwordAgain = document.getElementById('passwordAgain');
            var permissions = document.getElementById('permissions');
            
            username.parentNode.parentNode.removeClassName('has-error');
            if (username.value == "") {
                username.parentNode.parentNode.addClassName('has-error');
                isValid = false;
            }
            
            firstName.parentNode.parentNode.removeClassName('has-error');
            if (firstName.value == "") {
                firstName.parentNode.parentNode.addClassName('has-error');
                isValid = false;
            }

            lastName.parentNode.parentNode.removeClassName('has-error');
            if (lastName.value == "") {
                lastName.parentNode.parentNode.addClassName('has-error');
                isValid = false;
            }

            email.parentNode.parentNode.removeClassName('has-error');
            if (!validateEmail(email.value)) {
                email.parentNode.parentNode.addClassName('has-error');
                isValid = false;
            }

            password.parentNode.parentNode.removeClassName('has-error');
            password.nextElementSibling.addClassName('hidden');
            passwordAgain.parentNode.parentNode.removeClassName('has-error');
            passwordAgain.nextElementSibling.addClassName('hidden');
            if (!validatePassword(password.value)) {
                password.parentNode.parentNode.addClassName('has-error');
                password.nextElementSibling.removeClassName('hidden');
                isValid = false;
            } else if (password.value != passwordAgain.value) {
                passwordAgain.parentNode.parentNode.addClassName('has-error');
                passwordAgain.nextElementSibling.removeClassName('hidden');
                isValid = false;
            }

            permissions.parentNode.parentNode.removeClassName('has-error');
            if (permissions.value == "") {
                permissions.parentNode.parentNode.addClassName('has-error');
                isValid = false;
            }

            return isValid;
        }
    </script>
</head>

<body>
    <div class="navbar navbar-default navbar-static-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand" href="login"><img src="img/logo.png" alt="Logo" width="55" height="30"> Cordate</a>
            </div>
        </div>
    </div>
    
    <div class="container">
        <div id="alerts">
            <c:if test="${errorMessage != null}">
                <div class="alert alert-danger">
                    ${errorMessage}
                </div>
            </c:if>
            <c:if test="${successMessage != null}">
                <div class="alert alert-success">
                    ${successMessage}
                </div>
            </c:if>
        </div>
        <c:if test="${successMessage == null}">
            <div id="content">
                <form method="post" action="signup" class="form-horizontal" role="form" onsubmit="return validateForm();">
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="username">Användarnamn</label>
                        <div class="col-sm-6">
                            <input class="form-control" type="text" id="username" name="username">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="firstName">Förnamn</label>
                        <div class="col-sm-6">
                            <input class="form-control" type="text" id="firstName" name="firstName">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="lastName">Efternamn</label>
                        <div class="col-sm-6">
                            <input class="form-control" type="text" id="lastName" name="lastName">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="email">Epost</label>
                        <div class="col-sm-6">
                            <input class="form-control" type="email" id="email" name="email">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="password">Lösenord</label>
                        <div class="col-sm-6">
                            <input class="form-control" type="password" id="password" name="password">
                            <span class="hidden help-block">Lösenordet måste innehålla minst 8 tecken varav minst en stor bokstav, en liten bokstav och en siffra.</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="passwordAgain">Repetera lösenord</label>
                        <div class="col-sm-6">
                            <input class="form-control" type="password" id="passwordAgain" name="passwordAgain">
                            <span class="hidden help-block">Lösenorden är olika. Skriv in igen.</span>
                        </div>
                    </div>
                    <hr>
                    <div class="form-group">
                        <label class="col-sm-3 control-label" for="permissions">Önskade rättigheter</label>
                        <div class="col-sm-6">
                            <textarea class="form-control" id="permissions" name="permissions"></textarea>
                            <span class="help-block">Ange vilka grupper som du ingår i. T.ex. mötesledare, tolkar, löfteslandet.</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-3 col-sm-9">
                            <button class="btn btn-primary" type="submit">Skapa användare</button>
                        </div>
                    </div>
                </form>    
            </div>
        </c:if>
    </div>
</body>
</html>
