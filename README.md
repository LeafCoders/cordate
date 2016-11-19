cordate
=======

Admin client for rosette


## Installation

1. Set the following JVM args when starting Tomcat 7:

  > -Dcordate.internalRosetteBaseUrl=http://rosetteHostName:rosettePortNr  // Url where server is hosted (inside proxy)  
  > -Dcordate.externalRosetteBaseUrl=http://rosetteHostName:rosettePortNr  // Url where server is hosted (from Cordate) 
  > -Dcordate.rosetteApiVersion=v1                                         // API version of Rosette to use  
  > -Dnet.jawr.debug.on=false                                              // To bundle assets files (js and css)
