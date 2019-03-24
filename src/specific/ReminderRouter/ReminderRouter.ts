import express from "express";
import fetch from "node-fetch";
import { FlowEntry } from "../../common/FlowAPI/";
import GoogleAuthenticator from "../GoogleAuthenticator/GoogleAuthenticator";
import { google } from "googleapis";
import moment from "moment";

const router = express.Router();

export default router.post(
  "/",
  FlowEntry(
    action => {
      return action === "Reminder.Reminder-yes";
    },
    ({ context, sender }) => {
      return ({ returnText, returnLogin, sendText }) => {
        GoogleAuthenticator.instance.scheduleTask(
          sender,
          ["https://www.googleapis.com/auth/calendar"],
          url => {
            returnLogin(
              "Please login to your account using the button below",
              url
            );
          },
          (token, oauth2Client) => {
            const calendarId = "wass11121996@gmail.com";
            const startDate = moment(
              context.parameters["date-time"].date_time ||
                context.parameters["date-time"]
            );
            google
              .calendar("v3")
              .events.list({
                calendarId,
                maxResults: 3,
                timeMin: startDate.toISOString(),
                timeMax: startDate
                  .clone()
                  .add(30, "minutes")
                  .toISOString(),
                auth: oauth2Client
              })
              .then(({ data }) => {
                const items = (data as any).items;
                if (items.length) {
                  sendText(
                    `Hey you have ${items.length} event${
                      items.length === 1 ? "" : "s"
                    }!\n${items.map(
                      item =>
                        `- ${moment(item.start.dateTime).format(
                          "ddd, h:mma"
                        )} ${item.summary}\n`
                    )}`
                  );
                } else {
                  sendText(
                    `Good, you don't have events at that time, reminder is set!`
                  );

                  google
                    .calendar("v3")
                    .events.insert({
                      calendarId,
                      auth: oauth2Client,
                      requestBody: {
                        summary: context.parameters["Reminder-task"],
                        start: {
                          dateTime: startDate.toISOString()
                        },
                        end: {
                          dateTime: startDate
                            .clone()
                            .add(30, "minutes")
                            .toISOString()
                        }
                      }
                    })
                    .then(console.log)
                    .catch(console.log);
                }
              });
          }
        );
      };
    }
  )
);
