import { google } from "googleapis";
import { useFirstArgMerger } from "../ArgsMerger/useFirstArgMerger";

export default function useCalendarEvents(options) {
  google.options(options);
  return {
    getEvents: google.calendar("v3").events.list,
    insertEvent: requestBody =>
      google.calendar("v3").events.insert({ requestBody })
  };
}
