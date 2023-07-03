import https from 'https';
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

    const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
        },
      ],
    };

    var jsonData = JSON.stringify(data);

    const url = 'https://us21.api.mailchimp.com/3.0/lists/2f1d27d1eb';
    const options = {
      method: "POST",
      headers: {
        "Authorization": "henryc:70cedfe5133abb9c55925c001b047f97-us21",
        "Content-Type": "application/json",
      },
    };

    const request = https.request(url, options, function(response){
      response.on("data", function(data){
        console.log(JSON.parse(data));
      });
    });

    request.write(jsonData);
    request.end();

    res.status(201).send({message: "You successfully subscribed to BOE!"});
  } catch (error) {
    res.status(500).json({
      error: [error.message],
      message: "An error occurred",
    });
  }
}
