package se.ryttargardskyrkan.cordate.controller;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class SessionController {
	
	@RequestMapping(value = "/sessions", method = RequestMethod.POST)
	public String postSession(@RequestParam String username, @RequestParam String password) {
		try {
			SecurityUtils.getSubject().login(new UsernamePasswordToken(username, password));
			
			return "redirect:/index.html";
		} catch (AuthenticationException e) {			
			return "redirect:/loginError.html";
		}
	}
	
	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	public String deleteSession() {
		SecurityUtils.getSubject().logout();
		return "redirect:/index.html";
	}
}
