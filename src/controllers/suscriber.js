import Subscriber from "../models/subscribeSchema.js";

export async function subscribe(req, res) {
    try {
      const { email } = req.body;
      const doc = await Subscriber.findOne({ email: email.toLowerCase() })
      if (doc) {
          res.status(401).send({message: "You are already subscribed"})
          return;
        } 

        const newSubscriber = new Subscriber({
            email: email.toLowerCase(),
          });

        await newSubscriber.save();
    
        res.status(201).send({message: "You successfully subscribed to BOE!"});
    }
    catch (error) {
      res.status(500).json({
        error: [error.message],
        message: "an error",
      });
    }
  }