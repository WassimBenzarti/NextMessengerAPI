export default function FilterByBody(
  filter,
  failCb = (req, res, next) => next("route")
) {
  return function(req, res, next) {
    if (filter(req.body)) {
      next();
    } else {
      failCb(req, res, next);
    }
    if (!res.headersSent)
      res.status(200).send("EVENT_RECEIVED");
  };
}
