import { AgentAPI } from ".";

export default class AgentResponse {
  private facebookPayload: any = {
    text: ""
  };
  private fulfillmentText: string = "";
  private outputContexts: any[] = [];
  constructor(
    private parameters,
    private fallbackSend,
    private agent: AgentAPI
  ) {}

  addContext = (name, lifespanCount = 2, parameters = this.parameters) => {
    this.outputContexts.push({
      name: `${this.agent.getSession()}/contexts/${name}`,
      lifespanCount,
      parameters
    });
  };
  addResponse = fn => {
    fn({
      addText: msg => {
        if (this.agent.isHeadersSent()) {
          this.fallbackSend(msg);
        } else {
          this.facebookPayload.text += msg + "\n";
          this.fulfillmentText = msg + "\n";
        }
      },
      addButton: (text, link) => {
        this.facebookPayload = {
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text,
              buttons: [
                {
                  type: "account_link",
                  url: link
                }
              ]
            }
          }
        };
      }
    });
  };
  build = () => {
    return {
      fulfillmentText: this.fulfillmentText || "I think I can't answer that",
      payload: {
        facebook: this.facebookPayload
      },
      outputContexts: this.outputContexts
    };
  };
}
