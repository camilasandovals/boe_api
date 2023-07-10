import  Events  from "../models/eventsSchema.js";

export function getEvents(req, res) {
    Events.find({})
      .then((events) => {
        res.status(200).send(events);
      })
      .catch((err) => {
        console.error(err);
      });
  }