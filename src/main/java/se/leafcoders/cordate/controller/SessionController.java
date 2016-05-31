package se.leafcoders.cordate.controller;

import java.io.IOException;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.web.filter.AccessControlFilter;
import org.apache.shiro.web.util.SavedRequest;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.support.RequestContextUtils;
import se.leafcoders.cordate.model.UserPrincipal;
import se.leafcoders.cordate.model.UserSession;

@Controller
public class SessionController {
	
	@Autowired
	private UserSession userSession;

	@Value("${cordate.rosetteBaseUrl}")
	private String rosetteBaseUrl;

	@Value("${cordate.rosetteApiVersion}")
	private String rosetteApiVersion;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public ModelAndView getIndex() {
		UserPrincipal userPrincipal = (UserPrincipal)SecurityUtils.getSubject().getPrincipal();
        ModelAndView modelAndView = new ModelAndView("index");
        modelAndView.addObject("userId", userPrincipal.getId());
        modelAndView.addObject("fullName", userPrincipal.getFullName());
        modelAndView.addObject("rosetteBaseUrl", rosetteBaseUrl);
        return modelAndView;
	}
	
	@RequestMapping(value = "/sessions", method = RequestMethod.POST)
	public String postSession(@RequestParam String username, @RequestParam String password, HttpServletRequest request, HttpServletResponse response, RedirectAttributes redirectAttributes) throws IOException {
		try {
			SecurityUtils.getSubject().login(new UsernamePasswordToken(username, password));
			
			userSession.setUsername(username);
			userSession.setPassword(password);
			userSession.setJwtToken(((UserPrincipal)SecurityUtils.getSubject().getPrincipal()).getJwtToken());

			String successUrl = null;
	        boolean contextRelative = true;

	        SavedRequest savedRequest = WebUtils.getAndClearSavedRequest(request);
	        if (savedRequest != null && savedRequest.getMethod().equalsIgnoreCase(AccessControlFilter.GET_METHOD)) {
	            successUrl = savedRequest.getRequestUrl();
	            contextRelative = false;
	        }

	        if (successUrl != null) {
	        	WebUtils.issueRedirect(request, response, successUrl, null, contextRelative);
	        	return null;
	        } else 
	        	return "redirect:/";
		} catch (AuthenticationException e) {
		    e.printStackTrace();
			String errorMessage = e.getMessage();

            redirectAttributes.addFlashAttribute("loginFailed", true);
            redirectAttributes.addFlashAttribute("errorMessage", errorMessage);
			redirectAttributes.addFlashAttribute("username", username);
			return "redirect:/login";
		}
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public ModelAndView getLogin(HttpServletRequest request, HttpServletResponse response, RedirectAttributes redirectAttributes) {
		ModelAndView modelAndView = new ModelAndView("login");
		
		response.addHeader("X-cordate-login", "true");
		
		Map<String, ?> map = RequestContextUtils.getInputFlashMap(request); 
        if (map != null) {
        	modelAndView.addObject("loginFailed", map.get("loginFailed"));
            modelAndView.addObject("errorMessage", map.get("errorMessage"));
            modelAndView.addObject("successMessage", map.get("successMessage"));
        	modelAndView.addObject("username", map.get("username"));
        }
		
		return modelAndView;
	}
	
	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	public String getLogout() {
		SecurityUtils.getSubject().logout();
		return "redirect:/";
	}

	@RequestMapping(value = "/signup", method = RequestMethod.GET)
	public ModelAndView getSignup(HttpServletRequest request) {
		ModelAndView modelAndView = new ModelAndView("signup");
		Map<String, ?> map = RequestContextUtils.getInputFlashMap(request); 
        if (map != null) {
            modelAndView.addObject("errorMessage", map.get("errorMessage"));
            modelAndView.addObject("successMessage", map.get("successMessage"));
        }
		return modelAndView;
	}

	@RequestMapping(value = "/signup", method = RequestMethod.POST)
	public String postSignup(@RequestParam String email, @RequestParam String firstName, @RequestParam String lastName, @RequestParam String password, @RequestParam String permissions,
			RedirectAttributes redirectAttributes) throws ClientProtocolException, IOException {

		String requestBody = "{" + 
				"\"email\" : \"" + email + "\", " + 
				"\"firstName\" : \"" + firstName + "\", " + 
				"\"lastName\" : \"" + lastName + "\", " + 
				"\"password\" : \"" + password + "\", " + 
				"\"permissions\" : \"" + permissions + "\" }"; 

		HttpClient httpClient = HttpClientBuilder.create().build();
		HttpPost httpPost = new HttpPost(rosetteBaseUrl + "/api/" + rosetteApiVersion + "/signupUsers");
		httpPost.setEntity(new StringEntity(requestBody, ContentType.APPLICATION_JSON));
        HttpResponse remoteResponse = httpClient.execute(httpPost);

        if (remoteResponse.getStatusLine().getStatusCode() == HttpServletResponse.SC_CREATED) {
        	redirectAttributes.addFlashAttribute("successMessage", "Välkommen " + firstName + " " + lastName + "! Du kommer att få ett e-postmeddelande när din användare har aktiverats. Det kan ta upp till en dag. <b>Tills dess kommer du inte att kunna logga in med din användare</b>.");
        } else {
        	redirectAttributes.addFlashAttribute("errorMessage", "Misslyckades att registrera användaren! Försök igen.");
        }
		return "redirect:/signup";
	}
}
