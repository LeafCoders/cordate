package se.leafcoders.cordate.controller;

import java.io.IOException;
import java.net.URL;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;
import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthenticationException;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.auth.params.AuthPNames;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.*;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicHttpRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import se.leafcoders.cordate.model.UserSession;

@Controller
public class ApiProxyController {	
	
	@Autowired
	private UserSession userSession;

	@Value("${cordate.rosetteBaseUrl}")
	private String rosetteBaseUrl;

	@RequestMapping(value="/api/**", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public void proxyGet(HttpServletRequest request, HttpServletResponse response) throws ClientProtocolException, IOException, AuthenticationException {
		callRosetteServer(request, null, response);
	}

	@RequestMapping(value="/api/**", method = RequestMethod.POST, produces = "application/json;charset=utf-8")
	public void proxyPost(HttpServletRequest request, @RequestBody String requestBody, HttpServletResponse response) throws ClientProtocolException, IOException, AuthenticationException {
		callRosetteServer(request, requestBody, response);
	}

	@RequestMapping(value="/api/**", method = RequestMethod.PUT, produces = "application/json;charset=utf-8")
	public void proxyPut(HttpServletRequest request, @RequestBody String requestBody, HttpServletResponse response) throws ClientProtocolException, IOException, AuthenticationException {
		callRosetteServer(request, requestBody, response);
	}

	@RequestMapping(value="/api/**", method = RequestMethod.DELETE, produces = "application/json;charset=utf-8")
	public void proxyDelete(HttpServletRequest request, HttpServletResponse response) throws ClientProtocolException, IOException, AuthenticationException {
		callRosetteServer(request, null, response);
	}

	private void callRosetteServer(HttpServletRequest request, String requestBody, HttpServletResponse response) throws ClientProtocolException, IOException, AuthenticationException {
		HttpClient httpClient = HttpClientBuilder.create().build();
		int posApiPath = request.getRequestURI().indexOf("/api/");
		String apiPath = request.getRequestURI().substring(posApiPath);
        String requestURI = rosetteBaseUrl + apiPath;
        if (request.getQueryString() != null) {
        	requestURI += "?" + request.getQueryString();
        }

		String username = userSession.getUsername();
		String password = userSession.getPassword();
		UsernamePasswordCredentials credentials = new UsernamePasswordCredentials(username, password);

		BasicHttpRequest httpRequest = new BasicHttpRequest(request.getMethod(), request.getRequestURI());
		httpRequest.addHeader(AuthPNames.CREDENTIAL_CHARSET, "UTF-8");
        HttpResponse remoteResponse = null;
		if ("GET".equals(request.getMethod())) {
			HttpGet httpGet = new HttpGet(requestURI);
			httpGet.addHeader(new BasicScheme().authenticate(credentials, httpRequest, null));
			remoteResponse = httpClient.execute(httpGet);
		} else if ("POST".equals(request.getMethod())) {
			HttpPost httpPost = new HttpPost(requestURI);
			httpPost.setEntity(new StringEntity(requestBody, ContentType.APPLICATION_JSON));
			httpPost.addHeader(new BasicScheme().authenticate(credentials, httpRequest, null));
			remoteResponse = httpClient.execute(httpPost);
		} else if ("PUT".equals(request.getMethod())) {
			HttpPut httpPut = new HttpPut(requestURI);
			httpPut.setEntity(new StringEntity(requestBody, ContentType.APPLICATION_JSON));
			httpPut.addHeader(new BasicScheme().authenticate(credentials, httpRequest, null));
			remoteResponse = httpClient.execute(httpPut);
		} else if ("DELETE".equals(request.getMethod())) {
			HttpDelete httpDelete = new HttpDelete(requestURI);
			httpDelete.addHeader(new BasicScheme().authenticate(credentials, httpRequest, null));
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
