import GoogleAuthenticator from "../GoogleAuthenticator";
import moment from "moment";
import useCalendarEvents from "../../common/GoogleCalendarAPI";

export default function SetReminderAnyway({
  parameters,
  senderKey,
  isFacebook
}) {
  return async ({ addResponse, addContext, profile }) => {
    await GoogleAuthenticator.instance.scheduleTask(
      senderKey,
      ["https://www.googleapis.com/auth/calendar"],
      url => {
        addResponse(({ addText }) => {
          addText(
            `Hello ${
              profile.first_name
            }, Please login to your account using the button below\n` + url
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

        addResponse(({ addText }) => {
          addText(`Reminder is set successfully!`);
        });
      }
    );
  };
}
