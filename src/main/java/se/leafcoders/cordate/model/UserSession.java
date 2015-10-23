package se.leafcoders.cordate.model;

public interface UserSession {
	public String getUsername();
	public void setUsername(String username);
	public String getPassword();
	public void setPassword(String password);
	public String getJwtToken();
	public void setJwtToken(String jwtToken);
}
