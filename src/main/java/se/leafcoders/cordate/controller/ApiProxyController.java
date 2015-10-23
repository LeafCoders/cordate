package se.leafcoders.cordate.controller;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;
import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthenticationException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
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

        HttpRequestBase httpRequest = null;
		if ("GET".equals(request.getMethod())) {
			httpRequest = new HttpGet(requestURI);
		} else if ("POST".equals(request.getMethod())) {
			httpRequest = new HttpPost(requestURI);
			((HttpPost)httpRequest).setEntity(new StringEntity(requestBody, ContentType.APPLICATION_JSON));
		} else if ("PUT".equals(request.getMethod())) {
			httpRequest = new HttpPut(requestURI);
			((HttpPut)httpRequest).setEntity(new StringEntity(requestBody, ContentType.APPLICATION_JSON));
		} else if ("DELETE".equals(request.getMethod())) {
			httpRequest = new HttpDelete(requestURI);
		}

		if (httpRequest != null) {
			httpRequest.addHeader("X-AUTH-TOKEN", userSession.getJwtToken());
			HttpResponse remoteResponse = httpClient.execute(httpRequest);

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
}
