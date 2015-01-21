package se.leafcoders.cordate.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthenticationException;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.*;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.DefaultHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import se.leafcoders.cordate.model.UserSession;

@Controller
public class ApiProxyController {	
	
	@Autowired
	private UserSession userSession;

	@Value("${cordate.rosetteBaseUrl}")
	private String rosetteBaseUrl;

	@RequestMapping(value="/api/**", produces = "application/json;charset=utf-8")
	public void proxyPost(HttpServletRequest request, @RequestBody String requestBody, HttpServletResponse response) throws ClientProtocolException, IOException, AuthenticationException {
		HttpClient httpClient = new DefaultHttpClient();
		String requestURI = request.getRequestURI().replaceAll("/cordate", "");
        requestURI = requestURI + "?" + request.getQueryString();
		
		String username = userSession.getUsername();
		String password = userSession.getPassword();
		UsernamePasswordCredentials credentials = new UsernamePasswordCredentials(username, password);

        HttpResponse remoteResponse = null;
		if ("GET".equals(request.getMethod())) {
			HttpGet httpGet = new HttpGet(rosetteBaseUrl + requestURI);
			httpGet.addHeader(new BasicScheme().authenticate(credentials, httpGet));
			remoteResponse = httpClient.execute(httpGet);
		} else if ("POST".equals(request.getMethod())) {
			HttpPost httpPost = new HttpPost(rosetteBaseUrl + requestURI);
			httpPost.setEntity(new StringEntity(requestBody, "application/json", "UTF-8"));
			httpPost.addHeader(new BasicScheme().authenticate(credentials, httpPost));
			remoteResponse = httpClient.execute(httpPost);
		} else if ("PUT".equals(request.getMethod())) {
			HttpPut httpPut = new HttpPut(rosetteBaseUrl + requestURI);
			httpPut.setEntity(new StringEntity(requestBody, "application/json", "UTF-8"));
			httpPut.addHeader(new BasicScheme().authenticate(credentials, httpPut));
			remoteResponse = httpClient.execute(httpPut);
		} else if ("DELETE".equals(request.getMethod())) {
			HttpDelete httpDelete = new HttpDelete(rosetteBaseUrl + requestURI);
			httpDelete.addHeader(new BasicScheme().authenticate(credentials, httpDelete));
			remoteResponse = httpClient.execute(httpDelete);
		}
						
		// Copying status
		response.setStatus(remoteResponse.getStatusLine().getStatusCode());
		
		// Copying headers
		Header[] remoteHeaders = remoteResponse.getAllHeaders();
		if (remoteHeaders != null) {
			for (Header remoteHeader : remoteHeaders) {
				if (!remoteHeader.getName().equalsIgnoreCase("Transfer-Encoding")) {
					response.addHeader(remoteHeader.getName(), remoteHeader.getValue());
				}
			}
		}
		
		// Copying response body
		byte[] bytes = IOUtils.toByteArray(remoteResponse.getEntity().getContent());
		if (bytes != null) {
			IOUtils.write(bytes, response.getOutputStream());
		}
		response.getOutputStream().flush();
	}
}
