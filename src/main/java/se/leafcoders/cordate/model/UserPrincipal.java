package se.leafcoders.cordate.model;

import com.fasterxml.jackson.databind.JsonNode;

public class UserPrincipal {

	private String id;
	private String email;
	private String firstName;
	private String lastName;

	public UserPrincipal(JsonNode userData) {
		id = userData.get("id").asText();
		email = userData.get("email").asText();
		firstName = userData.get("firstName").asText();
		lastName = userData.get("lastName").asText();
	}
	
	public String getId() {
		return id;
	}
	
	public String getEmail() {
		return email;
	}
	
	public String getFullName() {
		String name = "";
		String delimiter = "";
		if (firstName != null) {
			name = firstName;
			delimiter = " ";
		}
		if (lastName != null) {
			name += delimiter + lastName;
		}
		return name;
	}
}
