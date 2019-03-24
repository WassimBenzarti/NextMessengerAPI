import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../index";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
chai.use(chaiHttp);

const agent = chai.request.agent(app);

describe("Reminder", () => {
  it("Should answer", () => {
    console.log(process.env.REDIRECT_URL);

    agent
      .post("/webhook")
      .send(require("./mock.json"))
      .then(res => {
        console.log(res.body);
      });
  });
});
