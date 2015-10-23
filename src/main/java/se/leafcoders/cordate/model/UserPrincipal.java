package se.leafcoders.cordate.model;

import java.io.Serializable;
import com.fasterxml.jackson.databind.JsonNode;

public class UserPrincipal implements Serializable {

	private static final long serialVersionUID = 5918507778743857739L;

	private String id;
	private String email;
	private String fullName;
	private String jwtToken;

	public UserPrincipal(JsonNode userData) {
		id = userData.get("id").asText();
		email = userData.get("email").asText();
		fullName = userData.get("fullName").asText();
	}
	
	public String getId() {
		return id;
	}
	
	public String getEmail() {
		return email;
	}
	
	public String getFullName() {
		return fullName;
	}

	public String getJwtToken() {
		return jwtToken;
	}

	public void setJwtToken(String jwtToken) {
		this.jwtToken = jwtToken;
	}
}
