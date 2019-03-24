import { ReminderRouter } from "./specific/";
import express from "express";
import MessengerRouter from "./specific/MessengerRouter";

var cors = require("cors");
const bodyParser = require("body-parser");

//const REDIRECT_URL = process.env.REDIRECT_URL;
const PAGE_TOKEN = process.env.PAGE_TOKEN;
export const app = express()
  .get("/google055a641ec9c4c2d8.html", (req, res) => {
    res.send("google-site-verification: google055a641ec9c4c2d8.html");
  })
  .set("MESSENGER_PAGE_TOKEN", PAGE_TOKEN)
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(cors({ origin: "*" }))
  .get("/", (req, res) => res.json({ success: 1 }))
  .use("/webhook", MessengerRouter)

  // Nothing
  .post("/webhook", (req, res, next) => {
    console.log(JSON.stringify(req.body, null, 4));
    next();
  })
  //.use("/webhook", ReminderRouter)
  .use((err, req, res, next) => {
    console.log(err);
  })
  .listen(process.env.PORT, () =>
    console.log("Listening on port ", process.env.PORT)
  );
