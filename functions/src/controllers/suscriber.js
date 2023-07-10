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
        "Authorization": "henryc:c3750c64e36c06768611df64fd536be3-us21",
        "Content-Type": "application/json",
      },
    };

    const mailchimpResponse = await new Promise((resolve, reject) => {
      const request = https.request(url, options, function(response){
        response.on("data", function(data){
          resolve(JSON.parse(data));
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.write(jsonData);
      request.end();
    });

    console.log(mailchimpResponse);

    if(mailchimpResponse.status === 400) {
      res.status(400).send({message: "Subscription to Mailchimp failed!"});
      return;
    }

    res.status(201).send({message: "You successfully subscribed to BOE!"});
  } catch (error) {
    res.status(500).json({
      error: [error.message],
      message: "An error occurred",
    });
  }
}
