import { CognitoUser } from "amazon-cognito-identity-js";
import Cookies from "universal-cookie";

class MapEOService {
  constructor() {
    let username = process.env.REACT_APP_USER_USERNAME;
    let password = process.env.REACT_APP_USER_PASSWORD;
    let geoserverHash = this.makeBasicGeoserverAuth(username, password);
    this.makeAWSCognitoAuth(username, password, geoserverHash);
  }

  makeAWSCognitoAuth(username, password, geoserverHash) {
    var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
    this.cognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID,
      ClientId: process.env.REACT_APP_CLIENT_ID,
    });
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      {
        Username: username,
        Password: password,
      }
    );
    const cognitoUser = new CognitoUser({
      Username: process.env.REACT_APP_USER_USERNAME,
      Pool: this.cognitoUserPool,
    });
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        // ... set cookies
        this.cookies = new Cookies();
        this.cookies.set(
          "IdToken",
          result.getIdToken().getJwtToken(),
          undefined,
          "/"
        );
        this.cookies.set(
          "RefreshToken",
          result.getRefreshToken().getToken(),
          undefined,
          "/"
        );
        this.cookies.set(
          "AccessToken",
          result.getAccessToken().getJwtToken(),
          undefined,
          "/"
        );
        this.cookies.set("GeoserverHash", geoserverHash, undefined, "/");
        console.log("success");
        console.log(this.cookies.getAll());
      },
      onFailure: (error) => {
        console.log("Error");
        console.log(error);
      },
    });
  }

  getCookies() {
    return this.cookies;
  }

  makeBasicGeoserverAuth(username, password) {
    const tok = username + ":" + password;
    const hash = btoa(tok);
    return "Basic " + hash;
  }
}

export default MapEOService;
