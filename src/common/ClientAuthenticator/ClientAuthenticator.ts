import express from "express";
import { IMap } from "../ExpirationMap/";

export default abstract class ClientAuthenticator {
  abstract getAuthURL(scope, state: any): string;
  abstract getKeyFromReq(req: any): string;
  abstract getTokenFromReq(req: any, callback: (tokenObject) => any): void;

  constructor(
    private path: string,
    private taskQueue: IMap<string, any>,
    private tokenQueue: IMap<string, any>
  ) {}

  async getTokenFromQueue(key) {
    return await this.tokenQueue.get(key);
  }

  async scheduleTask(
    key: string,
    scope: any,
    sendAuthURL: (url: string) => any,
    task: (token: string) => any
  ) {
    const token = await this.getTokenFromQueue(key);
    if (token) {
      return task(token);
    }
    this.taskQueue.put(key, task);
    await sendAuthURL(
      process.env.REDIRECT_URL +
        "/redirect?link=" +
        escape(this.getAuthURL(scope, key))
    );
  }

  public generateRouter() {
    const router = express.Router();
    router
      .get("/redirect", (req, res, next) => {
        res.redirect(req.query.link);
      })
      .use(this.path, (req, res, next) => {
        const key = this.getKeyFromReq(req);
        this.getTokenFromReq(req, tokenObject => {
          this.tokenQueue.put(key, tokenObject);
          const scheduleTask = this.taskQueue.get(key);
          scheduleTask && scheduleTask(tokenObject);
        });
        res.send(`
        <link href="https://fonts.googleapis.com/css?family=Poppins:600" rel="stylesheet">
        <style>*{font-family:'Poppins',sans-serif; margin:0}</style>
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh">
        <h1>•ᴗ•</h1><br/>
        <h1>You successfully signed in!</h1>
        <h5>You may now go back.</h5>
        </div>`);
      });
    return router;
  }
}
