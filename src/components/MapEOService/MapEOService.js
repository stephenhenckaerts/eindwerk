import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AmazonCognitoIdentity,
} from "amazon-cognito-identity-js";

class MapEOService {
  constructor() {
    var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
    this.cognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID,
      ClientId: process.env.REACT_APP_CLIENT_ID,
    });
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      {
        Username: process.env.REACT_APP_USER_USERNAME,
        Password: process.env.REACT_APP_USER_PASSWORD,
      }
    );
    const cognitoUser = new CognitoUser({
      Username: process.env.REACT_APP_USER_USERNAME,
      Pool: this.cognitoUserPool,
    });
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        // ... set cookies
        console.log("success");
        console.log(result);
      },
      onFailure: (error) => {
        console.log("Error");
        console.log(error);
      },
    });
  }
}

export default MapEOService;
