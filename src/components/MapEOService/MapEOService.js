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
    console.log(this.cognitoUserPool);
  }
}

export default MapEOService;
