export default function VerifyMiddleware(VERIFY_TOKEN) {
  return (req, res, next) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(403);
    }
  };
}
