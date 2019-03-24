import Classifier from "./Classifier";
import fetch from "node-fetch";

export default function FlowEntry(filterCallback, entryCallback) {
  if (!entryCallback) {
    entryCallback = filterCallback;
    filterCallback = null;
  }

  return (req, res, next) => {
    const queryResult = req.body.queryResult;
    if (filterCallback && !filterCallback(queryResult.action, queryResult)) {
      next("route");
    }

    const context =
      queryResult.outputContexts &&
      queryResult.outputContexts[queryResult.outputContexts.length - 1];
    const sender = context.parameters && context.parameters.facebook_sender_id;
    if (!context) return false;

    const returnMsg = msg => res.json(msg);
    const makeSend = msg =>
      send(sender, msg, req.app.get("MESSENGER_PAGE_TOKEN"));
    const replyFn = entryCallback({
      parameters: queryResult.parameters,
      allRequiredParamsPresent: queryResult.allRequiredParamsPresent,
      context,
      sender,
      queryResult
    });
    replyFn({
      returnText: fulfillmentText => returnMsg({ fulfillmentText }),
      sendText: text => makeSend({ text }),
      returnLogin: (text, link) =>
        returnMsg({
          fulfillmentText: text + " " + link,
          payload: {
            facebook: {
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
            }
          }
        })
    });
  };
}

const send = (senderId, message, token) => {
  fetch("https://graph.facebook.com/v2.6/me/messages?access_token=" + token, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: {
        id: senderId
      },
      message
    })
  })
    .then(r => r.json())
    .then(() => {})
    .catch(console.log);
};
