import AgentResponse from "./AgentResponse";
import fetch from "node-fetch";
import useMessengerProfile from "../MessengerAPI/useMessengerProfile";
import moment from "moment-timezone";

export default class AgentAPI {
  constructor(private options: { req: any; res: any }) {}

  getQuery = () => {
    return this.options.req.body.queryResult;
  };
  getIntent = () => {
    return this.getQuery().intent.displayName;
  };
  getGenericContext = () => {
    return this.getQuery().outputContexts[
      this.getQuery().outputContexts.length - 1
    ];
  };
  getParameters = () => {
    return this.getGenericContext().parameters;
  };
  getSenderKey = () => {
    return this.getParameters().facebook_sender_id;
  };
  isFacebook = () => {
    return (
      this.options.req.body.originalDetectIntentRequest.source === "facebook"
    );
  };
  isHeadersSent = () => {
    return this.options.res.headersSent;
  };
  getSession = () => {
    return this.options.req.body.session;
  };

  sendMsg = message => {
    console.log("Fallback being sent");
    fetch(
      "https://graph.facebook.com/v2.6/me/messages?access_token=" +
        this.options.req.app.get("MESSENGER_PAGE_TOKEN"),
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: {
            id: this.getSenderKey()
          },
          message
        })
      }
    )
      .then(r => r.json())
      .then(() => {})
      .catch(console.log);
  };

  handleIntents = async map => {
    if (!this.getIntent()) {
      throw new Error("Couldn't retrive the intent");
    }
    if (!map.hasOwnProperty(this.getIntent())) {
      throw new Error("Intent not supported");
    }
    const fn = map[this.getIntent()];
    const replyFn = fn({
      parameters: this.getParameters(),
      isFacebook: this.isFacebook(),
      senderKey: this.getSenderKey()
    });

    const response = new AgentResponse(
      this.getParameters(),
      text => {
        this.sendMsg({ text });
      },
      this
    );
    const { getProfile } = useMessengerProfile(
      this.options.req.app.get("MESSENGER_PAGE_TOKEN")
    );
    const profile = await getProfile(this.getSenderKey);
    moment.tz.setDefault(profile.timezone);
    await replyFn({
      profile,
      addResponse: response.addResponse /*, sendText, addContext*/,
      addContext: response.addContext
    });
    console.log(JSON.stringify(response.build(), null, 2));
    this.options.res.json(response.build());
  };
}
