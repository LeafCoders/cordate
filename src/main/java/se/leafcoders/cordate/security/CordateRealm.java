package se.leafcoders.cordate.security;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.DefaultHttpClient;
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
import org.springframework.stereotype.Service;

@Service("cordateRealm")
public class CordateRealm extends AuthorizingRealm {
	
	@Value("${cordate.rosetteBaseUrl}")
	private String rosetteBaseUrl;

	@Value("${cordate.rosetteApiVersion}")
	private String rosetteApiVersion;

	@PostConstruct
	public void initialize() {
		setAuthenticationCachingEnabled(true);
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

				HttpClient httpClient = new DefaultHttpClient();
				HttpGet httpGet = new HttpGet(rosetteBaseUrl + "/api/" + rosetteApiVersion + "/authentication");
				httpGet.addHeader(new BasicScheme().authenticate(new UsernamePasswordCredentials(providedUsername, providedPassword), httpGet));

				HttpResponse response = httpClient.execute(httpGet);
				if (response.getStatusLine().getStatusCode() == HttpServletResponse.SC_UNAUTHORIZED) {
                    throw new AuthenticationException("Användarnamnet eller lösenordet är felaktigt.");
				} else {
					simpleAuthenticationInfo = new SimpleAuthenticationInfo(providedUsername, providedPassword, "cordateRealm");
				}
			} catch (org.apache.http.auth.AuthenticationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (ClientProtocolException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
                throw new AuthenticationException("Oops! Servern verkar inte vara tillgänglig just nu.");
			}

			return simpleAuthenticationInfo;
		} else {
			throw new AuthenticationException("Användarnamnet eller lösenordet är felaktigt.");
		}
	}
}
