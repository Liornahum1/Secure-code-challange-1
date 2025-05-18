The vulnerability in this challange is a JWT token which is not verified at all, allowing to tamper the jwt and accept it without signature.

In order to remidiate the vulnerability we have to make sure we verify the token using strong secure secret that is used to sign the token in first place.

the users object mimics a database containing user,password and role.