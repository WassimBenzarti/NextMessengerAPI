import { Router } from "express";
import { AgentAPI } from "../../common/AgentAPI";
import GoogleAuthenticator from "../GoogleAuthenticator";
import ReminderIntent from "../ReminderRouter/ReminderIntent";
import SetReminderAnyway from "../ReminderRouter/SetReminderAnywayIntent";

const router = Router();

export default router
  .use("/", GoogleAuthenticator.instance.generateRouter())
  .post("/", (req, res, next) => {
    const agent = new AgentAPI({ req, res });
    agent.handleIntents({
      "Reminder - yes": ReminderIntent,
      "Set-reminder-anyway - yes": SetReminderAnyway
    });
  });
