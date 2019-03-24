import GoogleAuthenticator from "../GoogleAuthenticator";
import moment from "moment";
import useCalendarEvents from "../../common/GoogleCalendarAPI";

export default function ReminderIntent({ parameters, senderKey, isFacebook }) {
  return async ({ addResponse, addContext }) => {
    if (!isFacebook) {
      addResponse(({ addText }) => {
        addText("This feature is only supported on facebook");
      });
      return;
    }
    await GoogleAuthenticator.instance.scheduleTask(
      senderKey,
      ["https://www.googleapis.com/auth/calendar"],
      url => {
        addResponse(({ addText }) => {
          addText(
            "Please login to your account using the button below\n" + url
          );
        });
      },
      async auth => {
        const startDate = moment(
          parameters["date-time"].date_time || parameters["date-time"]
        );

        const { getEvents, insertEvent } = await useCalendarEvents({
          auth,
          params: { calendarId: "primary" }
        });

        return getEvents({
          maxResults: 3,
          timeMin: startDate.toISOString(),
          timeMax: startDate
            .clone()
            .add(30, "minutes")
            .toISOString()
        }).then(({ data }) => {
          const items = (data as any).items;
          console.log(items);
          addResponse(({ addText }) => {
            if (items.length) {
              addText(
                `Hey you have ${items.length} event${
                  items.length === 1 ? "" : "s"
                } already!\n${items
                  .map(
                    item =>
                      `- ${moment(item.start.dateTime)
                        .utc()
                        .format("ddd, h:mma")} ${item.summary}\n`
                  )
                  .join("\n")}`
              );
              addText("You want me to schedule it anyway ?");
              addContext("Set-reminder-anyway-followup");
            } else {
              insertEvent({
                summary: parameters["Reminder-task"],
                start: {
                  dateTime: startDate.toISOString()
                },
                end: {
                  dateTime: startDate
                    .clone()
                    .add(30, "minutes")
                    .toISOString()
                }
              });
              addText(
                `Good, you don't have events at that time, reminder is set!`
              );
            }
          });
        });
      }
    );
  };
}
