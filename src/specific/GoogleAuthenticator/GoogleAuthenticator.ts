import ClientAuthenticator from "../../common/ClientAuthenticator/ClientAuthenticator";
import {
  ExpirationMap,
  OneTimeMap,
  RemoteExpirationMap,
  Expirationable
} from "../../common/ExpirationMap";
import fetch from "node-fetch";
import { google } from "googleapis";
import FirestoreEntity from "../FirebaseAPI/FirestoreEntity";
import FirestoreAPI from "../FirebaseAPI/FirestoreAPI";

const REDIRECT_URL = process.env.REDIRECT_URL + "/reminder/callback";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URL
);

export default class GoogleAuthenticator extends ClientAuthenticator {
  public static instance = new GoogleAuthenticator();
  constructor() {
    super(
      "/reminder/callback",
      new OneTimeMap<any>(),
      new RemoteExpirationMap(
        new FirestoreEntity<Expirationable<any>>(
          FirestoreAPI.collection("knowledge/google/tokens")
        ),
        value => {
          return value.expiry_date - 5 * 60 * 1000;
        }
      )
    );
  }
  getAuthURL(scopes: any[], state: any): string {
    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      state,
      scope: scopes
    });
  }

  async scheduleTask(key, scope, sendAuthURL, task) {
    return super.scheduleTask(key, scope, sendAuthURL, async token => {
      oauth2Client.setCredentials(token as any);
      return await task(oauth2Client);
    });
  }
  getKeyFromReq(req: any): string {
    return req.query.state;
  }
  async getTokenFromReq(req: any, callback: (tokenObject: any) => any) {
    let { tokens } = await oauth2Client.getToken(req.query.code);
    callback(tokens);
  }
}
