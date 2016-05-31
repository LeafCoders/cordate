package se.leafcoders.cordate.security;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import javax.annotation.PostConstruct;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import se.leafcoders.cordate.model.UserPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service("cordateRealm")
public class CordateRealm extends AuthorizingRealm {
	
	@Value("${cordate.rosetteBaseUrl}")
	private String rosetteBaseUrl;

	@Value("${cordate.rosetteApiVersion}")
	private String rosetteApiVersion;

	@PostConstruct
	public void initialize() {
		setAuthenticationCachingEnabled(false);
	}

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
		SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
		return simpleAuthorizationInfo;
	}

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
		if (authenticationToken instanceof UsernamePasswordToken) {
			SimpleAuthenticationInfo simpleAuthenticationInfo = null;
			try {
				UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
				String providedUsername = token.getUsername();
				String providedPassword = new String(token.getPassword());
				
				String postUrl = rosetteBaseUrl + "/auth/login?username=" + providedUsername +
				        "&password=" + Base64.encodeBase64URLSafeString(providedPassword.getBytes());

				System.out.println(rosetteBaseUrl + "/auth/login");
				HttpUriRequest login = RequestBuilder.post()
	                    .setUri(new URI(postUrl))
	                    .addHeader("Content-Type", "application/json")
	                    .build();
				
				HttpClient httpClient = HttpClientBuilder.create().build();
		        HttpResponse response = httpClient.execute(login);
				if (response.getStatusLine().getStatusCode() == HttpStatus.UNAUTHORIZED.value()) {
                    throw new AuthenticationException("E-postadressen eller lösenordet är felaktigt.");
				} else {
					String responseBody = IOUtils.toString(response.getEntity().getContent(), "UTF-8");
					UserPrincipal userPrincipal = new UserPrincipal(new ObjectMapper().readTree(responseBody));
					userPrincipal.setJwtToken(response.getFirstHeader("X-AUTH-TOKEN").getValue());
					simpleAuthenticationInfo = new SimpleAuthenticationInfo(userPrincipal, providedPassword, "cordateRealm");
				}
			} catch (ClientProtocolException e) {
				e.printStackTrace();
			} catch (URISyntaxException e) {
				e.printStackTrace();
			} catch (IOException e) {
                e.printStackTrace();
                throw new AuthenticationException("Oops! Servern verkar inte vara tillgänglig just nu.");
			}

			return simpleAuthenticationInfo;
		} else {
			throw new AuthenticationException("Användarnamnet eller lösenordet är felaktigt.");
		}
	}
}
